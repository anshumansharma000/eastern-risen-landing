'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { RequestScope, CustomerClient, type Account, type Profile } from '@/lib/account/api';
import { isAbort, selectAccount, uuidPattern } from '@/lib/account/state';
import { AuthPages } from './AuthPages';
import { Contact, ErrorNotice, Notice } from './ui';
import { Records } from './Records';
import { BookingDetail } from './BookingDetail';
import { InvoiceDetail } from './InvoiceDetail';
import { ProfilePage } from './ProfilePage';
import { clearOrders } from '@/lib/account/orders';
import './account.css';
const subscribe = () => () => {};
const preferredKey = 'eastern-risen-preferred-customer';
function preferred() { try { return localStorage.getItem(preferredKey); } catch { return null; } }
function remember(id: string) { try { localStorage.setItem(preferredKey, id); } catch { /* local preference is optional */ } }
export function AccountApp() {
  const path = useSyncExternalStore(subscribe, () => location.pathname, () => '');
  const parts = path.replace(/\/$/, '').split('/'); const route = parts[2] || 'bookings'; const recordId = parts[3];
  const auth = ['login', 'activate', 'forgot-password', 'reset-password'].includes(route);
  const [profile, setProfile] = useState<Profile | null>(null); const [accounts, setAccounts] = useState<Account[]>([]); const [accountsReady, setAccountsReady] = useState(false); const [selected, setSelected] = useState<Account | null>(null); const [generation, setGeneration] = useState(0); const [loading, setLoading] = useState(true); const [error, setError] = useState<unknown>(null); const [loggingOut, setLoggingOut] = useState(false);
  const current = useRef<Account | null>(null); const signature = useRef(''); const identity = useRef('');
  const [client] = useState(() => {
    const scope = new RequestScope();
    return new CustomerClient(scope, () => { scope.reset(); clearOrders(); setProfile(null); setAccounts([]); setAccountsReady(false); setSelected(null); setGeneration(g => g + 1); window.location.replace(`/account/login/?returnTo=${encodeURIComponent(window.location.pathname)}`); });
  });
  const refreshAccounts = useCallback(async () => {
    const next = await client.accounts(); const chosen = selectAccount(next, current.current?.customerId || preferred());
    const changed = signature.current !== JSON.stringify(next) || current.current?.customerId !== chosen?.customerId;
    if (changed) { client.scope.reset(); setGeneration(g => g + 1); }
    signature.current = JSON.stringify(next); current.current = chosen; setAccounts(next); setAccountsReady(true); setError(null); setSelected(chosen); if (chosen) remember(chosen.customerId);
  }, [client, setAccounts, setSelected, setAccountsReady, setError]);
  useEffect(() => {
    if (!path || auth) return;
    let active = true;
    const boot = async () => { try { const me = await client.me(); if (!active) return; identity.current = me.accountId; setProfile(me); await refreshAccounts(); } catch (e) { if (active && !isAbort(e)) setError(e); } finally { if (active) setLoading(false); } };
    void boot();
    const focus = () => {
      if (document.visibilityState !== 'visible') return;
      void (async () => {
        try {
          const me = await client.me();
          if (!active) return;
          if (identity.current !== me.accountId) { client.scope.reset(); clearOrders(); setSelected(null); setAccounts([]); setAccountsReady(false); current.current = null; signature.current = ''; setGeneration(g => g + 1); }
          identity.current = me.accountId; setProfile(me);
          await refreshAccounts();
        } catch (e) { if (active && !isAbort(e)) { client.scope.reset(); setSelected(null); setAccountsReady(false); setGeneration(g => g + 1); setError(e); } }
      })();
    };
    window.addEventListener('focus', focus); document.addEventListener('visibilitychange', focus);
    return () => { active = false; client.scope.reset(); window.removeEventListener('focus', focus); document.removeEventListener('visibilitychange', focus); };
  }, [path, auth, client, refreshAccounts]);
  async function logout() {
    if (loggingOut) return; setLoggingOut(true); client.scope.reset(); clearOrders(); setProfile(null); setAccounts([]); setAccountsReady(false); setSelected(null); current.current = null; setGeneration(g => g + 1);
    try { await client.request('/auth/logout', 'POST'); window.location.replace('/account/login/'); }
    catch (e) { if (!isAbort(e)) setError(e); } finally { setLoggingOut(false); }
  }
  function switchAccount(id: string) { const account = accounts.find(a => a.customerId === id); if (!account) return; client.scope.reset(); current.current = account; setSelected(account); setGeneration(g => g + 1); remember(id); if (recordId) window.location.assign(`/account/${route}/`); }
  const validRoute = ['bookings', 'billing', 'profile'].includes(route) && (!recordId || (route !== 'profile' && uuidPattern.test(recordId))) && parts.length <= 4;
  return <div className="account-page"><a className="skip-link" href="#account-main">Skip to account</a><header className="account-header"><div className="account-shell"><Link href="/" aria-label="Eastern Risen home"><Image src="/images/eastern-risen-logo-dark.png" alt="Eastern Risen" width={922} height={271} priority unoptimized /></Link><span>Customer account</span>{!auth && <button disabled={loggingOut} onClick={logout}>{loggingOut ? 'Signing out…' : 'Sign out'}</button>}</div></header><main id="account-main" className="account-shell account-main">
    {!path ? <Notice>Opening your account…</Notice> : auth ? <AuthPages route={route} client={client} /> : <><ErrorNotice error={error} />{loading ? <Notice>Loading your account…</Notice> : !profile ? <Notice>Unable to load your session. <a href="/account/login/">Sign in</a> or <button onClick={() => window.location.reload()}>Retry</button>. {Boolean(error) && <button onClick={logout}>Retry sign out</button>}</Notice> : <><div className="account-welcome"><div><p className="eyebrow">Welcome, {profile.displayName}</p><h1>{route === 'billing' ? 'Your billing.' : route === 'profile' ? 'Your profile.' : 'Your journeys.'}</h1></div>{accounts.length > 1 ? <label>Customer account<select value={selected?.customerId || ''} onChange={event => switchAccount(event.target.value)}>{accounts.map(a => <option key={a.customerId} value={a.customerId}>{a.name} · {a.category}</option>)}</select></label> : selected ? <p>{selected.name} · {selected.category}</p> : null}</div><nav className="account-nav" aria-label="Account navigation">{['bookings', 'billing', 'profile'].map(item => <a key={item} href={`/account/${item}/`} aria-current={route === item ? 'page' : undefined}>{item[0].toUpperCase() + item.slice(1)}</a>)}</nav><div key={`${profile.accountId}:${selected?.customerId}:${generation}`}>{!validRoute ? <Notice>This account page is unavailable. <a href="/account/bookings/">Go to bookings</a>.</Notice> : route === 'profile' ? <ProfilePage client={client} profile={profile} update={setProfile} signOut={() => { client.scope.reset(); clearOrders(); setProfile(null); setAccounts([]); setAccountsReady(false); setSelected(null); window.location.replace('/account/login/'); }} /> : !accountsReady ? <Notice>We couldn’t load your account access. <button onClick={() => window.location.reload()}>Try again</button> or <Contact />.</Notice> : !selected ? <Notice>You don’t currently have account access. <Contact />. You can edit your personal profile or sign out above.</Notice> : recordId ? route === 'bookings' ? <BookingDetail client={client} identity={profile.accountId} customerId={selected.customerId} bookingId={recordId} refreshAccounts={refreshAccounts} /> : <InvoiceDetail client={client} customerId={selected.customerId} invoiceId={recordId} refreshAccounts={refreshAccounts} /> : <Records client={client} customerId={selected.customerId} kind={route as 'bookings' | 'billing'} refreshAccounts={refreshAccounts} />}</div></>}</>}
  </main><footer className="account-shell account-footer"><Contact /><span>© Eastern Risen Expedition Pvt. Ltd.</span></footer></div>;
}
