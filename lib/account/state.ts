import { canAcceptQuote, canPayBooking, indiaToday } from '../quote/state';
export { positive } from '../quote/state';
import type { Account } from './api';
import type { Booking } from '../quote/api';
export const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function safeReturn(value: string | null) { return value && /^\/account\/(?:bookings|billing)(?:\/[0-9a-f-]{36})?\/?$|^\/account\/profile\/?$/i.test(value) ? value : '/account/bookings/'; }
export function selectAccount(accounts: Account[], preferred: string | null) { return accounts.find(a => a.customerId === preferred) || accounts[0] || null; }
export function money(value: string) {
  if (!/^\d+\.\d{2}$/.test(value)) return value;
  const [whole, fraction] = value.split('.');
  const last = whole.slice(-3); const leading = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${leading ? leading + ',' : ''}${last}.${fraction}`;
}
export function date(value: string | null) { if (!value) return 'To be confirmed'; const [year, month, day] = value.split('-').map(Number); return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day))); }
export function timestamp(value: string) { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)) + ' IST'; }
export function expired(value: string | null, today = indiaToday()) { return Boolean(value && value < today); }
export function canAccept(booking: Booking) { return canAcceptQuote(booking); }
export function canPay(booking: Booking, blocked: boolean) { return canPayBooking(booking, blocked, false); }
export function isAbort(error: unknown) { return error instanceof DOMException && error.name === 'AbortError'; }
let captured: { path: string; token: string } | null = null;
export function captureFragment(location: Pick<Location, 'pathname' | 'hash' | 'search'>, history: Pick<History, 'replaceState' | 'state'>) {
  if (location.hash) {
    const token = new URLSearchParams(location.hash.slice(1)).get('token') || '';
    captured = { path: location.pathname, token: tokenPattern.test(token) ? token : '' };
    history.replaceState(history.state, '', location.pathname); // Remove fragment and query before any third-party code.
  }
  return captured?.path === location.pathname ? captured.token : '';
}
export function clearFragment() { captured = null; }

// Four checks in total (initial + three retries), below the per-route mutation limit.
export function reconciliationDelay(attempts: number, busy: boolean, blocked: boolean) { return !busy && !blocked && attempts >= 1 && attempts < 4 ? attempts * 5000 : null; }
