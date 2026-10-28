import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await fs.readFile(new URL('../lib/refresh/background.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { startBackgroundRefresh } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
function setup(refresh) {
  let now = 0; let tick; let cleared = false;
  const window = new EventTarget(); window.navigator = { onLine: true };
  const document = new EventTarget(); document.visibilityState = 'visible';
  const stop = startBackgroundRefresh(refresh, { window, document, now: () => now, setInterval(callback, delay) { assert.equal(delay, 60000); tick = callback; return 1; }, clearInterval(id) { assert.equal(id, 1); cleared = true; } });
  return { window, document, stop, time(value) { now = value; }, tick() { return tick(); }, cleared() { return cleared; } };
}
test('return events refresh after 30 seconds and coalesce focus/visibility events', async () => {
  let calls = 0; const env = setup(async () => { calls++; });
  env.time(29999); env.window.dispatchEvent(new Event('focus')); assert.equal(calls, 0);
  env.time(30000); env.window.dispatchEvent(new Event('focus')); env.document.dispatchEvent(new Event('visibilitychange')); assert.equal(calls, 1);
  await Promise.resolve(); env.time(60000); env.window.dispatchEvent(new Event('online')); assert.equal(calls, 2);
  env.stop();
});
test('interval skips hidden or offline pages and cleanup removes listeners and timer', async () => {
  let calls = 0; const env = setup(async () => { calls++; }); env.time(60000);
  env.document.visibilityState = 'hidden'; await env.tick(); assert.equal(calls, 0);
  env.document.visibilityState = 'visible'; env.window.navigator.onLine = false; await env.tick(); assert.equal(calls, 0);
  env.window.navigator.onLine = true; await env.tick(); assert.equal(calls, 1);
  env.stop(); assert.equal(env.cleared(), true); env.time(120000); env.window.dispatchEvent(new Event('focus')); env.window.dispatchEvent(new Event('online')); env.document.dispatchEvent(new Event('visibilitychange')); await env.tick(); assert.equal(calls, 1);
});
test('slow and failed requests do not cause overlapping or rapid repeated refreshes', async () => {
  let calls = 0; let release; const env = setup(() => { calls++; return new Promise((resolve, reject) => { release = () => reject(new Error('offline')); }); });
  env.time(60000); const pending = env.tick(); env.time(120000); await env.tick(); assert.equal(calls, 1);
  release(); await pending; const next = env.tick(); assert.equal(calls, 2); release(); await next;
  env.time(120001); await env.tick(); assert.equal(calls, 2); env.stop();
});
