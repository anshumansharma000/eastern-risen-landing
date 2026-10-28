'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccountError, type CustomerClient } from '@/lib/account/api';
import type { Booking, Reconciliation } from '@/lib/quote/api';
import { openPayment } from '@/lib/quote/payment';
import { canAccept, canPay, date, isAbort, money, positive, reconciliationDelay } from '@/lib/account/state';
import { getOrder, orderKey, storeOrder } from '@/lib/account/orders';
import { Contact, ErrorNotice, Notice, RefreshNotice, Receipts, Status } from './ui';
import { QuoteDetails, BookingProgress } from '../quote/QuoteDetails';
import { overdue, retryAllowed } from '@/lib/quote/state';
import { useRecord } from './useRecord';
export function BookingDetail({ client, identity, customerId, bookingId, refreshAccounts }: { client: CustomerClient; identity: string; customerId: string; bookingId: string; refreshAccounts: () => Promise<void> }) {
  const path = `/accounts/${customerId}/bookings/${bookingId}`;
  const { data: booking, error, loading, refreshing, refreshError, refresh, failed, alive, setError, beginMutation, endMutation } = useRecord<Booking>(client, path, refreshAccounts);
  const [acceptRevision, setAcceptRevision] = useState(0); const [busy, setBusy] = useState(false); const [order, setOrder] = useState<string | null>(null); const [attempts, setAttempts] = useState(0); const [blocked, setBlocked] = useState(false); const [notice, setNotice] = useState(''); const gate = useRef(false); const key = orderKey(identity, customerId, bookingId);
  const lastPaymentCheck = useRef(0);
  const quoteVersion = booking?.quote?.version; const previousVersion = useRef<number | undefined>(undefined);
  useEffect(() => { if (quoteVersion === undefined) return; const changed = previousVersion.current !== undefined && previousVersion.current !== quoteVersion; previousVersion.current = quoteVersion; queueMicrotask(() => { if (changed) setNotice('Your quote has been updated. Please review the latest terms before accepting.'); }); }, [quoteVersion]);
  const reconcile = useCallback(async (id: string) => {
    if (gate.current || !alive.current) return; gate.current = true; beginMutation(); setBusy(true); lastPaymentCheck.current = Date.now();
    try {
      const result = await client.data<Reconciliation>(`${path}/orders/${encodeURIComponent(id)}/reconcile`, 'POST');
      if (!alive.current) return;
      setAttempts(n => n + 1);
      if (result.status === 'PAID' || retryAllowed(result)) { storeOrder(key, null); setOrder(null); setBlocked(false); }
      if (result.status === 'REVIEW_REQUIRED') setBlocked(true);
      await refresh();
      if (alive.current) setNotice(result.status === 'PAID' ? 'Payment verified by the server. See your refreshed balances and confirmed receipts below.' : result.status === 'REVIEW_REQUIRED' ? 'Your payment needs staff review. Contact Eastern Risen and avoid another payment.' : retryAllowed(result) ? 'The previous payment was not completed. You may try payment again.' : 'Payment has not yet been confirmed. Check again shortly. Please avoid another payment.');
    } catch (e) { if (alive.current && !isAbort(e)) { setAttempts(4); await failed(e); } }
    finally { endMutation(); gate.current = false; if (alive.current) setBusy(false); }
  }, [alive, client, failed, key, path, refresh, beginMutation, endMutation]);
  useEffect(() => {
    const stored = getOrder(key);
    if (stored) queueMicrotask(() => { if (alive.current) { setOrder(stored); void reconcile(stored); } });
  }, [key, alive, reconcile]);
  useEffect(() => {
    const check = () => {
      if (order && document.visibilityState === 'visible' && navigator.onLine !== false && Date.now() - lastPaymentCheck.current >= 30_000) void reconcile(order);
    };
    window.addEventListener('focus', check); window.addEventListener('online', check); document.addEventListener('visibilitychange', check);
    return () => { window.removeEventListener('focus', check); window.removeEventListener('online', check); document.removeEventListener('visibilitychange', check); };
  }, [order, reconcile]);
  useEffect(() => {
    const delay = reconciliationDelay(attempts, busy, blocked);
    if (!order || delay === null) return;
    const timer = setTimeout(() => { if (document.visibilityState === 'visible' && navigator.onLine !== false) void reconcile(order); }, delay);
    return () => clearTimeout(timer);
  }, [order, busy, attempts, blocked, reconcile]);
  async function accept(version: number) {
    if (!booking || !canAccept(booking) || booking.quote?.version !== version || gate.current) return; gate.current = true; beginMutation(); setBusy(true); setError(null);
    try { await client.data(`${path}/accept`, 'POST', { quoteVersion: version }); await refresh(); if (alive.current) setNotice('Quote acceptance recorded.'); }
    catch (e) { if (alive.current && !isAbort(e)) { setAcceptRevision(n => n + 1); await refresh(); await failed(e); } }
    finally { endMutation(); gate.current = false; if (alive.current) setBusy(false); }
  }
  async function pay(milestoneId: string) {
    if (!booking || !canPay(booking, Boolean(order) || blocked) || !booking.milestones.some(m => m.id === milestoneId && !m.paid && positive(m.remainingAmount)) || gate.current) return;
    gate.current = true; beginMutation(); setBusy(true); setError(null);
    try {
      const checkout = await client.checkout(customerId, bookingId, milestoneId);
      if (!alive.current) return;
      storeOrder(key, checkout.orderId); setOrder(checkout.orderId); setAttempts(0);
      try { await openPayment(checkout); } catch { /* Popup completion or dismissal is never payment proof. */ }
      if (!alive.current) return;
      gate.current = false; await reconcile(checkout.orderId);
    } catch (e) {
      if (alive.current && !isAbort(e)) {
        // Network ambiguity/review/provider setup failures must not trigger competing collection.
        if (!(e instanceof AccountError) || e.status === 0 || ['PAYMENT_REVIEW_REQUIRED', 'PAYMENT_ORDER_AMOUNT_CHANGED', 'PAYMENT_ORDER_PENDING', 'PAYMENT_ORDER_UNAVAILABLE', 'PAYMENTS_UNAVAILABLE', 'PAYMENT_PROVIDER_UNAVAILABLE', 'PAYMENT_PROVIDER_ERROR', 'PAYMENT_PROVIDER_RESPONSE_INVALID'].includes(e.code)) setBlocked(true);
        await refresh(); await failed(e);
      }
    } finally { endMutation(); gate.current = false; if (alive.current) setBusy(false); }
  }
  return <><a className="account-back-link" href="/account/bookings/">← All bookings</a><div className="account-toolbar"><button disabled={busy || refreshing} aria-busy={refreshing} onClick={() => void refresh()}>{refreshing ? 'Refreshing…' : 'Refresh booking'}</button>{order && <button disabled={busy} onClick={() => void reconcile(order)}>{busy ? 'Checking…' : 'Check payment status'}</button>}</div><ErrorNotice error={error} /><RefreshNotice failed={refreshError} refreshing={refreshing} retry={refresh} />{notice && <Notice>{notice}</Notice>}{loading ? <Notice>Loading booking…</Notice> : booking ? <><section className="account-card account-booking-summary"><div className="account-card-heading"><p className="eyebrow">{booking.reference}</p><Status>{booking.status}</Status></div><h2>{booking.title}</h2><p>{date(booking.serviceStartsOn)}{booking.serviceEndsOn ? ` — ${date(booking.serviceEndsOn)}` : ''}</p>{['CANCELLED', 'COMPLETED', 'CONFIRMED'].includes(booking.status) && <Notice>{booking.status === 'CANCELLED' ? 'This booking is cancelled. Your historical records remain available.' : booking.status === 'COMPLETED' ? 'This journey is complete. Your records remain available.' : 'Your booking is confirmed.'}</Notice>}</section><BookingProgress booking={booking} />{booking.quote && <QuoteDetails key={`${booking.quote.version}:${acceptRevision}`} booking={booking} busy={busy || refreshing} onAccept={accept} />}{booking.invoice ? <section className="account-card"><h2>Invoice {booking.invoice.number || '—'}</h2><p>{date(booking.invoice.date)} · <Status>{booking.invoice.paymentStatus}</Status></p><dl className="account-facts">{[['Total', booking.invoice.total], ['Received', booking.invoice.received], ['Due', booking.invoice.due]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{money(value)}</dd></div>)}</dl><a href="/account/billing/">View invoice history in Billing</a><Receipts payments={booking.payments} /></section> : <Notice>The invoice has not been issued. No payment is needed here yet.</Notice>}{booking.paymentReviewRequired || blocked ? <Notice>Online payment is on hold. <Contact /> to check your payment before paying again.</Notice> : order ? <Notice>Your payment result is awaiting verification. Use Check payment status above.</Notice> : null}{booking.milestones.length > 0 && <section className="account-card"><h2>Active payment schedule</h2><ul className="account-records">{[...booking.milestones].sort((a, b) => a.position - b.position).map(m => <li key={m.id}><span><strong>{m.label}</strong><small>Due {date(m.dueOn)}{overdue(m) ? " · Overdue" : ""} · Scheduled {money(m.amount)}</small><small>{m.paid ? 'Paid' : `${m.status.replaceAll('_', ' ').toLowerCase()} · ` + `${money(m.remainingAmount)} remaining`}</small></span>{!m.paid && positive(m.remainingAmount) && canPay(booking, Boolean(order) || blocked) && <button className="button" disabled={busy} onClick={() => void pay(m.id)}>Pay {money(m.remainingAmount)}</button>}</li>)}</ul></section>}</> : null}</>;
}
