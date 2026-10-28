import type { Metadata } from "next";
import { QuotePage } from "@/components/quote/QuotePage";

export const metadata: Metadata = {
  title: "Your private quote",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
  alternates: null,
  openGraph: null,
  twitter: null,
};

export default function Page() { return <QuotePage />; }
