import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './load-ts.mjs';
process.env.NEXT_PUBLIC_CORE_API_BASE_URL = 'https://api.example.com/api/v1/core/';
const { ANNOUNCEMENT_INTERVAL_MS, announcementQueue, nextAnnouncementKey, currentAnnouncements, dismissalKey, fetchAnnouncements, parseAnnouncements, safeAnnouncementLink } = loadTs(new URL('../lib/announcements.ts', import.meta.url));
const record = { id: 'one', revision: 2, category: 'GENERAL', message: 'Discover Odisha.', linkText: 'Explore', linkUrl: '/tours', priority: 'NORMAL', dismissible: true, startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-11-01T00:00:00Z' };
test('uses public Core API without private cookies or page query strings', async () => {
  const original = global.fetch;
  try {
    global.fetch = async (url, options) => {
      assert.equal(url, 'https://api.example.com/api/v1/core/public/announcements?page=%2Ftours');
      assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer');
      return Response.json({ data: [record] });
    };
    assert.deepEqual(await fetchAnnouncements('/tours', new AbortController().signal), [record]);
    global.fetch = async () => new Response('Unavailable', { status: 503 });
    await assert.rejects(fetchAnnouncements('/', new AbortController().signal));
  } finally { global.fetch = original; }
});
test('rejects unreadable payloads and drops unsafe or malformed content', () => {
  assert.throws(() => parseAnnouncements({}));
  for (const patch of [{ linkUrl: 'javascript:alert(1)' }, { linkUrl: '//evil.test' }, { category: 'OTHER' }, { revision: 0 }, { startsAt: 'invalid' }, { message: '' }]) assert.deepEqual(parseAnnouncements({ data: [{ ...record, ...patch }] }), []);
  assert.equal(safeAnnouncementLink('https://example.com/news'), true);
  assert.equal(safeAnnouncementLink('/quote/secret'), false);
});
test('enforces schedule boundaries locally between refreshes and keys dismissals by revision', () => {
  assert.equal(currentAnnouncements([record], Date.parse('2026-09-30')).length, 0);
  assert.equal(currentAnnouncements([record], Date.parse(record.startsAt)).length, 1);
  assert.equal(currentAnnouncements([record], Date.parse(record.endsAt)).length, 0);
  assert.notEqual(dismissalKey(record), dismissalKey({ ...record, revision: 3 }));
});

test('rotation includes every priority and category and wraps in both directions', () => {
  const items = [record, { ...record, id: 'advisory', category: 'TRAVEL_ADVISORY', priority: 'IMPORTANT', dismissible: false }, { ...record, id: 'service', category: 'SERVICE_UPDATE' }];
  const queue = announcementQueue(items, new Set());
  assert.equal(ANNOUNCEMENT_INTERVAL_MS, 5000);
  assert.equal(nextAnnouncementKey(queue, dismissalKey(record)), dismissalKey(items[1]));
  assert.equal(nextAnnouncementKey(queue, dismissalKey(items[1])), dismissalKey(items[2]));
  assert.equal(nextAnnouncementKey(queue, dismissalKey(items[2])), dismissalKey(record));
  assert.equal(nextAnnouncementKey(queue, dismissalKey(record), -1), dismissalKey(items[2]));
});
test('dismissed messages leave the loop, new revisions return and an empty loop hides', () => {
  const second = { ...record, id: 'second' };
  const dismissed = new Set([dismissalKey(record)]);
  assert.deepEqual(announcementQueue([record, second], dismissed), [second]);
  assert.equal(nextAnnouncementKey([second], dismissalKey(second)), dismissalKey(second));
  dismissed.add(dismissalKey(second));
  assert.deepEqual(announcementQueue([record, second], dismissed), []);
  assert.equal(nextAnnouncementKey([], ''), '');
  assert.equal(announcementQueue([{ ...record, revision: 3 }], dismissed).length, 1);
  assert.equal(announcementQueue([{ ...record, dismissible: false }], dismissed).length, 1);
});
test('removing the current announcement through expiry leaves a usable rotation', () => {
  const expired = { ...record, id: 'expired', endsAt: '2026-10-02T00:00:00Z' };
  const queue = currentAnnouncements([expired, record], Date.parse('2026-10-27'));
  assert.deepEqual(queue, [record]);
  assert.equal(nextAnnouncementKey(queue, dismissalKey(expired)), dismissalKey(record));
});

test('a fresh page restores the same announcements after all were dismissed', () => {
  const items = [record, { ...record, id: 'second' }];
  const pageDismissals = new Set(items.map(dismissalKey));
  assert.deepEqual(announcementQueue(items, pageDismissals), []);
  assert.deepEqual(announcementQueue(items, new Set()), items);
  assert.deepEqual(announcementQueue(items, pageDismissals), []);
});
