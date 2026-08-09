import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import tourImages from "@/content-bank/data/tour_images.json";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Licensing and creator credits for the Eastern Risen journey collection.",
};

export default function PhotoCreditsPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" />
      <main id="main-content" className="inner-page">
        <section className="shell credits-page">
          <div className="credits-intro">
            <p className="eyebrow">Image provenance</p>
            <h1>Photo credits.</h1>
            <p>Every journey has its own cover. Sourced photographs retain their creator and licence details; original generated scenes are identified separately.</p>
          </div>
          <ol className="credits-list">
            {tourImages.map((entry) => (
              <li className="credit-item" key={entry.index}>
                <strong>{entry.tour}</strong>
                {entry.generated ? (
                  <span>Original generated asset created for Eastern Risen.</span>
                ) : (
                  <span>
                    {entry.sourceTitle} · {entry.creator || "Creator not listed"} · {entry.license}{" "}
                    {entry.sourcePage && <a href={entry.sourcePage} target="_blank" rel="noreferrer">View source</a>}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
