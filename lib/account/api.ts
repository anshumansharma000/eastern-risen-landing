import { commercialError } from '../quote/api';
import type { Booking, Checkout } from '../quote/api';
export type Profile = { accountId: string; displayName: string; email: string; status: string };
export type Account = { customerId: string; name: string; category: string };
export type Invitation = { email: string; displayName: string; customerName: string; category: string; expiresAt: string; existingUser: boolean };
export type BookingItem = Pick<Booking, 'reference' | 'title' | 'status' | 'serviceStartsOn' | 'serviceEndsOn'> & { id: string };
export type Page<T> = { data: T[]; pagination: { page: number; pageSize: number; total: number } };
export type Party = { name: string | null; address: string | null; city: string | null; state: string | null; country: string | null; postalCode: string | null; gstNumber: string | null; phone?: string | null; mobileNumber?: string | null; email?: string | null; pan?: string | null; serviceTaxNumber?: string | null; cin?: string | null };
export type Invoice = { serviceCategory?: { name: string | null; code: string | null } | null; serviceProvidedAt?: string | null; placeOfSupplyState?: string | null; placeOfSupplyCountry?: string | null; passengerCount?: number | null; id: string; number: string | null; financialYear: string | null; date: string; status: string; total: string; received: string; adjusted: string; due: string; paymentStatus: string; subtotal: string; taxTotal: string; dueDate: string | null; company: Party; customer: Party; paymentInstructions: string | null; footerNotes: string | null; guestDisplayText: string; label: string | null; bankAccounts: { name: string; bankName: string | null; accountNumber: string; branch: string | null; ifscCode: string | null; swiftCode: string | null }[]; lines: { position: number; description: string; amount: string; taxTreatment: string; taxAmount: string; total: string; taxes: { component: string; rate: string; amount: string }[] }[]; payments: { number: string | null; date: string; amount: string; method: string }[] };
export class AccountError extends Error {
  constructor(public status: number, public code: string, message: string, public requestId = '', public fields: Record<string, string> = {}, public retryAt = 0) { super(message); }
}
export function apiRoot(base: string) { return `${base.replace(/\/+$/, '').replace(/\/api\/v1$/, '')}/api/v1/customer`; }
const configuredBase = process.env.NEXT_PUBLIC_CUSTOMER_API_BASE_URL || process.env.NEXT_PUBLIC_QUOTE_API_BASE_URL || '';
// Every identity/membership change aborts outstanding work and invalidates late responses.
export class RequestScope {
  private controller = new AbortController();
  private generation = 0;
  reset() { this.controller.abort(); this.controller = new AbortController(); this.generation++; }
  snapshot() { return { signal: this.controller.signal, generation: this.generation }; }
  assert(generation: number) { if (generation !== this.generation) throw new DOMException('Context changed', 'AbortError'); }
}
const cooldowns = new Map<string, number>();
export function validationFields(details: unknown): Record<string, string> {
  if (!details || typeof details !== 'object' || !('fields' in details) || !Array.isArray(details.fields)) return {};
  return Object.fromEntries(details.fields.flatMap((item: unknown) => item && typeof item === 'object' && 'field' in item && 'message' in item && typeof item.field === 'string' && typeof item.message === 'string' ? [[item.field, item.message]] : []));
}
export function retryTime(value: string | null, now = Date.now()) { const seconds = value ? Number(value) : NaN; return Number.isFinite(seconds) ? now + Math.max(0, seconds) * 1000 : Math.max(now + 60000, value ? Date.parse(value) || 0 : 0); }
export class CustomerClient {
  constructor(public scope = new RequestScope(), private onUnauthorized: () => void = () => {}) {}
  async request<T>(path: string, method = 'GET', body?: object): Promise<T> {
    if (!configuredBase) throw new AccountError(0, 'CONFIGURATION', 'Account service is not configured. Please contact Eastern Risen.');
    const retryAt = cooldowns.get(path) || 0;
    if (retryAt > Date.now()) throw new AccountError(429, 'RATE_LIMIT_EXCEEDED', 'Please wait before trying again.', '', {}, retryAt);
    const { signal, generation } = this.scope.snapshot();
    let response: Response;
    try { response = await fetch(`${apiRoot(configuredBase)}${path}`, { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, credentials: 'include', mode: 'cors', cache: 'no-store', referrerPolicy: 'no-referrer', signal }); }
    catch (error) { this.scope.assert(generation); if (signal.aborted) throw error; throw new AccountError(0, 'NETWORK', 'Could not connect. Please try again or contact Eastern Risen.'); }
    this.scope.assert(generation);
    let payload;
    if (response.status !== 204) { try { payload = await response.json(); } catch { /* proxy HTML is not a customer response */ } }
    this.scope.assert(generation);
    if (!response.ok) {
      const e = payload?.error;
      const retryAt = response.status === 429 ? retryTime(response.headers.get('Retry-After')) : 0;
      if (retryAt) cooldowns.set(path, retryAt);
      // Invalid login/invitation credentials are contextual, not session expiry.
      if ((response.status === 401 && (e?.code === 'AUTHENTICATION_REQUIRED' || (!path.startsWith('/auth/') && !path.startsWith('/invitations/')))) || e?.code === 'CUSTOMER_ACCESS_REQUIRED') this.onUnauthorized();
      throw new AccountError(response.status, e?.code || 'SERVICE_ERROR', e?.message || 'The account service is temporarily unavailable.', e?.requestId || response.headers.get('x-request-id') || '', validationFields(e?.details), retryAt);
    }
    if (response.status === 204) return undefined as T;
    if (!payload || !('data' in payload)) throw new AccountError(response.status, 'SERVICE_ERROR', 'The account service returned an unexpected response.', response.headers.get('x-request-id') || '');
    return payload as T;
  }
  async data<T>(path: string, method = 'GET', body?: object) { return (await this.request<{ data: T }>(path, method, body))?.data; }
  me() { return this.data<Profile>('/me'); }
  accounts() { return this.data<Account[]>('/accounts'); }
  booking(customerId: string, bookingId: string) { return this.data<Booking>(`/accounts/${encodeURIComponent(customerId)}/bookings/${encodeURIComponent(bookingId)}`); }
  checkout(customerId: string, bookingId: string, milestoneId: string) { return this.data<Checkout>(`/accounts/${encodeURIComponent(customerId)}/bookings/${encodeURIComponent(bookingId)}/milestones/${encodeURIComponent(milestoneId)}/checkout`, 'POST'); }
}
export function errorMessage(error: unknown) {
  if (!(error instanceof AccountError)) return 'Something went wrong. Please try again.';
  const messages: Record<string, string> = {
    AUTHENTICATION_FAILED: 'The email or password is incorrect, or this account is inactive.',
    INVITATION_INVALID: 'This invitation has expired, been used or is no longer available. Contact Eastern Risen to request a new invitation.',
    CUSTOMER_UNAVAILABLE: 'This customer account is unavailable. Contact Eastern Risen for assistance.',
    RECOVERY_INVALID: 'This reset link has expired, been used or is invalid. Request a new password reset.',
    CUSTOMER_RECOVERY_UNAVAILABLE: 'Password recovery is unavailable. Please contact Eastern Risen for assistance.',
    CURRENT_PASSWORD_INVALID: 'Your current password is incorrect.', PASSWORD_REUSE_NOT_ALLOWED: 'Choose a different new password.',
    QUOTE_VERSION_CHANGED: 'Your quote has changed. Review the updated quote and terms before accepting again.',
    QUOTE_NOT_ACCEPTABLE: 'This quote can no longer be accepted. Review the latest booking status.', QUOTE_EXPIRED: 'This quote has expired. Contact Eastern Risen for an updated quote.',
    PAYMENT_REVIEW_REQUIRED: 'Your payment needs staff review. Please contact Eastern Risen and avoid another payment.',
    PAYMENT_ORDER_AMOUNT_CHANGED: 'The payment balance changed. Contact Eastern Risen before paying again.',
    PAYMENT_ORDER_PENDING: 'Payment setup is pending. Wait a minute, refresh and try again.',
    PAYMENTS_UNAVAILABLE: 'Online payment is unavailable. Please contact Eastern Risen.',
    BOOKING_NOT_PAYABLE: 'This booking is not currently payable. Review the refreshed details.', INVOICE_NOT_ISSUED: 'The invoice is not available for payment. Contact Eastern Risen.',
    MILESTONE_NOT_PAYABLE: 'This instalment is no longer payable. Review the updated balance.', INVOICE_MISSING: 'The linked invoice is unavailable. Contact Eastern Risen to check your payment.',
    PAYMENT_PROVIDER_UNAVAILABLE: 'The payment service is delayed. Check payment status before trying to pay again.',
    PAYMENT_PROVIDER_ERROR: 'The payment service is temporarily unavailable. Contact Eastern Risen if this continues.',
    PAYMENT_PROVIDER_RESPONSE_INVALID: 'We could not verify the payment service response. Contact Eastern Risen.',
    ROUTE_NOT_FOUND: 'This account feature is not available on the server. Contact Eastern Risen with the support reference.',
    CUSTOMER_RECORD_NOT_FOUND: 'This record or your account access is no longer available.', CORE_NOT_FOUND: 'This resource is no longer available. Contact Eastern Risen.',
    ORIGIN_NOT_ALLOWED: 'The website connection needs attention. Please contact Eastern Risen.',
  };
  return error.status === 429 ? 'Too many requests. Please wait before trying again.' : commercialError(error.code) || messages[error.code] || 'We could not complete this request. Please try again or contact Eastern Risen.';
}
