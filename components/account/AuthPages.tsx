'use client';
import { useEffect, useState } from 'react';
import { CustomerClient, type Invitation } from '@/lib/account/api';
import { captureFragment, clearFragment, isAbort, safeReturn, timestamp } from '@/lib/account/state';
import { clearOrders } from '@/lib/account/orders';
import { AccountForm, Contact, ErrorNotice, Notice, type Field } from './ui';
const email: Field = { name: 'email', label: 'Email address', type: 'email', max: 320, autocomplete: 'username' };
const password: Field = { name: 'password', label: 'Password', type: 'password', min: 1, max: 128, autocomplete: 'current-password' };
export const newPassword: Field = { name: 'newPassword', label: 'New password (12–128 characters)', type: 'password', min: 12, max: 128, autocomplete: 'new-password' };
export const confirmPassword: Field = { name: 'confirm', label: 'Confirm new password', type: 'password', min: 12, max: 128, autocomplete: 'new-password' };
export function AuthPages({ route, client }: { route: string; client: CustomerClient }) {
  const [token, setToken] = useState(''); const [context, setContext] = useState<Invitation | null>(null); const [error, setError] = useState<unknown>(null); const [ready, setReady] = useState(false); const [success, setSuccess] = useState('');
  useEffect(() => {
    let active = true;
    const openLink = () => {
      client.scope.reset();
      const value = ['activate', 'reset-password'].includes(route) ? captureFragment(window.location, window.history) : '';
      queueMicrotask(() => { if (active) { setToken(value); setContext(null); setError(null); setSuccess(''); setReady(true); } });
      if (route === 'activate' && value) client.data<Invitation>('/invitations/context', 'POST', { token: value }).then(data => { if (active) setContext(data); }).catch(e => { if (active && !isAbort(e)) setError(e); });
    };
    openLink();
    const hashChanged = () => { if (new URLSearchParams(window.location.hash.slice(1)).has('token')) openLink(); };
    window.addEventListener('hashchange', hashChanged);
    return () => { active = false; window.removeEventListener('hashchange', hashChanged); client.scope.reset(); };
  }, [route, client]);
  const titles: Record<string, string> = { login: 'Welcome back.', activate: 'Activate your access.', 'forgot-password': 'Forgot your password?', 'reset-password': 'Choose a new password.' };
  if (success) return <div className="account-card account-auth"><h1>{success}</h1><Notice>{route === 'forgot-password' ? 'If an active customer account exists, recovery instructions will be sent.' : 'Please sign in with your customer account email and password to continue.'}</Notice><a className="button" href="/account/login/">Sign in</a></div>;
  return <div className="account-card account-auth"><p className="eyebrow">Your Eastern Risen account</p><h1>{titles[route]}</h1><ErrorNotice error={error} />
    {route === 'login' ? <><p>Sign in to view your bookings, quotes and billing.</p><AccountForm fields={[email, password]} action="Sign in" submit={async values => { await client.data('/auth/login', 'POST', { email: values.email, password: values.password }); client.scope.reset(); clearOrders(); window.location.assign(safeReturn(new URLSearchParams(location.search).get('returnTo'))); }} /><a href="/account/forgot-password/">Forgot password?</a><p className="account-auth-support">Need access? <Contact /></p></> : route === 'forgot-password' ? <><p>Enter your account email to request recovery instructions.</p><AccountForm fields={[{ ...email, autocomplete: 'email' }]} action="Request password reset" submit={async values => { await client.data('/auth/forgot-password', 'POST', { email: values.email }); setSuccess('Recovery request accepted.'); }} /></> : !ready ? <Notice>Opening your secure link…</Notice> : !token ? <Notice>This link is incomplete or was already opened in this browser. Reopen the original email link. <a href="/account/forgot-password/">Request password recovery</a> or <Contact />.</Notice> : route === 'activate' ? context ? <><dl className="account-facts"><div><dt>Invited email</dt><dd>{context.email}</dd></div><div><dt>Customer</dt><dd>{context.customerName} · {context.category}</dd></div><div><dt>Invitation expires</dt><dd>{timestamp(context.expiresAt)}</dd></div></dl><p>Activation gives you full access to this customer’s bookings and billing.</p><p>{context.existingUser ? 'Enter the current password for the customer account with the email above. Your existing name and password will be preserved.' : `Welcome, ${context.displayName}. Choose a password for your personal account.`}</p><AccountForm fields={context.existingUser ? [{ ...password, label: 'Current customer account password' }] : [{ ...newPassword, name: 'password' }, confirmPassword]} action="Activate access" submit={async values => { await client.data('/invitations/accept', 'POST', { token, password: values.password }); clearFragment(); setToken(''); setSuccess('Access activated.'); }} /></> : !error ? <Notice>Checking your invitation…</Notice> : null : <AccountForm fields={[newPassword, confirmPassword]} action="Reset password" submit={async values => { await client.request('/auth/reset-password', 'POST', { token, newPassword: values.newPassword }); client.scope.reset(); clearOrders(); clearFragment(); setToken(''); setSuccess('Password reset. Please sign in.'); }} />}
    {route !== 'login' && <p className="account-auth-back"><a href="/account/login/">Back to sign in</a></p>}
  </div>;
}
