import type { Booking, Quote, Milestone, Reconciliation } from "./api";

export function indiaToday(now = new Date()) { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now); }
export function positive(value: string) { return /^\d+\.\d{2}$/.test(value) && /[1-9]/.test(value); }
export function overdue(milestone: Milestone, today = indiaToday()) { return !milestone.paid && positive(milestone.remainingAmount) && milestone.dueOn < today; }
export function retryAllowed(result: Reconciliation) { return result.canRetry === true && result.hasUnresolvedAttempts === false && result.accountingStatus !== "REVIEW_REQUIRED" && result.status !== "PAID" && result.status !== "REVIEW_REQUIRED"; }
export function quoteExpired(quote: Quote, today = indiaToday()) {
  return Boolean(quote.expiresOn && quote.expiresOn < today);
}
export function canAcceptQuote(booking: Booking, today?: string) {
  return Boolean(booking.nextAction === "REVIEW_AND_ACCEPT" && booking.quote && !booking.quote.acceptedAt && !quoteExpired(booking.quote, today) && booking.status !== "CANCELLED" && booking.status !== "COMPLETED");
}
export function canPayBooking(booking: Booking, pendingOrder: boolean, review: boolean) {
  return Boolean(booking.paymentReady && booking.nextAction === "PAY" && ["INVOICED", "CONFIRMED"].includes(booking.status) && booking.invoice && positive(booking.invoice.due) && booking.invoice.paymentStatus !== "NOT_APPLICABLE" && !booking.paymentReviewRequired && !review && !pendingOrder);
}
export function createActionGate() {
  let busy = false;
  return { acquire() { if (busy) return false; busy = true; return true; }, release() { busy = false; }, get busy() { return busy; } };
}
