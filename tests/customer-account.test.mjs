import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import { loadTs as load } from './load-ts.mjs';
const loadTs = path => load(new URL(path, import.meta.url));
process.env.NEXT_PUBLIC_CUSTOMER_API_BASE_URL = 'https://api.example.test/api/v1/';
const api = await loadTs('../lib/account/api.ts');
const state = await loadTs('../lib/account/state.ts');
const orders = await loadTs('../lib/account/orders.ts');
const customer = '44444444-4444-4444-8444-444444444444';
const bookingId = '77777777-7777-4777-8777-777777777777';
const quote = { version: 3, acceptedAt: null, expiresOn: '2099-01-01', total: '123.45' };
const booking = { status: 'QUOTED', nextAction: 'REVIEW_AND_ACCEPT', paymentReady: false, quote, invoice: null, paymentReviewRequired: false };
const response = (data, status = 200, headers = {}) => status === 204 ? new Response(null, { status }) : new Response(JSON.stringify(status >= 400 ? { error: data } : { data }), { status, headers });
const client = () => new api.CustomerClient();
test('base accepts origin or /api/v1 without duplicating version prefix', () => {
  for (const base of ['https://api.example.test', 'https://api.example.test/', 'https://api.example.test/api/v1/']) assert.equal(api.apiRoot(base), 'https://api.example.test/api/v1/customer');
});
test('cookie transport, no-store, safe body and empty 204 response', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push([url, options]); return response(null, 204); };
  const c = client();
  await c.request('/auth/logout', 'POST');
  await c.request('/auth/reset-password', 'POST', { token: 'a'.repeat(43), newPassword: 'a secure password' });
  assert.equal(calls[0][0], 'https://api.example.test/api/v1/customer/auth/logout');
  assert.equal(calls[0][1].body, undefined);
  for (const [, options] of calls) { assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.headers.Authorization, undefined); }
  assert.equal(calls[1][1].headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[1][1].body), { token: 'a'.repeat(43), newPassword: 'a secure password' });
});
test('login invalid credentials differs from an expired authenticated session', async () => {
  let unauthorized = 0; const c = new api.CustomerClient(undefined, () => unauthorized++);
  globalThis.fetch = async () => response({ code: 'AUTHENTICATION_FAILED', message: 'Invalid credentials', requestId: 'support-1' }, 401);
  await assert.rejects(c.data('/auth/login', 'POST', { email: 'a@b.test', password: 'wrong' }), e => e.requestId === 'support-1');
  await assert.rejects(c.data('/invitations/accept', 'POST', { token: 'a'.repeat(43), password: 'wrong' }));
  assert.equal(unauthorized, 0);
  await assert.rejects(c.me()); assert.equal(unauthorized, 1);
});
test('name and password validation maps exact server paths, malformed details is safe', () => {
  assert.deepEqual(api.validationFields({ fields: [{ field: 'body.newPassword', message: 'Choose a different password' }, { field: 'params.customerId', message: 'Invalid account' }, null] }), { 'body.newPassword': 'Choose a different password', 'params.customerId': 'Invalid account' });
  for (const value of [null, 'raw', {}, { fields: 'bad' }]) assert.deepEqual(api.validationFields(value), {});
});
test('activation new/existing contexts and acceptance preserve exact contracts', async () => {
  const calls = []; const c = client();
  for (const existingUser of [false, true]) {
    globalThis.fetch = async (url, options) => { calls.push([url, options]); return response(url.endsWith('/context') ? { email: 'invited@example.test', customerName: 'Client', existingUser } : { customerId: customer }); };
    assert.equal((await c.data('/invitations/context', 'POST', { token: 'a'.repeat(43) })).existingUser, existingUser);
    assert.deepEqual(await c.data('/invitations/accept', 'POST', { token: 'a'.repeat(43), password: existingUser ? 'old' : 'long new password' }), { customerId: customer });
  }
  assert.deepEqual(Object.keys(JSON.parse(calls[3][1].body)), ['token', 'password']);
});
test('secret fragments are memory-only and immediately removed; invalid tokens rejected', () => {
  const calls = []; const history = { state: { value: 1 }, replaceState: (...args) => calls.push(args) };
  assert.equal(state.captureFragment({ pathname: '/account/activate/', hash: `#token=${'a'.repeat(43)}`, search: '' }, history), 'a'.repeat(43));
  assert.deepEqual(calls[0], [{ value: 1 }, '', '/account/activate/']);
  assert.equal(state.captureFragment({ pathname: '/account/activate/', hash: '', search: '' }, history), 'a'.repeat(43));
  state.clearFragment();
  assert.equal(state.captureFragment({ pathname: '/account/activate/', hash: '', search: '' }, history), '');
  assert.equal(state.captureFragment({ pathname: '/account/reset-password/', hash: '#token=bad', search: '' }, history), '');
});
test('zero, sole, multiple and revoked memberships never trust stored preference', () => {
  const a = { customerId: customer, name: 'One' }, b = { customerId: bookingId, name: 'Two' };
  assert.equal(state.selectAccount([], customer), null);
  assert.equal(state.selectAccount([a], 'untrusted'), a);
  assert.equal(state.selectAccount([a, b], b.customerId), b);
  assert.equal(state.selectAccount([a], b.customerId), a);
});
test('context reset aborts and rejects late responses after switch/logout/revocation', async () => {
  const scope = new api.RequestScope(); const c = new api.CustomerClient(scope); let resolve; let signal;
  globalThis.fetch = (_, options) => { signal = options.signal; return new Promise(done => { resolve = done; }); };
  const pending = c.booking(customer, bookingId); scope.reset();
  assert.equal(signal.aborted, true); resolve(response({ reference: 'old private data' }));
  await assert.rejects(pending, e => e.name === 'AbortError');
});
test('only internal account return routes are accepted', () => {
  for (const value of ['https://evil.test/account/bookings', '//evil.test', '/account/login/', '/account/bookings/?secret=x', '/account/profile/#x', '/account/bookings/../../contact']) assert.equal(state.safeReturn(value), '/account/bookings/');
  assert.equal(state.safeReturn(`/account/bookings/${bookingId}/`), `/account/bookings/${bookingId}/`);
  assert.equal(state.safeReturn('/account/profile/'), '/account/profile/');
});
test('money preserves large exact decimals and date-only values do not shift', () => {
  assert.equal(state.money('9007199254740993.01'), '₹9,00,71,99,25,47,40,993.01');
  assert.equal(state.money('0.00'), '₹0.00'); assert.equal(state.date(null), 'To be confirmed'); assert.match(state.date('2026-10-05'), /5 Oct 2026/);
});
test('quote acceptance uses displayed version and fails stale version without retry', async () => {
  let calls = 0;
  globalThis.fetch = async (_, options) => { calls++; assert.deepEqual(JSON.parse(options.body), { quoteVersion: 3 }); return response({ code: 'QUOTE_VERSION_CHANGED', message: 'Changed' }, 409); };
  await assert.rejects(client().data(`/accounts/${customer}/bookings/${bookingId}/accept`, 'POST', { quoteVersion: 3 }), e => e.code === 'QUOTE_VERSION_CHANGED');
  assert.equal(calls, 1); assert.equal(state.canAccept(booking), true);
  for (const nextAction of ['PAY', 'BOOKING_CLOSED', 'QUOTE_EXPIRED', 'AWAIT_ADMIN_PAYMENT_ENABLEMENT']) assert.equal(state.canAccept({ ...booking, nextAction }), false);
  assert.equal(state.canAccept({ ...booking, quote: { ...quote, expiresOn: '2000-01-01' } }), false);
});
test('checkout balances, delayed/review states and paid/cancelled/completed restrictions', async () => {
  const payable = { ...booking, status: 'INVOICED', nextAction: 'PAY', paymentReady: true, invoice: { due: '7.00', paymentStatus: 'PARTIALLY_PAID' } };
  assert.equal(state.canPay(payable, false), true);
  for (const data of [{ ...payable, paymentReviewRequired: true }, { ...payable, status: 'CANCELLED' }, { ...payable, status: 'COMPLETED' }, { ...payable, invoice: { due: '0.00' } }]) assert.equal(state.canPay(data, false), false);
  assert.equal(state.canPay(payable, true), false);
  for (const status of ['PENDING', 'PAID', 'REVIEW_REQUIRED']) { globalThis.fetch = async () => response({ orderId: 'er_order', status }); assert.equal((await client().data(`/accounts/${customer}/bookings/${bookingId}/orders/er_order/reconcile`, 'POST')).status, status); }
});
test('pagination preserves invoice-only/cancelled history and issued decimal totals', async () => {
  const invoice = { id: bookingId, status: 'CANCELLED', adjusted: '7.25', due: '0.00', payments: [], company: { name: 'Historical name' } };
  let url;
  globalThis.fetch = async input => { url = input; return new Response(JSON.stringify({ data: [invoice], pagination: { page: 2, pageSize: 25, total: 26 } })); };
  const data = await client().request(`/accounts/${customer}/invoices?page=2&pageSize=25`);
  assert.match(url, /invoices\?page=2&pageSize=25$/); assert.deepEqual(data.data[0], invoice); assert.equal(data.pagination.total, 26); assert.equal('bookingId' in data.data[0], false);
});
test('recovery unavailability/expired links, HTML proxy, rate limits and support errors', async () => {
  const c = client();
  for (const [code, status] of [['CUSTOMER_RECOVERY_UNAVAILABLE', 503], ['RECOVERY_INVALID', 400], ['INVITATION_INVALID', 400], ['ROUTE_NOT_FOUND', 404], ['ORIGIN_NOT_ALLOWED', 403]]) {
    globalThis.fetch = async () => response({ code, message: 'Unavailable', requestId: 'support-ref' }, status);
    await assert.rejects(c.data('/auth/forgot-password', 'POST', { email: 'example@test.test' }), e => e.code === code && e.requestId === 'support-ref' && api.errorMessage(e) !== 'Unavailable');
  }
  globalThis.fetch = async () => new Response('<html>Proxy error</html>', { status: 502 }); await assert.rejects(c.me(), e => e.code === 'SERVICE_ERROR');
  let count = 0; globalThis.fetch = async () => { count++; return response({ code: 'RATE_LIMIT_EXCEEDED', message: 'Wait' }, 429, { 'Retry-After': '90' }); };
  await assert.rejects(c.data('/rate-test', 'POST'), e => e.retryAt > Date.now() + 80000);
  await assert.rejects(c.data('/rate-test', 'POST')); assert.equal(count, 1);
});
test('only scoped order identifiers survive return; clear orders leaves public link context intact', () => {
  const values = {}; globalThis.sessionStorage = { getItem: key => values[key], setItem: (key, value) => { values[key] = value; globalThis.sessionStorage[key] = value; }, removeItem: key => { delete values[key]; delete globalThis.sessionStorage[key]; } };
  const key = orders.orderKey('identity', customer, bookingId); const id = `er_${'a'.repeat(32)}`;
  orders.storeOrder(key, id); sessionStorage.setItem('public-quote-order', 'link-order');
  assert.equal(orders.getOrder(key), id); orders.clearOrders(); assert.equal(orders.getOrder(key), null); assert.equal(sessionStorage.getItem('public-quote-order'), 'link-order');
});
test('static export retains marketing/link routes and marks account shell private', async () => {
  const html = await fs.readFile(new URL('../out/account/index.html', import.meta.url), 'utf8');
  assert.match(html, /noindex, nofollow/); assert.match(html, /no-referrer/); assert.doesNotMatch(html, /rel="canonical"|goatcounter|api\.example/);
  const redirects = await fs.readFile(new URL('../out/_redirects', import.meta.url), 'utf8'); assert.match(redirects, /\/account\/\* \/account\/ 200/); assert.match(redirects, /\/quote\/:token \/quote\/ 200/);
  const headers = await fs.readFile(new URL('../out/_headers', import.meta.url), 'utf8'); assert.match(headers, /\/account\/\*\s+Cache-Control: no-store/);
});

