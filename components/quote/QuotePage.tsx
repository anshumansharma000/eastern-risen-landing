"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { customerError, quoteApi, QuoteApiError, type Booking, type Invoice, type Milestone } from "@/lib/quote/api";
import { openPayment } from "@/lib/quote/payment";
import { canPayBooking, canAcceptQuote, createActionGate, overdue, retryAllowed } from "@/lib/quote/state";
import { startBackgroundRefresh } from "@/lib/refresh/background";
import "./quote.css";
import { QuoteDetails, BookingProgress } from "./QuoteDetails";
import { money, date, positive } from "@/lib/account/state";

const orderKey = "eastern-risen-current-quote-order";
async function orderStorageKey(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return `${orderKey}:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}
const subscribeLocation = () => () => {};
const getPath = () => window.location.pathname;
const getServerPath = () => "";
const tokenPattern = /^[A-Za-z0-9_-]{40,80}$/;
const orderPattern = /^er_[a-f0-9]{32}$/;

function Notice({ title, children, tone = "neutral" }: { title: string; children?: React.ReactNode; tone?: "neutral" | "warm" | "success" }) {
  return <div className={`quote-notice quote-notice--${tone}`} role="status"><strong>{title}</strong>{children ? <p>{children}</p> : null}</div>;
}
function ContactLink() { return <Link className="quote-text-link" href="/contact/" referrerPolicy="no-referrer">Contact Eastern Risen <span aria-hidden="true">↗</span></Link>; }

function InvoiceDetails({ invoice, payments }: { invoice: Invoice; payments: Booking["payments"] }) {
  return <section className="quote-card" aria-labelledby="invoice-title"><div className="quote-card__heading"><div><p className="eyebrow">Issued invoice</p><h2 id="invoice-title">Payment overview.</h2></div><span className="quote-invoice-number">{invoice.number || "Number pending"}<small>{date(invoice.date)}</small></span></div>
    <p>Payment status: {invoice.paymentStatus.replaceAll("_", " ").toLowerCase()}</p><dl className="quote-balance"><div><dt>Invoice total</dt><dd>{money(invoice.total)}</dd></div><div><dt>Received</dt><dd>{money(invoice.received)}</dd></div><div className="quote-balance__due"><dt>Amount due</dt><dd>{money(invoice.due)}</dd></div></dl>
    {payments.length > 0 ? <div className="quote-receipts"><h3>Recorded payments</h3><ul>{payments.map((payment, index) => <li key={`${payment.number}-${index}`}><span><strong>Receipt {payment.number}</strong><small>{date(payment.date)} · {payment.method === "GATEWAY" ? "Online payment" : payment.method}</small></span><strong>{money(payment.amount)}</strong></li>)}</ul></div> : null}
  </section>;
}

function MilestoneList({ milestones, canPay, busyId, onPay }: { milestones: Milestone[]; canPay: boolean; busyId: string | null; onPay: (milestone: Milestone) => void }) {
  return <section className="quote-card" aria-labelledby="schedule-title"><div className="quote-card__heading"><div><p className="eyebrow">Active payment schedule</p><h2 id="schedule-title">At a comfortable pace.</h2></div></div><ol className="quote-milestones">{[...milestones].sort((a, b) => a.position - b.position).map((milestone) => <li key={milestone.id}><div className="quote-milestone__number">{String(milestone.position).padStart(2, "0")}</div><div className="quote-milestone__main"><div><h3>{milestone.label}</h3><p>Due {date(milestone.dueOn)}{overdue(milestone) ? " · Overdue" : ""}</p></div><div className="quote-milestone__amount"><strong>{money(milestone.amount)}</strong><span>{milestone.paid ? "Paid" : `${milestone.status.replaceAll("_", " ").toLowerCase()} · ` + `${money(milestone.remainingAmount)} remaining`}</span></div></div>{!milestone.paid && positive(milestone.remainingAmount) && canPay ? <button className="button" type="button" disabled={busyId !== null} aria-busy={busyId === milestone.id} onClick={() => onPay(milestone)}>{busyId === milestone.id ? "Opening secure payment…" : `Pay ${money(milestone.remainingAmount)}`}</button> : milestone.paid ? <span className="quote-paid">Paid</span> : null}</li>)}</ol></section>;
}

export function QuotePage() {
  const path = useSyncExternalStore(subscribeLocation, getPath, getServerPath);
  const token = path.match(/^\/quote\/([A-Za-z0-9_-]{40,80})\/?$/)?.[1] ?? "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [quoteChanged, setQuoteChanged] = useState(false);
  const currentBooking = useRef<Booking | null>(null);
  const requestNumber = useRef(0);
  const inFlight = useRef(false);
  const lastSuccess = useRef(0);
  const [message, setMessage] = useState("");
  const [acceptRevision, setAcceptRevision] = useState(0);
  const [accepting, setAccepting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [review, setReview] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const actionGate = useRef(createActionGate());
  const lastPaymentCheck = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async (showLoading = false, background = false) => {
    if (!tokenPattern.test(token)) return;
    if (background && (actionGate.current.busy || inFlight.current || Date.now() - lastSuccess.current < 30_000)) return;
    const number = ++requestNumber.current;
    inFlight.current = true; setRefreshing(true);
    if (showLoading) setLoading(true);
    try {
      const next = await quoteApi.booking(token);
      if (number !== requestNumber.current) return;
      const previous = currentBooking.current?.quote?.version;
      if (previous !== undefined && next.quote && previous !== next.quote.version) setQuoteChanged(true);
      currentBooking.current = next; lastSuccess.current = Date.now();
      setBooking(next); setRefreshError("");
    } catch (error) {
      if (number !== requestNumber.current) return;
      if (error instanceof QuoteApiError && [401, 403, 404].includes(error.status)) { currentBooking.current = null; setBooking(null); setMessage(customerError(error)); }
      else if (currentBooking.current) setRefreshError("Couldn’t update. Your previously loaded details are still displayed.");
      else setMessage(customerError(error));
    } finally {
      if (number === requestNumber.current) { inFlight.current = false; setLoading(false); setRefreshing(false); }
    }
  }, [token]);

  const reconcile = useCallback(async (orderId: string) => {
    if (!actionGate.current.acquire()) return;
    requestNumber.current++; lastPaymentCheck.current = Date.now();
    setChecking(true);
    try {
      const result = await quoteApi.reconcile(token, orderId);
      if (result.status === "PAID") { sessionStorage.removeItem(await orderStorageKey(token)); setPendingOrder(null); setReview(false); setAttempts(0); await refresh(); setMessage("Payment confirmed. We are updating your invoice and receipt details."); }
      else if (result.status === "REVIEW_REQUIRED") { await refresh(); setReview(true); }
      else if (retryAllowed(result)) { sessionStorage.removeItem(await orderStorageKey(token)); setPendingOrder(null); setReview(false); setAttempts(0); await refresh(); setMessage("The previous payment was not completed. You may try the active payment again."); }
      else { setAttempts((count) => count + 1); setMessage(""); await refresh(); }
    } catch (error) {
      setMessage(customerError(error)); setAttempts((count) => count + 1);
    } finally { setChecking(false); actionGate.current.release(); }
  }, [refresh, token]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    currentBooking.current = null; lastSuccess.current = 0;
    queueMicrotask(async () => {
      if (!active) return;
      setBooking(null); setQuoteChanged(false); setRefreshError("");
      const key = await orderStorageKey(token);
      if (!active) return;
      const stored = sessionStorage.getItem(key);
      if (stored && orderPattern.test(stored)) { setPendingOrder(stored); void reconcile(stored); }
      else { sessionStorage.removeItem(key); }
      void refresh(true);
    });
    // Cleanup invalidates outstanding requests; this ref is a sequence counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { active = false; requestNumber.current++; inFlight.current = false; };
  }, [token, refresh, reconcile]);

  useEffect(() => {
    if (!token) return;
    return startBackgroundRefresh(() => refresh(false, true));
  }, [token, refresh]);

  useEffect(() => {
    const check = () => {
      if (pendingOrder && document.visibilityState === "visible" && navigator.onLine !== false && Date.now() - lastPaymentCheck.current >= 30_000) void reconcile(pendingOrder);
    };
    window.addEventListener("focus", check); window.addEventListener("online", check); document.addEventListener("visibilitychange", check);
    return () => { window.removeEventListener("focus", check); window.removeEventListener("online", check); document.removeEventListener("visibilitychange", check); };
  }, [pendingOrder, reconcile]);

  useEffect(() => {
    if (retryTimer.current) clearTimeout(retryTimer.current);
    if (pendingOrder && attempts > 0 && attempts <= 3 && !checking && !review) retryTimer.current = setTimeout(() => { if (document.visibilityState === "visible" && navigator.onLine !== false) void reconcile(pendingOrder); }, attempts * 5000);
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current); };
  }, [pendingOrder, attempts, checking, review, reconcile]);

  async function accept(version: number) {
    if (!token || !booking || !canAcceptQuote(booking) || booking.quote?.version !== version || !actionGate.current.acquire()) return;
    requestNumber.current++; setAccepting(true); setMessage("");
    try { await quoteApi.accept(token, version); await refresh(); setQuoteChanged(false); setMessage("Thank you. Your quote acceptance has been recorded."); }
    catch (error) { setAcceptRevision(n => n + 1); await refresh(); setMessage(customerError(error)); }
    finally { setAccepting(false); actionGate.current.release(); }
  }

  async function pay(milestone: Milestone) {
    if (!token || !booking || !canPayBooking(booking, Boolean(pendingOrder), review) || milestone.paid || !positive(milestone.remainingAmount) || !booking.milestones.some(m => m.id === milestone.id) || !actionGate.current.acquire()) return;
    requestNumber.current++; setBusyId(milestone.id); setMessage("");
    try {
      const checkout = await quoteApi.checkout(token, milestone.id);
      if (!orderPattern.test(checkout.orderId)) throw new Error("Invalid payment order");
      sessionStorage.setItem(await orderStorageKey(token), checkout.orderId); setPendingOrder(checkout.orderId);
      try { await openPayment(checkout); } catch { /* A dismissed or failed popup still requires backend reconciliation. */ }
      actionGate.current.release();
      await reconcile(checkout.orderId);
    } catch (error) {
      if (!(error instanceof QuoteApiError) || error.status === 0 || ["PAYMENT_ORDER_PENDING", "PAYMENT_ORDER_UNAVAILABLE", "PAYMENT_ORDER_AMOUNT_CHANGED", "PAYMENT_REVIEW_REQUIRED", "PAYMENTS_UNAVAILABLE", "PAYMENT_PROVIDER_UNAVAILABLE", "PAYMENT_PROVIDER_ERROR", "PAYMENT_PROVIDER_RESPONSE_INVALID"].includes(error.code)) setReview(true);
      await refresh(); setMessage(customerError(error));
    } finally { setBusyId(null); actionGate.current.release(); }
  }

  const valid = Boolean(token);
  const payable = booking && canPayBooking(booking, Boolean(pendingOrder), review);
  return <><a className="skip-link" href="#quote-main">Skip to quote</a><div className="quote-page"><header className="quote-header"><div className="quote-shell"><span className="quote-brand"><Image src="/images/eastern-risen-logo-dark.png" width={922} height={271} alt="Eastern Risen" priority unoptimized /></span><span className="quote-header__label">Private journey proposal</span></div></header><main id="quote-main" className="quote-shell quote-main">
    {!path ? <div className="quote-empty" role="status"><p className="eyebrow">Your private journey</p><h1>Preparing your quote…</h1></div> : !valid ? <div className="quote-empty"><p className="eyebrow">Private link</p><h1>This link is incomplete.</h1><p>Please open the full link shared by our team.</p><ContactLink /></div> : loading && !booking ? <div className="quote-empty" role="status" aria-live="polite"><p className="eyebrow">Your private journey</p><h1>Preparing your quote…</h1><p>We’re loading the latest details.</p></div> : !booking ? <div className="quote-empty" role="alert"><p className="eyebrow">Private link</p><h1>We couldn’t open this quote.</h1><p>{message || "Please try again."}</p><button className="button" type="button" onClick={() => void refresh(true)}>Try again</button><ContactLink /></div> : <>
      <section className="quote-intro"><div><p className="eyebrow">Prepared personally for you <span aria-hidden="true">·</span> {booking.reference}</p><h1>{booking.title}</h1><p>Take your time to review the details of your journey and its payment schedule.</p></div><div className="quote-dates"><span>Travel dates</span><strong>{booking.serviceStartsOn ? `${date(booking.serviceStartsOn)}${booking.serviceEndsOn ? ` — ${date(booking.serviceEndsOn)}` : ""}` : "To be confirmed"}</strong></div></section>
      <div className="quote-refresh"><button className="quote-inline-button" disabled={refreshing || accepting || busyId !== null || checking} aria-busy={refreshing} onClick={() => void refresh()}>{refreshing ? "Refreshing…" : "Refresh details"}</button></div>
      {refreshError ? <div className="quote-message" role="status">{refreshError} <button className="quote-inline-button" disabled={refreshing} onClick={() => void refresh()}>Try again</button></div> : null}
      {quoteChanged ? <Notice title="Your quote has been updated">Please review the latest terms before accepting.</Notice> : null}
      {message ? <div className="quote-message" role="alert">{message}</div> : null}
      {booking.status === "CANCELLED" ? <Notice title="This booking has been cancelled" tone="warm">Please contact our team if you need help with this journey.</Notice> : booking.status === "COMPLETED" ? <Notice title="This journey is complete" tone="success">Your quote and payment records remain available below.</Notice> : null}
      <BookingProgress booking={booking} />{booking.quote ? <QuoteDetails key={`${booking.quote.version}:${acceptRevision}`} booking={booking} onAccept={accept} busy={accepting || refreshing || checking || busyId !== null} /> : <Notice title="Your quote is being prepared">Our team will share the details here when they’re ready.</Notice>}
      {booking.quote?.acceptedAt && !booking.invoice ? <Notice title="Invoice and payment schedule are being prepared">We’ll add them here once they’re issued. No payment is needed yet.</Notice> : null}
      {booking.invoice ? <InvoiceDetails invoice={booking.invoice} payments={booking.payments} /> : null}
      {booking.paymentReviewRequired || review ? <Notice title="Your payment needs a little review" tone="warm">Our team is checking it. Please avoid another payment for now. <ContactLink />{pendingOrder && <button className="quote-inline-button" type="button" disabled={checking} onClick={() => void reconcile(pendingOrder)}>{checking ? "Checking…" : "Check payment status"}</button>}</Notice> : pendingOrder ? <Notice title="We are checking your payment" tone="warm">Please wait while we confirm the result. Avoid starting another payment. <button className="quote-inline-button" type="button" disabled={checking} onClick={() => void reconcile(pendingOrder)}>{checking ? "Checking…" : "Check payment status"}</button></Notice> : null}
      {booking.invoice && booking.milestones.length > 0 ? <MilestoneList milestones={booking.milestones} canPay={Boolean(payable)} busyId={busyId} onPay={pay} /> : null}
      <div className="quote-help"><p>Need a hand with your quote or payment?</p><ContactLink /></div>
    </>}
  </main><footer className="quote-footer"><div className="quote-shell">© {new Date().getFullYear()} Eastern Risen Expedition Pvt. Ltd. <span>Private journey details</span></div></footer></div></>;
}
