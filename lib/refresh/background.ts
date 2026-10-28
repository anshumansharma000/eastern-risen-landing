export const FOCUS_REFRESH_MS = 30_000;
export const BACKGROUND_REFRESH_MS = 60_000;

// The clock and event targets are injectable so timing and cleanup can be tested.
export function startBackgroundRefresh(refresh: () => Promise<unknown>, environment = {
  window, document, now: () => Date.now(),
  setInterval: (callback: () => void, delay: number) => window.setInterval(callback, delay),
  clearInterval: (id: number) => window.clearInterval(id),
}) {
  let lastAttempt = environment.now();
  let running = false;
  let stopped = false;
  const update = async () => {
    if (stopped || running || environment.document.visibilityState !== 'visible' || environment.window.navigator.onLine === false) return;
    if (environment.now() - lastAttempt < FOCUS_REFRESH_MS) return;
    lastAttempt = environment.now();
    running = true;
    try { await refresh(); } catch { /* The caller presents refresh errors. */ }
    finally { running = false; }
  };
  environment.window.addEventListener('focus', update);
  environment.window.addEventListener('online', update);
  environment.document.addEventListener('visibilitychange', update);
  const timer = environment.setInterval(update, BACKGROUND_REFRESH_MS);
  return () => {
    stopped = true;
    environment.clearInterval(timer);
    environment.window.removeEventListener('focus', update);
    environment.window.removeEventListener('online', update);
    environment.document.removeEventListener('visibilitychange', update);
  };
}
