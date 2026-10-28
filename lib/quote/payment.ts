import type { Checkout } from "./api";

type CashfreeInstance = { checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" }) => Promise<unknown> };
declare global { interface Window { Cashfree?: (options: { mode: "sandbox" | "production" }) => CashfreeInstance } }
let sdkPromise: Promise<void> | null = null;

function loadCashfree(): Promise<void> {
  if (window.Cashfree) return Promise.resolve();
  if (!sdkPromise) sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.onload = () => window.Cashfree ? resolve() : reject(new Error("Payment service unavailable"));
    script.onerror = () => reject(new Error("Payment service unavailable"));
    document.head.appendChild(script);
  }).catch((error) => { sdkPromise = null; throw error; });
  return sdkPromise;
}

const providers: Record<string, (sessionId: string) => Promise<void>> = {
  cashfree: async (sessionId) => {
    await loadCashfree();
    const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox";
    await window.Cashfree!({ mode }).checkout({ paymentSessionId: sessionId, redirectTarget: "_modal" });
  },
};

export async function openPayment(checkout: Checkout): Promise<void> {
  const provider = providers[checkout.provider.toLowerCase()];
  if (!provider) throw new Error("Unsupported payment provider");
  await provider(checkout.sessionId);
}
