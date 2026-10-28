"use client";

import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    if (location.pathname.startsWith("/quote") || location.pathname.startsWith("/account")) return;
    const script = document.createElement("script");
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = "https://easternrisen.goatcounter.com/count";
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}
