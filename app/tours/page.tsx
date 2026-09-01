import type { Metadata } from "next";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { tourRegions, tours, tourStyles } from "@/lib/tours";
import { TourExplorer } from "./TourExplorer";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Explore Eastern Risen journeys across India, Odisha, the eastern Himalaya and neighbouring lands.",
  alternates: { canonical: "/tours/" },
};

export default function ToursPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="tours" />
      <main id="main-content" className="inner-page">
        <section className="collection-hero shell" aria-labelledby="collection-title">
          <div>
            <p className="eyebrow">The journey library</p>
            <h1 id="collection-title">Travel deeper.<br />Stay curious.</h1>
          </div>
          <div className="collection-hero__copy">
            <p className="lead">Journeys for people who want to understand a place, not simply pass through it.</p>
            <p>Explore our inherited itinerary library across India and neighbouring lands. Every route can become a starting point for a private journey shaped around your interests and pace.</p>
          </div>
          <div className="collection-stats" aria-label="Journey collection overview">
            <div><strong>{tours.length}</strong><span>Journeys in the archive</span></div>
            <div><strong>{tourRegions.length}</strong><span>Regions and countries</span></div>
            <div><strong>{tourStyles.length}</strong><span>Ways to travel</span></div>
          </div>
        </section>
        <TourExplorer tours={tours} regions={tourRegions} styles={tourStyles} />
        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
