import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTs } from './load-ts.mjs';
import { booking, accepted, active, milestone } from './fixtures/commercial.mjs';
const state = loadTs(new URL('../lib/quote/state.ts', import.meta.url));
const account = loadTs(new URL('../lib/account/state.ts', import.meta.url));
const { QuoteDetails, BookingProgress } = loadTs(new URL('../components/quote/QuoteDetails.tsx', import.meta.url));
const render = b => renderToStaticMarkup(React.createElement(QuoteDetails, { booking: b, busy: false, onAccept() {} }));
test('ordered server pricing, all tax components and exact totals render without configuration metadata', () => {
  const html = render(booking());
  assert.ok(html.indexOf('First service') < html.indexOf('Second service'));
  for (const text of ['CGST · 9.00%', 'SGST · 9.00%', '₹90.00', '₹1,180.00', '₹1,000.00', '₹2,000.00', '₹180.00', '₹2,180.00', 'Subtotal', 'Total tax', 'Grand total']) assert.ok(html.includes(text), text);
  for (const text of ['rule-secret', 'HALF_UP_PER_LINE_COMPONENT', 'taxEffectiveDate']) assert.ok(!html.includes(text));
});
test('zero-tax treatments remain distinct and large decimal strings remain exact', () => {
  for (const [taxTreatment, label] of [['NON_TAXABLE', 'Non-taxable'], ['EXEMPT', 'Exempt'], ['NIL_RATED', 'Nil-rated']]) {
    const b = booking(); b.quote.pricing.lines[0].taxTreatment = taxTreatment;
    assert.ok(render(b).includes(label));
  }
  const b = booking(); b.quote.pricing.grandTotal = '9007199254740993.01';
  assert.ok(render(b).includes('₹9,00,71,99,25,47,40,993.01'));
});
test('legacy scope and gross total render without invented pricing or milestones', () => {
  const b = booking(); Object.assign(b.quote, { legacy: true, pricing: null, proposedPlan: null });
  const html = render(b); assert.ok(html.includes('An itemized breakdown is not available')); assert.ok(html.includes('₹2,180.00'));
  assert.ok(!html.includes('Subtotal')); assert.ok(!html.includes('Proposed payment schedule'));
});
test('proposed milestones have no checkout controls; accepted terms retain past agreed dates', () => {
  const html = render(booking()); assert.ok(html.includes('Proposed payment schedule')); assert.ok(html.includes('1 Jan 2000'));
  assert.ok(!html.includes('Pay ₹')); assert.ok(html.includes('agreed due dates remain unchanged'));
  const acceptedHtml = render(accepted()); assert.ok(acceptedHtml.includes('Accepted payment terms')); assert.ok(acceptedHtml.includes('Quote accepted')); assert.ok(acceptedHtml.includes('IST'));
  assert.ok(!acceptedHtml.includes('Accept this quote'));
  assert.ok(render(active()).includes('active payment schedule below'));
});
test('readiness and next action gate both entry points identically, independent of accepted expiry', () => {
  for (const b of [booking(), accepted(), active(), { ...active(), paymentReady: false }, { ...active(), nextAction: 'BOOKING_CLOSED' }, { ...active(), status: 'CANCELLED' }, { ...active(), paymentReviewRequired: true }]) {
    assert.equal(account.canPay(b, false), state.canPayBooking(b, false, false));
    assert.equal(account.canAccept(b), state.canAcceptQuote(b));
  }
  assert.equal(state.canPayBooking(active(), false, false), true);
  assert.equal(state.canPayBooking(active(), true, false), false);
  assert.equal(state.canAcceptQuote(accepted()), false);
});
test('India calendar boundary and overdue labels ignore device timezone and paid milestones', () => {
  assert.equal(state.indiaToday(new Date('2026-10-06T18:29:59Z')), '2026-10-06');
  assert.equal(state.indiaToday(new Date('2026-10-06T18:30:00Z')), '2026-10-07');
  assert.equal(state.overdue(milestone(), '2026-10-07'), true);
  assert.equal(state.overdue({ ...milestone(), paid: true, remainingAmount: '0.00' }, '2026-10-07'), false);
  assert.equal(state.overdue({ ...milestone(), dueOn: '2026-10-07' }, '2026-10-07'), false);
});
test('failed or expired sessions retry only after server authorization with no unresolved attempts', () => {
  for (const status of ['FAILED', 'USER_DROPPED', 'EXPIRED', 'TERMINATED']) {
    const result = { status, canRetry: true, hasUnresolvedAttempts: false, accountingStatus: 'UNAPPLIED' };
    assert.equal(state.retryAllowed(result), true);
    assert.equal(state.retryAllowed({ ...result, hasUnresolvedAttempts: true }), false);
    assert.equal(state.retryAllowed({ ...result, canRetry: false }), false);
    assert.equal(state.retryAllowed({ ...result, accountingStatus: 'REVIEW_REQUIRED' }), false);
  }
});
test('all progress states render, without marking initial receipt or acceptance as confirmed', () => {
  for (const nextAction of ['AWAIT_QUOTE', 'REVIEW_AND_ACCEPT', 'QUOTE_EXPIRED', 'AWAIT_ADMIN_PAYMENT_ENABLEMENT', 'PAY', 'PAYMENT_COMPLETE', 'BOOKING_CLOSED']) {
    const html = renderToStaticMarkup(React.createElement(BookingProgress, { booking: { ...active(), nextAction } }));
    assert.ok(!html.includes('undefined')); assert.ok(html.includes('Booking status:'));
  }
  assert.ok(renderToStaticMarkup(React.createElement(BookingProgress, { booking: accepted() })).includes('Confirmation is a separate step'));
});
