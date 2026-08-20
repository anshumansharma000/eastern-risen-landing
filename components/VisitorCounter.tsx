"use client";

import { useEffect, useState } from "react";

const LEGACY_VISITOR_OFFSET = 490_302;
const GOATCOUNTER_TOTAL_URL =
  "https://easternrisen.goatcounter.com/counter/TOTAL.json";

type GoatCounterTotal = {
  count?: string;
};

export function VisitorCounter() {
  const [totalVisits, setTotalVisits] = useState(LEGACY_VISITOR_OFFSET);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVisitTotal() {
      try {
        const response = await fetch(GOATCOUNTER_TOTAL_URL, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as GoatCounterTotal;
        const currentSiteVisits = Number.parseInt(
          data.count?.replace(/[^0-9]/g, "") ?? "",
          10,
        );

        if (Number.isFinite(currentSiteVisits)) {
          setTotalVisits(LEGACY_VISITOR_OFFSET + currentSiteVisits);
        }
      } catch {
        // Keep the verified legacy total visible if the counter is unavailable.
      }
    }

    void loadVisitTotal();

    return () => controller.abort();
  }, []);

  const formattedTotal = new Intl.NumberFormat("en-US").format(totalVisits);

  return (
    <span
      className="footer__visitor-count"
      aria-live="polite"
      aria-label={`${formattedTotal} site visits, including visits recorded on the legacy site`}
    >
      {formattedTotal} site visits and counting
    </span>
  );
}
