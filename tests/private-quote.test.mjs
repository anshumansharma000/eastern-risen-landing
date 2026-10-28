import assert from "node:assert/strict";
import test from "node:test";

import { loadTs as load } from './load-ts.mjs';
const loadTs = path => load(new URL(path, import.meta.url));
process.env.NEXT_PUBLIC_QUOTE_API_BASE_URL = "https://api.example.test";
process.env.NEXT_PUBLIC_CASHFREE_MODE = "sandbox";
const api = await loadTs("../lib/quote/api.ts");
const state = await loadTs("../lib/quote/state.ts");
const payment = await loadTs("../lib/quote/payment.ts");
const token = "a".repeat(43);
const quote = { version: 2, description: "A personal journey", inclusions: "Guides", exclusions: "Flights", terms: "Please review", total: "12345.67", currency: "INR", expiresOn: "2099-12-31", acceptedAt: null };
const booking = { reference: "ER-1", title: "Odisha journey", status: "QUOTED", nextAction: "REVIEW_AND_ACCEPT", paymentReady: false, serviceStartsOn: null, serviceEndsOn: null, quote, invoice: null, paymentReviewRequired: false, payments: [], milestones: [] };
const invoice = { number: "INV-1", date: "2026-09-28", total: "12345.67", received: "0.00", due: "12345.67", paymentStatus: "UNPAID" };
const milestone = { id: "8a2dbca5-0306-4868-b449-2866cad8d378", position: 1, label: "Initial payment", amount: "3703.70", dueOn: "2026-10-01", paid: false, remaining: "3703.70" };

function mockResponse(data, status = 200) { return new Response(JSON.stringify(status >= 400 ? { error: data } : { data }), { status, headers: { "content-type": "application/json" } }); }

test("draft quote waits for staff and accepted quote waits for an invoice", () => {
  assert.equal(state.canAcceptQuote({ ...booking, status: "DRAFT", quote: null }), false);
  assert.equal(state.canPayBooking({ ...booking, quote: { ...quote, acceptedAt: "2026-09-28T12:00:00Z" } }, false, false), false);
  assert.equal(state.canAcceptQuote(booking, "2026-09-28"), true);
});

test("expired, accepted, cancelled and completed quotes cannot be accepted", () => {
  assert.equal(state.canAcceptQuote({ ...booking, quote: { ...quote, expiresOn: "2026-09-27" } }, "2026-09-28"), false);
  assert.equal(state.canAcceptQuote({ ...booking, quote: { ...quote, acceptedAt: "2026-09-28T12:00:00Z" } }), false);
  assert.equal(state.canAcceptQuote({ ...booking, status: "CANCELLED" }), false);
  assert.equal(state.canAcceptQuote({ ...booking, status: "COMPLETED" }), false);
});

test("payable milestone is blocked by a pending order, review or paid invoice", () => {
  const payable = { ...booking, status: "INVOICED", nextAction: "PAY", paymentReady: true, quote: { ...quote, acceptedAt: "2026-09-28T12:00:00Z" }, invoice, milestones: [milestone] };
  assert.equal(state.canPayBooking(payable, false, false), true);
  assert.equal(state.canPayBooking(payable, true, false), false);
  assert.equal(state.canPayBooking(payable, false, true), false);
  assert.equal(state.canPayBooking({ ...payable, paymentReviewRequired: true }, false, false), false);
  assert.equal(state.canPayBooking({ ...payable, invoice: { ...invoice, due: "0.00" } }, false, false), false);
});

test("API fetches booking, accepts the exact version and checks out without a body or referrer", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push([url, options]); return mockResponse(calls.length === 1 ? booking : calls.length === 2 ? quote : { provider: "cashfree", sessionId: "session", orderId: `er_${"a".repeat(32)}`, amount: "3703.70" }); };
  assert.deepEqual(await api.quoteApi.booking(token), booking);
  assert.deepEqual(await api.quoteApi.accept(token, quote.version), quote);
  assert.equal((await api.quoteApi.checkout(token, milestone.id)).amount, "3703.70");
  assert.equal(calls[1][0], `https://api.example.test/api/v1/core/public/bookings/${token}/accept`);
  assert.equal(calls[2][0], `https://api.example.test/api/v1/core/public/bookings/${token}/milestones/${milestone.id}/checkout`);
  for (const [, options] of calls) { assert.equal(options.referrerPolicy, "no-referrer"); assert.equal(options.cache, "no-store");  }
  assert.equal(calls[1][1].method, "POST");
  assert.deepEqual(JSON.parse(calls[1][1].body), { quoteVersion: 2 });
  assert.equal(calls[0][1].body, undefined); assert.equal(calls[2][1].body, undefined);
});

test("reconciliation distinguishes pending, verified paid and staff review", async () => {
  for (const status of ["PENDING", "PAID", "REVIEW_REQUIRED"]) {
    globalThis.fetch = async () => mockResponse({ status, receiptId: status === "PAID" ? "receipt-1" : null });
    const result = await api.quoteApi.reconcile(token, `er_${"a".repeat(32)}`);
    assert.equal(result.status, status);
    assert.equal(result.receiptId, status === "PAID" ? "receipt-1" : null);
  }
});

test("verified paid receipt and zero balance come from refreshed booking data", async () => {
  const paidBooking = { ...booking, quote: { ...quote, acceptedAt: "2026-09-28T12:00:00Z" }, invoice: { ...invoice, received: "12345.67", due: "0.00" }, payments: [{ number: "RCPT-1", date: "2026-09-28", amount: "12345.67", method: "GATEWAY" }], milestones: [{ ...milestone, paid: true, remaining: "0.00" }] };
  globalThis.fetch = async () => mockResponse(paidBooking);
  const refreshed = await api.quoteApi.booking(token);
  assert.equal(refreshed.payments[0].number, "RCPT-1");
  assert.equal(refreshed.invoice.due, "0.00");
  assert.equal(state.canPayBooking(refreshed, false, false), false);
});

test("invalid or rotated link and unavailable service get safe messages", async () => {
  globalThis.fetch = async () => mockResponse({ code: "NOT_FOUND", message: "internal token detail" }, 404);
  await assert.rejects(api.quoteApi.booking(token), (error) => error.status === 404 && !api.customerError(error).includes("internal token"));
  globalThis.fetch = async () => mockResponse({ code: "DOWN", message: "internal service detail" }, 503);
  await assert.rejects(api.quoteApi.checkout(token, milestone.id), (error) => error.status === 503 && !api.customerError(error).includes("internal service"));
});

test("Cashfree sandbox popup uses the session and never infers paid status", async () => {
  const calls = [];
  globalThis.window = { Cashfree: ({ mode }) => { calls.push(mode); return { checkout: async (options) => { calls.push(options); return { paymentDetails: { paymentMessage: "SUCCESS" } }; } }; } };
  const result = await payment.openPayment({ provider: "cashfree", sessionId: "test-session", orderId: `er_${"a".repeat(32)}`, amount: "3703.70" });
  assert.equal(result, undefined);
  assert.deepEqual(calls, ["sandbox", { paymentSessionId: "test-session", redirectTarget: "_modal" }]);
});

test("duplicate action is blocked until the first finishes", async () => {
  const gate = state.createActionGate();
  assert.equal(gate.acquire(), true);
  assert.equal(gate.acquire(), false);
  gate.release();
  assert.equal(gate.acquire(), true);
});
