import type { Metadata } from 'next';
import { AccountApp } from '@/components/account/AccountApp';
export const metadata: Metadata = { title: 'My account', robots: { index: false, follow: false }, referrer: 'no-referrer', alternates: null, openGraph: null, twitter: null };
export default function Page() { return <AccountApp />; }
