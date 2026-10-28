import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { booking, accepted, active, customerId, bookingId, token, orderId } from './fixtures/commercial.mjs';
const require = createRequire(import.meta.url);
// Optional browser suite: use an installed Playwright or specify PLAYWRIGHT_MODULE_PATH.
const enabled = process.env.RUN_BROWSER_TESTS === '1';
test('commercial workflow in both real browser entry points', { skip: !enabled, timeout: 120000 }, async t => {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let file = url.pathname.startsWith('/quote/') ? 'quote/index.html' : url.pathname.startsWith('/account/') ? 'account/index.html' : url.pathname.replace(/^\//, '');
    if (!path.extname(file)) file += '/index.html';
    try { const data = await fs.readFile(path.join(process.cwd(), 'out', file)); res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(data); }
    catch { res.statusCode = 404; res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { await browser.close(); await new Promise(resolve => server.close(resolve)); });
  for (const entry of ['private', 'account']) {
    await t.test(`${entry}: pricing, explicit revised-version acceptance, activation and reconciliation`, async () => {
      const context = await browser.newContext({ viewport: { width: 375, height: 812 }, timezoneId: 'America/Los_Angeles' });
      const page = await context.newPage();
      let current = booking(); const calls = []; let conflict = true; let result = { status: 'PENDING', accountingStatus: 'UNAPPLIED', hasUnresolvedAttempts: true, canRetry: false };
      let releaseRefresh; let holdRefresh = false;
      await page.addInitScript(() => { window.Cashfree = () => ({ checkout: async () => ({ paymentDetails: { paymentMessage: 'SUCCESS' } }) }); });
      await page.route('**/api/v1/**', async route => {
        const request = route.request(); const endpoint = new URL(request.url()).pathname;
        const send = (data, status = 200) => route.fulfill({ status, json: status >= 400 ? { error: data } : { data }, headers: { 'Access-Control-Allow-Origin': base, 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } });
        if (request.method() === 'OPTIONS') return send(null);
        if (endpoint.endsWith('/me')) return send({ accountId: 'identity', displayName: 'Customer', email: 'customer@example.test', status: 'ACTIVE' });
        if (endpoint.endsWith('/accounts')) return send([{ customerId, name: 'Test customer', category: 'RETAIL' }]);
        if (endpoint.endsWith('/accept')) {
          calls.push({ action: 'accept', body: request.postDataJSON() });
          if (conflict) { conflict = false; current = booking(); current.quote.version = 3; return send({ code: 'QUOTE_VERSION_CHANGED', message: 'internal version details' }, 409); }
          current = accepted(); current.quote.version = 3; return send(current.quote);
        }
        if (endpoint.endsWith('/checkout')) { calls.push({ action: 'checkout', endpoint }); return send({ provider: 'cashfree', sessionId: 'fixture-session', orderId, amount: '180.00' }); }
        if (endpoint.endsWith('/reconcile')) {
          calls.push({ action: 'reconcile' });
          if (result.status === 'PAID') { current = active(); current.quote.version = 3; current.nextAction = 'PAYMENT_COMPLETE'; current.invoice.received = '2180.00'; current.invoice.due = '0.00'; current.invoice.paymentStatus = 'PAID'; current.milestones[0].paid = true; current.milestones[0].remainingAmount = '0.00'; current.payments = [{ number: 'RCPT-VERIFIED', date: '2026-10-07', amount: '180.00', method: 'GATEWAY' }]; }
          return send({ ...result, orderStatus: result.status, latestAttemptStatus: result.status, lastCheckedAt: null });
        }
        if (holdRefresh) { holdRefresh = false; const snapshot = structuredClone(current); await new Promise(resolve => { releaseRefresh = resolve; }); return send(snapshot); }
        return send(current);
      });
      const url = entry === 'private' ? `/quote/${token}/` : `/account/bookings/${bookingId}/`;
      await page.goto(base + url);
      await page.getByRole('heading', { name: 'Price breakdown', exact: true }).waitFor();
      const quote = page.getByRole('region', { name: 'Quote version 2', exact: true });
      const pricing = await quote.textContent(); assert.ok(pricing.indexOf('First service') < pricing.indexOf('Second service'));
      for (const label of ['CGST · 9.00%', 'SGST · 9.00%', '₹2,180.00', 'Proposed payment schedule']) assert.ok(pricing.includes(label));
      assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      await page.screenshot({ path: path.join(process.cwd(), 'outputs', `commercial-${entry}-mobile.png`), fullPage: true });
      await page.getByRole('checkbox').check(); await page.getByRole('button', { name: 'Accept this quote', exact: true }).click();
      await page.getByRole('heading', { name: 'Quote · Version 3', exact: true }).waitFor();
      assert.deepEqual(calls.filter(c => c.action === 'accept').map(c => c.body), [{ quoteVersion: 2 }]);
      assert.equal(await page.getByRole('checkbox').isChecked(), false);
      assert.equal(await page.getByRole('button', { name: 'Accept this quote', exact: true }).isDisabled(), true);
      await page.getByRole('checkbox').check(); await page.getByRole('button', { name: 'Accept this quote', exact: true }).click();
      await page.getByRole('heading', { name: 'Accepted payment terms', exact: true }).waitFor();
      assert.deepEqual(calls.filter(c => c.action === 'accept').map(c => c.body), [{ quoteVersion: 2 }, { quoteVersion: 3 }]);
      assert.ok((await page.textContent('main')).includes('payment access')); assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      current = active(); current.quote.version = 3;
      await page.getByRole('button', { name: entry === 'private' ? 'Refresh details' : 'Refresh booking', exact: true }).click();
      const pay = page.getByRole('button', { name: 'Pay ₹180.00', exact: true }); await pay.waitFor();
      assert.ok((await page.textContent('main')).includes('Overdue'));
      await pay.click(); await page.getByRole('button', { name: 'Check payment status', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      assert.ok(!((await page.textContent('main')).includes('RCPT-VERIFIED')));
      assert.ok(calls.find(c => c.action === 'checkout').endpoint.endsWith('/milestones/88888888-8888-4888-8888-888888888888/checkout'));
      result = { status: 'REVIEW_REQUIRED', accountingStatus: 'REVIEW_REQUIRED', hasUnresolvedAttempts: false, canRetry: false };
      await page.getByRole('button', { name: 'Check payment status', exact: true }).click();
      await page.getByRole('button', { name: 'Check payment status', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      result = { status: 'EXPIRED', accountingStatus: 'UNAPPLIED', hasUnresolvedAttempts: false, canRetry: true };
      await page.getByRole('button', { name: 'Check payment status', exact: true }).click(); await pay.waitFor();
      result = { status: 'PENDING', accountingStatus: 'UNAPPLIED', hasUnresolvedAttempts: true, canRetry: false };
      await page.evaluate(() => { window.Cashfree = () => ({ checkout: async () => { throw new Error('Customer abandoned checkout'); } }); });
      await pay.click(); await page.getByRole('button', { name: 'Check payment status', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Accept this quote', exact: true }).count(), 0);
      // Start an old detail read, then reconcile and refresh newer server payment data first.
      holdRefresh = true;
      await page.getByRole('button', { name: entry === 'private' ? 'Refresh details' : 'Refresh booking', exact: true }).click();
      await page.waitForFunction(() => document.body.innerText.includes('Refreshing…'));
      result = { status: 'PAID', accountingStatus: 'APPLIED', hasUnresolvedAttempts: false, canRetry: false };
      await page.getByRole('button', { name: 'Check payment status', exact: true }).click();
      await page.getByText(/RCPT-VERIFIED/).waitFor();
      releaseRefresh();
      await page.waitForTimeout(100);
      assert.ok((await page.textContent('main')).includes('RCPT-VERIFIED'));
      assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      assert.ok(!(await page.textContent('main')).includes('Overdue'));
      assert.ok((await page.textContent('main')).includes('invoiced')); // Receipt does not imply confirmation.
      await context.close();
    });
    await t.test(`${entry}: legacy, restrictions and review safeguards`, async () => {
      const context = await browser.newContext(); const page = await context.newPage(); let current = booking(); let error = null;
      await page.route('**/api/v1/**', async route => {
        const endpoint = new URL(route.request().url()).pathname;
        const headers = { 'Access-Control-Allow-Origin': base, 'Access-Control-Allow-Credentials': 'true' };
        if (endpoint.endsWith('/me')) return route.fulfill({ json: { data: { accountId: 'identity', displayName: 'Customer', email: 'test@example.test', status: 'ACTIVE' } }, headers });
        if (endpoint.endsWith('/accounts')) return route.fulfill({ json: { data: [{ customerId, name: 'Test customer' }] }, headers });
        return route.fulfill({ status: error?.status || 200, json: error ? { error: { code: error.code, message: 'internal details' } } : { data: current }, headers });
      });
      const url = base + (entry === 'private' ? `/quote/${token}/` : `/account/bookings/${bookingId}/`);
      Object.assign(current.quote, { legacy: true, pricing: null, proposedPlan: null });
      await page.goto(url); await page.getByText('An itemized breakdown is not available for this quote.').waitFor();
      assert.equal(await page.getByRole('heading', { name: 'Proposed payment schedule', exact: true }).count(), 0);
      current = booking(); current.quote.expiresOn = '2000-01-01'; current.nextAction = 'QUOTE_EXPIRED';
      await page.reload(); await page.getByText(/This unaccepted quote has expired/).waitFor(); assert.equal(await page.getByRole('checkbox').count(), 0);
      current = active(); current.paymentReviewRequired = true;
      await page.reload(); await page.getByRole('heading', { name: 'Accepted payment terms', exact: true }).waitFor(); assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      current = active(); current.nextAction = 'BOOKING_CLOSED'; current.status = 'CANCELLED';
      await page.reload(); await page.getByRole('heading', { name: 'Accepted payment terms', exact: true }).waitFor(); assert.equal(await page.getByRole('button', { name: /^Pay ₹/ }).count(), 0);
      error = { status: 404, code: entry === 'private' ? 'CORE_NOT_FOUND' : 'CUSTOMER_RECORD_NOT_FOUND' };
      await page.reload(); await page.getByText(entry === 'private' ? /This private link is no longer available/ : /This record or your account access is no longer available/).waitFor();
      assert.ok(!(await page.textContent('main')).includes('internal details'));
      if (entry === 'account') { error = { status: 401, code: 'AUTHENTICATION_REQUIRED' }; await page.goto(url); await page.waitForURL('**/account/login/**'); }
      await context.close();
    });
  }
});
