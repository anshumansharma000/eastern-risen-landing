'use client';
import { useState } from 'react';
import type { Booking } from '@/lib/quote/api';
import { canAcceptQuote, indiaToday, quoteExpired } from '@/lib/quote/state';
import { date, money, timestamp } from '@/lib/account/state';
import './details.css';

export function QuoteDetails({ booking, busy, onAccept }: { booking: Booking; busy: boolean; onAccept: (version: number) => void }) {
  const [agreed, setAgreed] = useState(false);
  const quote = booking.quote;
  if (!quote) return null;
  const pricing = quote.pricing;
  const pastDate = quote.proposedPlan?.milestones.some(m => m.dueOn < indiaToday());
  return <section className="commercial-quote" aria-label={`Quote version ${quote.version}`}>
    <div className="commercial-heading"><h2>Quote · Version {quote.version}</h2><strong>{money(quote.total)}<small>Total quote · INR</small></strong></div>
    <div className="commercial-scope">{[['Your journey', quote.description], ['Inclusions', quote.inclusions], ['Exclusions', quote.exclusions], ['Terms', quote.terms]].map(([label, value]) => <section key={label}><h3>{label}</h3><p>{value || 'Not specified'}</p></section>)}</div>
    <section aria-label="Price breakdown"><h3>Price breakdown</h3>{pricing ? <>
      <ol className="commercial-lines">{[...pricing.lines].sort((a, b) => a.position - b.position).map((line, index) => <li key={`${line.position}-${index}`}>
        <h4>{line.description}</h4><dl><div><dt>Base amount</dt><dd>{money(line.amount)}</dd></div>
          {line.taxTreatment !== 'TAXABLE' && <div><dt>Tax treatment</dt><dd>{{ NON_TAXABLE: 'Non-taxable', EXEMPT: 'Exempt', NIL_RATED: 'Nil-rated' }[line.taxTreatment]}</dd></div>}
          {line.taxes.map((tax, i) => <div key={i}><dt>{tax.component === 'SERVICE_TAX' ? 'Service tax' : tax.component} · {tax.rate}%</dt><dd>{money(tax.amount)}</dd></div>)}
          <div><dt>Line tax</dt><dd>{money(line.taxAmount)}</dd></div><div className="commercial-line-total"><dt>Total including tax</dt><dd>{money(line.total)}</dd></div>
        </dl></li>)}</ol>
      <dl className="commercial-totals"><div><dt>Subtotal</dt><dd>{money(pricing.subtotal)}</dd></div><div><dt>Total tax</dt><dd>{money(pricing.taxTotal)}</dd></div><div><dt>Grand total</dt><dd>{money(pricing.grandTotal)}</dd></div></dl>
    </> : <p>An itemized breakdown is not available for this quote.</p>}</section>
    {quote.proposedPlan && <section aria-label={quote.acceptedAt ? 'Accepted payment terms' : 'Proposed payment schedule'}><h3>{quote.acceptedAt ? 'Accepted payment terms' : 'Proposed payment schedule'}</h3>
      <ol className="commercial-plan">{quote.proposedPlan.milestones.map((m, i) => <li key={i}><span><strong>{m.label}</strong><small>Due {date(m.dueOn)}</small></span><strong>{money(m.amount)}</strong></li>)}</ol>
      <p>{booking.milestones.length ? 'These are the agreed terms. The active payment schedule below shows payment status and remaining balances.' : 'Payment becomes available after our team issues the invoice and enables payment.'}</p>
      {pastDate && !booking.milestones.length && <p>The agreed due dates remain unchanged, including dates that have already passed. Past-due instalments become overdue when payment is enabled.</p>}
    </section>}
    {quote.expiresOn && <p>{quote.acceptedAt ? 'Acceptance deadline was' : quoteExpired(quote) ? 'Expired on' : 'Valid through'} {date(quote.expiresOn)}</p>}
    {quote.acceptedAt ? <div className="commercial-notice" role="status"><strong>Quote accepted</strong><p>Accepted {timestamp(quote.acceptedAt)}. Acceptance is recorded separately from payment and booking confirmation.</p></div> : canAcceptQuote(booking) ? <div className="commercial-accept">
      <label><input type="checkbox" checked={agreed} disabled={busy} onChange={e => setAgreed(e.target.checked)} /><span>I have reviewed and accept quote version {quote.version}, including its scope, pricing and {quote.proposedPlan ? 'proposed payment schedule' : 'terms'} above.</span></label>
      <button className="button" type="button" disabled={!agreed || busy} aria-busy={busy} onClick={() => { setAgreed(false); onAccept(quote.version); }}>{busy ? 'Accepting quote…' : 'Accept this quote'}</button><p>Acceptance does not collect payment. Our team will prepare payment access next.</p>
    </div> : null}
  </section>;
}

export function BookingProgress({ booking }: { booking: Booking }) {
  const text = {
    AWAIT_QUOTE: 'Your quote is being prepared. Our team will share the details here.',
    REVIEW_AND_ACCEPT: 'Review the latest scope, pricing and payment terms below before accepting.',
    QUOTE_EXPIRED: 'This unaccepted quote has expired. Please contact our team for revised terms.',
    AWAIT_ADMIN_PAYMENT_ENABLEMENT: 'Quote accepted. Our team is preparing your invoice and payment access. No payment is needed yet.',
    PAY: 'Payment available. Review the issued invoice and active payment schedule below.',
    PAYMENT_COMPLETE: 'Payment received. Your confirmed receipts and settled balances are shown below.',
    BOOKING_CLOSED: booking.status === 'CANCELLED' ? 'This booking is cancelled. Your quote and payment history remain available.' : 'This journey is complete. Your quote and payment history remain available.',
  }[booking.nextAction];
  return <div className="commercial-notice" role="status"><p>{text}</p><p>Booking status: <strong>{booking.status.replaceAll('_', ' ').toLowerCase()}</strong>{booking.status !== 'CONFIRMED' && booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' ? '. Confirmation is a separate step by our team.' : '.'}</p></div>;
}