test('reconciliation retries are bounded and stop for busy/review/error states', () => {
  assert.equal(state.reconciliationDelay(0, false, false), null);
  assert.equal(state.reconciliationDelay(1, false, false), 5000);
  assert.equal(state.reconciliationDelay(3, false, false), 15000);
  assert.equal(state.reconciliationDelay(4, false, false), null);
  assert.equal(state.reconciliationDelay(1, true, false), null);
  assert.equal(state.reconciliationDelay(1, false, true), null);
});
test('known and unknown recovery results stay generic and password/name changes send exact bodies', async () => {
  const calls = []; const c = client();
  globalThis.fetch = async (url, options) => { calls.push([url, options]); return url.endsWith('/forgot-password') ? response({ message: 'If an active customer account exists, recovery instructions will be sent.' }, 202) : response(null, 204); };
  for (const email of ['known@example.test', 'unknown@example.test']) assert.equal((await c.data('/auth/forgot-password', 'POST', { email })).message, 'If an active customer account exists, recovery instructions will be sent.');
  await c.request('/me/change-password', 'POST', { currentPassword: 'current', newPassword: 'new long password' });
  await c.request('/me', 'PATCH', { displayName: 'Personal name' });
  assert.deepEqual(JSON.parse(calls[2][1].body), { currentPassword: 'current', newPassword: 'new long password' });
  assert.deepEqual(JSON.parse(calls[3][1].body), { displayName: 'Personal name' });
});
