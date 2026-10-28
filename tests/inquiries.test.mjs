import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './load-ts.mjs';
process.env.NEXT_PUBLIC_CORE_API_BASE_URL = 'https://api.example.com/api/v1/core/';
const { submitInquiry, inquiryAttempt } = loadTs(new URL('../lib/inquiries/api.ts', import.meta.url));
const payload = { submissionId: 'abc', type: 'CONTACT', fullName: 'Jane', email: 'jane@example.com', phone: '+91 1234567890', message: 'Hello', pageUrl: 'https://example.com/contact/' };
test('uses only the core endpoint and requires the matching saved receipt', async () => {
  const original = global.fetch;
  try {
    global.fetch = async (url, options) => {
      assert.equal(url, 'https://api.example.com/api/v1/core/public/inquiries');
      assert.equal(options.mode, 'cors'); assert.equal(options.credentials, 'omit');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.deepEqual(JSON.parse(options.body), payload);
      return Response.json({ data: { id: 'abc', createdAt: '2026-10-27T00:00:00Z' } }, { status: 201 });
    };
    assert.equal((await submitInquiry(payload)).id, 'abc');
    for (const response of [new Response('unreadable', { status: 201 }), Response.json({ data: { id: 'other', createdAt: '2026-10-27' } }, { status: 201 }), Response.json({}, { status: 200 }), Response.json({}, { status: 500 })]) {
      global.fetch = async () => response;
      await assert.rejects(submitInquiry(payload), /could not confirm/);
    }
    global.fetch = async () => Response.json({}, { status: 429 });
    await assert.rejects(submitInquiry(payload), /wait a minute/);
    global.fetch = async () => { throw new Error('offline'); };
    await assert.rejects(submitInquiry(payload), /connection/);
  } finally { global.fetch = original; }
});
test('retries reuse submission IDs; editing content generates a new one', () => {
  const first = inquiryAttempt(null, payload);
  assert.equal(inquiryAttempt(first, payload), first);
  assert.notEqual(inquiryAttempt(first, { ...payload, message: 'Updated' }).id, first.id);
});
