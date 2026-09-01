import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { destinationDefinitions, indiaDestinations, neighbouringDestinations, odishaDestination, type DestinationDefinition } from "@/lib/destinations";
import { tours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Eastern Risen destinations across Odisha, India, the Himalaya and neighbouring lands.",
  alternates: { canonical: "/destinations/" },
};

function DestinationCard({ destination }: { destination: DestinationDefinition }) {
  const destinationTours = tours.filter((tour) => tour.region === destination.region);
  const featuredTour = destinationTours[0];

  return (
    <article className="destination-card" id={destination.id}>
      <Link className="destination-card__image" href={`/tours?region=${encodeURIComponent(destination.region)}`} aria-label={`Explore journeys in ${destination.name}`}>
        <Image src={destination.image} alt={destination.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 48vw, 31vw" />
        <span>{destinationTours.length} journeys</span>
      </Link>
      <div className="destination-card__body">
        <p className="eyebrow">{destination.eyebrow}</p>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        {featuredTour ? <p className="destination-card__featured"><span>A place to begin</span><Link href={`/tours/${featuredTour.slug}`}>{featuredTour.title}</Link></p> : null}
        <Link className="text-link" href={`/tours?region=${encodeURIComponent(destination.region)}`}>Explore {destination.name} <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}

export default function DestinationsPage() {
  const odishaTours = tours.filter((tour) => tour.region === odishaDestination.region);
  const odishaStyles = [...new Set(odishaTours.map((tour) => tour.travelStyle))].slice(0, 3);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="destinations" />
      <main id="main-content" className="inner-page">
        <section className="destinations-hero shell" aria-labelledby="destinations-title">
          <div>
            <p className="eyebrow">Where we travel</p>
            <h1 id="destinations-title">Places worth knowing slowly.</h1>
          </div>
          <div className="destinations-hero__copy">
            <p className="lead">A destination is more than a list of sights. It is a landscape of relationships, histories and everyday life.</p>
            <p>Our journeys begin with local context and a carefully considered route. They reach across India and into neighbouring lands we have travelled through for years.</p>
          </div>
          <div className="destinations-hero__image">
            <Image src="/images/sikkim-himalaya.webp" alt="Prayer flags looking across the layered hills of Sikkim" fill unoptimized priority sizes="(max-width: 720px) 100vw, 1360px" />
            <div><span>From Odisha outward</span><span>{destinationDefinitions.length} regions and countries</span></div>
          </div>
        </section>

        <nav className="destination-nav shell" aria-label="Explore destinations">
          {destinationDefinitions.map((destination) => {
            const journeyCount = tours.filter((tour) => tour.region === destination.region).length;

            return (
              <a href={`#${destination.id}`} key={destination.id}>
                <span>{destination.name}</span>
                <strong>{journeyCount}</strong>
              </a>
            );
          })}
        </nav>

        <section className="destination-odisha shell" id="odisha" aria-labelledby="odisha-destination-title">
          <div className="destination-odisha__visual">
            <Image src={odishaDestination.image} alt={odishaDestination.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 840px) 100vw, 54vw" />
            <span>{odishaTours.length} journeys · Our deepest collection</span>
          </div>
          <div className="destination-odisha__content">
            <p className="eyebrow eyebrow--warm">{odishaDestination.eyebrow}</p>
            <h2 id="odisha-destination-title">Odisha, known from the inside.</h2>
            <p className="lead">{odishaDestination.description}</p>
            <p>It is the place from which Eastern Risen sees the wider world: with patience, personal knowledge and an instinct for what sits beyond the obvious route.</p>
            <div className="destination-odisha__styles" aria-label="Ways to explore Odisha">
              {odishaStyles.map((style) => <span key={style}>{style}</span>)}
            </div>
            <Link className="button button--light" href="/tours?region=Odisha">Explore Odisha journeys <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="destination-collection section shell" aria-labelledby="india-destinations-title">
          <div className="destination-collection__heading">
            <div><p className="eyebrow">India, region by region</p><h2 id="india-destinations-title">Many Indias, thoughtfully connected.</h2></div>
            <p>Move from Himalayan roads to central forests and southern coasts, with each route shaped around the character of its region.</p>
          </div>
          <div className="destination-grid">
            {indiaDestinations.map((destination) => <DestinationCard destination={destination} key={destination.id} />)}
          </div>
        </section>

        <section className="destination-collection destination-collection--neighbours section shell" aria-labelledby="neighbouring-title">
          <div className="destination-collection__heading">
            <div><p className="eyebrow">Neighbouring lands</p><h2 id="neighbouring-title">Journeys beyond India.</h2></div>
            <p>Extend the map into Himalayan kingdoms, island landscapes and Southeast Asian cities through routes grounded in the same personal planning.</p>
          </div>
          <div className="destination-grid destination-grid--neighbours">
            {neighbouringDestinations.map((destination) => <DestinationCard destination={destination} key={destination.id} />)}
          </div>
        </section>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
