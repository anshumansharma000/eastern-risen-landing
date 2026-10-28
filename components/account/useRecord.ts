'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccountError, type CustomerClient } from '@/lib/account/api';
import { isAbort } from '@/lib/account/state';
import { startBackgroundRefresh } from '@/lib/refresh/background';

export function useRecord<T>(client: CustomerClient, path: string, refreshAccounts: () => Promise<void>, envelope = false) {
  const [data, setData] = useState<T | null>(null); const [error, setError] = useState<unknown>(null); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [refreshError, setRefreshError] = useState(false);
  const alive = useRef(false); const requestNumber = useRef(0); const hasData = useRef(false); const inFlight = useRef(false); const lastSuccess = useRef(0);
  const mutation = useRef(false);
  const beginMutation = useCallback(() => { mutation.current = true; requestNumber.current++; inFlight.current = false; }, []);
  const endMutation = useCallback(() => { mutation.current = false; }, []);
  const failed = useCallback(async (e: unknown) => {
    if (!alive.current || isAbort(e)) return;
    setError(e);
    if (e instanceof AccountError && ['CUSTOMER_RECORD_NOT_FOUND', 'CORE_NOT_FOUND'].includes(e.code)) { hasData.current = false; setData(null); try { await refreshAccounts(); } catch (next) { if (alive.current && !isAbort(next)) setError(next); } }
  }, [refreshAccounts]);
  const refresh = useCallback(async (background = false) => {
    if (background && (mutation.current || inFlight.current || Date.now() - lastSuccess.current < 30_000)) return;
    const number = ++requestNumber.current;
    inFlight.current = true;
    if (alive.current) { setLoading(!hasData.current); setRefreshing(true); }
    try {
      const result = envelope ? await client.request<T>(path) : await client.data<T>(path);
      if (alive.current && number === requestNumber.current) { hasData.current = true; lastSuccess.current = Date.now(); setData(result); setError(null); setRefreshError(false); }
    } catch (e) {
      if (number === requestNumber.current && !isAbort(e)) {
        if (hasData.current && !(e instanceof AccountError && ['CUSTOMER_RECORD_NOT_FOUND', 'CORE_NOT_FOUND'].includes(e.code))) { if (alive.current) setRefreshError(true); }
        else await failed(e);
      }
    } finally { if (number === requestNumber.current) { inFlight.current = false; if (alive.current) { setLoading(false); setRefreshing(false); } } }
  }, [client, path, failed, envelope]);
  useEffect(() => {
    let active = true;
    alive.current = true; hasData.current = false; lastSuccess.current = 0;
    queueMicrotask(() => { if (active && alive.current) { setData(null); setRefreshError(false); void refresh(); } });
    const stop = startBackgroundRefresh(() => refresh(true));
    // Cleanup invalidates outstanding requests; this ref is a sequence counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { active = false; stop(); alive.current = false; inFlight.current = false; requestNumber.current++; };
  }, [refresh]);
  return { data, error, loading, refreshing, refreshError, refresh, failed, alive, setError, beginMutation, endMutation };
}
