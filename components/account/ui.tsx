'use client';
import { useEffect, useRef, useState } from 'react';
import { AccountError, errorMessage } from '@/lib/account/api';
import { date, money, isAbort } from '@/lib/account/state';
export function Status({ children }: { children: string }) { return <span className="account-status">{children.replaceAll('_', ' ').toLowerCase()}</span>; }
export function Contact() { return <a href="/contact/">Contact Eastern Risen</a>; }
export function ErrorNotice({ error }: { error: unknown }) { return error ? <div className="account-notice account-notice--error" role="alert"><p>{errorMessage(error)}</p>{error instanceof AccountError && error.requestId && <small>Support reference: {error.requestId}</small>}<p><Contact /></p></div> : null; }
export function Notice({ children }: { children: React.ReactNode }) { return <div className="account-notice" role="status">{children}</div>; }
export function RefreshNotice({ failed, refreshing, retry }: { failed: boolean; refreshing: boolean; retry: () => Promise<void> }) {
  return failed ? <Notice>Couldn’t update. Your previously loaded details are still displayed. <button disabled={refreshing} onClick={() => void retry()}>Try again</button></Notice> : null;
}
export type Field = { name: string; label: string; type?: string; min?: number; max?: number; initial?: string; autocomplete?: string };
export function AccountForm({ fields, submit, action, children }: { fields: Field[]; submit: (values: Record<string, string>) => Promise<void>; action: string; children?: React.ReactNode }) {
  const [error, setError] = useState<unknown>(null); const [busy, setBusy] = useState(false); const [now, setNow] = useState(() => Date.now()); const gate = useRef(false);
  const retryAt = error instanceof AccountError ? error.retryAt : 0;
  useEffect(() => { if (!retryAt) return; const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, [retryAt]);
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (gate.current) return; gate.current = true; setBusy(true); setError(null);
    const form = event.currentTarget; const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      if (values.confirm !== undefined && values.confirm !== (values.newPassword ?? values.password)) throw new AccountError(400, 'VALIDATION', 'Passwords do not match.', '', { 'body.confirm': 'Passwords do not match.' });
      await submit(values);
    } catch (e) { if (!isAbort(e)) setError(e); }
    finally { form.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(input => { input.value = ''; }); gate.current = false; setBusy(false); }
  }
  return <form className="account-form" onSubmit={send}><ErrorNotice error={error} />{fields.map(field => { const fieldError = error instanceof AccountError ? error.fields[`body.${field.name}`] || (field.name === 'currentPassword' && error.code === 'CURRENT_PASSWORD_INVALID' ? error.message : field.name === 'newPassword' && error.code === 'PASSWORD_REUSE_NOT_ALLOWED' ? error.message : '') : ''; return <label key={field.name} htmlFor={`field-${field.name}`}>{field.label}<input id={`field-${field.name}`} name={field.name} type={field.type || 'text'} required minLength={field.min} maxLength={field.max} defaultValue={field.initial} autoComplete={field.autocomplete} aria-invalid={Boolean(fieldError)} aria-describedby={fieldError ? `error-${field.name}` : undefined} disabled={busy} />{fieldError && <small id={`error-${field.name}`} className="account-field-error">{fieldError}</small>}</label>; })}{children}<button className="button" disabled={busy || retryAt > now} aria-busy={busy}>{busy ? 'Please wait…' : retryAt > now ? `Try again in ${Math.ceil((retryAt - now) / 1000)}s` : action}</button></form>;
}
export function Receipts({ payments }: { payments: { number: string | null; date: string; amount: string; method: string }[] }) { return <section><h3>Confirmed receipts</h3>{payments.length ? <ul className="account-records">{payments.map((p, i) => <li key={i}><span><strong>{p.number || 'Receipt'}</strong><small>{date(p.date)} · <span className="account-payment-method">{p.method.replaceAll('_', ' ').toLowerCase()}</span></small></span><strong>{money(p.amount)}</strong></li>)}</ul> : <p>No confirmed receipts yet.</p>}</section>; }
export function Pagination({ page, total, pageSize, change }: { page: number; total: number; pageSize: number; change: (page: number) => void }) { return <nav className="account-pagination" aria-label="Pagination"><button onClick={() => change(page - 1)} disabled={page <= 1}>Previous</button><span>Page {page} · {total} records</span><button onClick={() => change(page + 1)} disabled={page * pageSize >= total}>Next</button></nav>; }
