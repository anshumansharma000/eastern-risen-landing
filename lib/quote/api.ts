export type BookingStatus = "DRAFT" | "QUOTED" | "INVOICED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type TaxTreatment = "TAXABLE" | "NON_TAXABLE" | "EXEMPT" | "NIL_RATED";
export type AppliedTax = { ruleId: string; component: "IGST" | "CGST" | "SGST" | "SERVICE_TAX"; rate: string; amount: string };
export type CalculatedLine = { position: number; description: string; amount: string; taxTreatment: TaxTreatment; taxes: AppliedTax[]; taxAmount: string; total: string };
export type QuotePricing = { lines: CalculatedLine[]; subtotal: string; taxTotal: string; grandTotal: string; taxEffectiveDate: string; currency: "INR"; rounding: "HALF_UP_PER_LINE_COMPONENT" };
export type ProposedMilestone = { label: string; amount: string; dueOn: string };
export type ProposedPlan = { mode: "COMPANY_DEFAULT" | "CUSTOM"; milestones: ProposedMilestone[]; resolvedOn: string; policy: { initialPercent: number; balanceDaysBefore: number; fullPaymentWithinDays: number } | null; overdueRule: "KEEP_ACCEPTED_DATES" };
export type Quote = { id: string; legacy: boolean; version: number; description: string; inclusions: string; exclusions: string; terms: string; total: string; currency: "INR"; expiresOn: string | null; acceptedAt: string | null; pricing: QuotePricing | null; proposedPlan: ProposedPlan | null };
export type Invoice = { number: string | null; date: string; total: string; received: string; due: string; paymentStatus: string };
export type Receipt = { number: string; date: string; amount: string; method: string };
export type Milestone = ProposedMilestone & { id: string; position: number; status: "PENDING" | "PARTIALLY_PAID" | "PAID"; remainingAmount: string; paid: boolean; remaining: string };
export type NextAction = "AWAIT_QUOTE" | "REVIEW_AND_ACCEPT" | "QUOTE_EXPIRED" | "AWAIT_ADMIN_PAYMENT_ENABLEMENT" | "PAY" | "PAYMENT_COMPLETE" | "BOOKING_CLOSED";
export type Booking = { reference: string; title: string; status: BookingStatus; serviceStartsOn: string | null; serviceEndsOn: string | null; quote: Quote | null; invoice: Invoice | null; paymentReady: boolean; nextAction: NextAction; paymentReviewRequired: boolean; payments: Receipt[]; milestones: Milestone[] };
export type Checkout = { provider: string; sessionId: string; orderId: string; amount: string };
export type Reconciliation = { status: string; receiptId?: string | null; orderId?: string; orderStatus: string; latestAttemptStatus: string; accountingStatus: string; hasUnresolvedAttempts: boolean; canRetry: boolean; lastCheckedAt: string | null };

export class QuoteApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

const base = process.env.NEXT_PUBLIC_QUOTE_API_BASE_URL?.replace(/\/+$/, "");

async function request<T>(token: string, suffix = "", method: "GET" | "POST" = "GET", body?: object): Promise<T> {
  if (!base) throw new QuoteApiError(0, "CONFIGURATION", "The quote service is not configured. Please contact our team.");
  let response: Response;
  try {
    response = await fetch(`${base}/api/v1/core/public/bookings/${encodeURIComponent(token)}${suffix}`, {
      method, cache: "no-store", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new QuoteApiError(0, "NETWORK", method === "POST"
      ? "We could not connect to the quote service. Please try again. If this continues, ask our team to check the site connection."
      : "We could not load your quote. Please try again. If this continues, ask our team to check the site connection.");
  }
  let payload: { data?: T; error?: { code?: string; message?: string } } | null = null;
  try { payload = await response.json(); } catch { /* server or proxy returned non-JSON */ }
  if (!response.ok || !payload || !("data" in payload)) {
    throw new QuoteApiError(response.status, payload?.error?.code ?? "SERVICE_ERROR", payload?.error?.message ?? "The quote service is temporarily unavailable.");
  }
  return payload.data as T;
}

export const quoteApi = {
  booking: (token: string) => request<Booking>(token),
  accept: (token: string, quoteVersion: number) => request<Quote>(token, "/accept", "POST", { quoteVersion }),
  checkout: (token: string, milestoneId: string) => request<Checkout>(token, `/milestones/${encodeURIComponent(milestoneId)}/checkout`, "POST"),
  reconcile: (token: string, orderId: string) => request<Reconciliation>(token, `/orders/${encodeURIComponent(orderId)}/reconcile`, "POST"),
};

export function customerError(error: unknown): string {
  if (!(error instanceof QuoteApiError)) return "Something went wrong. Please try again.";
  const message = commercialError(error.code);
  if (message) return message;
  if (error.status === 401 || error.status === 403) return "This link is no longer available. Please contact our team.";
  if (error.status === 404) return "This private link is no longer available. Please ask our team for a new link.";
  if (error.status === 429) return "Too many requests just now. Please wait a little before trying again.";
  if (error.status === 503) return "The payment service is temporarily unavailable. Please try again shortly.";
  if (error.code === "CONFIGURATION" || error.code === "NETWORK") return error.message;
  if (/phone|mobile|contact/i.test(`${error.code} ${error.message}`)) return "A usable ten-digit phone number is needed for payment. Please contact our team to update your details.";
  return "We could not complete that request. Please try again or contact our team.";
}

export function commercialError(code: string): string | undefined {
  return ({
    QUOTE_VERSION_REQUIRED: "Please review the refreshed quote and accept the displayed version.",
    QUOTE_VERSION_CHANGED: "Your quote has changed. Please review the latest pricing and payment terms and accept again.",
    QUOTE_EXPIRED: "This quote has expired. Please contact our team for revised terms.",
    QUOTE_NOT_ACCEPTABLE: "This quote can no longer be accepted. Please review the updated booking details.",
    PAYMENT_REVIEW_REQUIRED: "Our team is reviewing your payment. Please avoid another payment.",
    PAYMENT_ORDER_PENDING: "Payment setup is still pending. Refresh the details before trying again.",
    PAYMENT_ORDER_UNAVAILABLE: "We could not confirm the previous payment. Contact our team before paying again.",
    PAYMENT_ORDER_AMOUNT_CHANGED: "Your payment balance changed. Contact our team before paying again.",
    OVERPAYMENT: "The outstanding balance has changed. Please review the refreshed balances before paying.",
    BOOKING_NOT_PAYABLE: "Payment is not available for this booking. Please review the refreshed details.",
    MILESTONE_NOT_PAYABLE: "This instalment is no longer payable. Please review the refreshed balance.",
    PAYMENTS_UNAVAILABLE: "Online payment is unavailable. Please contact our team.",
    PAYMENT_PROVIDER_UNAVAILABLE: "The payment service is delayed. Check payment status before trying again.",
    PAYMENT_PROVIDER_ERROR: "The payment service is temporarily unavailable. Contact our team before trying again.",
    PAYMENT_PROVIDER_RESPONSE_INVALID: "We could not verify payment setup. Please contact our team before paying again.",
  } as Record<string, string>)[code];
}
