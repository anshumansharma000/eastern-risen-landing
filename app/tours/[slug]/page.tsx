import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getTourDetail } from "@/lib/tour-details";
import { tours } from "@/lib/tours";

type TourPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourDetail(slug);
  if (!tour) return { title: "Journey not found" };

  return {
    title: tour.title,
    description: tour.summary,
    openGraph: {
      title: `${tour.title} | Eastern Risen`,
      description: tour.summary,
      images: [{ url: tour.image, alt: tour.imageAlt }],
    },
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = getTourDetail(slug);
  if (!tour) notFound();

  const mailSubject = encodeURIComponent(`Planning the ${tour.title} journey`);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="tours" />
      <main id="main-content" className="inner-page">
        <div className="tour-detail-breadcrumb shell">
          <Link href="/tours">Journeys</Link><span aria-hidden="true">/</span><span>{tour.region}</span>
        </div>

        <section className="tour-detail-hero shell" aria-labelledby="tour-title">
          <Image src={tour.image} alt={tour.imageAlt} fill unoptimized priority sizes="(max-width: 720px) 100vw, 1360px" />
          <div className="tour-detail-hero__shade" />
          <div className="tour-detail-hero__content">
            <p className="eyebrow eyebrow--light">{tour.region} · {tour.travelStyle}</p>
            <h1 id="tour-title">{tour.title}</h1>
            <p>{tour.summary}</p>
          </div>
          <div className="tour-detail-hero__duration"><strong>{tour.duration}</strong><span>Suggested itinerary</span></div>
        </section>

        <section className="tour-facts shell" aria-label="Journey overview">
          <div><span>Duration</span><strong>{tour.duration}</strong></div>
          <div><span>Starts in</span><strong>{tour.startingPoint}</strong></div>
          <div><span>Ends in</span><strong>{tour.endingPoint}</strong></div>
          <div><span>Pace & season</span><strong>Tailored during planning</strong></div>
        </section>

        <div className="tour-detail-layout shell">
          <div className="tour-detail-main">
            <section className="tour-detail-intro" aria-labelledby="overview-title">
              <p className="eyebrow">The journey</p>
              <h2 id="overview-title">A route to make your own.</h2>
              <p className="lead">This itinerary is a considered starting point, ready to be adjusted around your dates, pace and interests.</p>
              <p>{tour.summary} The final sequence, stays and arrangements are confirmed with you before travel.</p>
            </section>

            {tour.routeStops.length > 0 ? (
              <section className="tour-route" aria-labelledby="route-title">
                <div className="tour-detail-section-heading">
                  <div><p className="eyebrow">The route</p><h2 id="route-title">Along the way</h2></div>
                  <p>{tour.route}</p>
                </div>
                <ol>
                  {tour.routeStops.map((stop, index) => <li key={`${stop}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stop}</strong></li>)}
                </ol>
              </section>
            ) : null}

            <section className="tour-itinerary" aria-labelledby="itinerary-title">
              <div className="tour-detail-section-heading">
                <div><p className="eyebrow">Day by day</p><h2 id="itinerary-title">The itinerary</h2></div>
                <p>{tour.itinerary.length > 0 ? `${tour.itinerary.length} days, with space for the unexpected.` : "This route is awaiting a fully reviewed day-by-day plan."}</p>
              </div>

              {tour.itinerary.length > 0 ? (
                <div className="itinerary-days">
                  {tour.itinerary.map((item, index) => (
                    <details key={`${item.day}-${index}`} open={index === 0}>
                      <summary><span>{item.day}</span><strong>{item.title}</strong><i aria-hidden="true">+</i></summary>
                      <p>{item.description}</p>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="itinerary-placeholder">
                  <p className="lead">We’re refining this legacy itinerary before presenting it as a daily schedule.</p>
                  <p>Its route and duration remain available as inspiration. Speak with us and we’ll shape a current version around the places and experiences that interest you.</p>
                  <a className="text-link text-link--large" href={`mailto:info@easternrisen.com?subject=${mailSubject}`}>Discuss this route <span aria-hidden="true">↗</span></a>
                </div>
              )}
            </section>

            <section className="tour-practical" aria-labelledby="practical-title">
              <div className="tour-detail-section-heading">
                <div><p className="eyebrow">Good to know</p><h2 id="practical-title">Planned around you</h2></div>
                <p>Practical details are agreed personally, so the journey suits your comfort, interests and travel dates.</p>
              </div>
              <div className="tour-practical__grid">
                <article><span>01</span><h3>Stays</h3><p>Accommodation is selected to fit the route and your preferred level of comfort.</p></article>
                <article><span>02</span><h3>Getting around</h3><p>Transport, transfers and local arrangements are confirmed as part of the final itinerary.</p></article>
                <article><span>03</span><h3>Meals & permits</h3><p>Meal plans, permits and destination requirements are clarified before you commit.</p></article>
                <article><span>04</span><h3>Travel thoughtfully</h3><p>We encourage respectful visits to communities, sacred places and wildlife habitats.</p></article>
              </div>
            </section>
          </div>

          <aside className="tour-plan-card" aria-label="Plan this journey">
            <p className="eyebrow">Make it yours</p>
            <h2>Interested in this journey?</h2>
            <p>Tell us what caught your attention. We’ll help refine the route around your time, pace and priorities.</p>
            <a className="button" href={`mailto:info@easternrisen.com?subject=${mailSubject}`}>Start a conversation <span aria-hidden="true">↗</span></a>
            <small>No fixed departures or fabricated pricing—just a thoughtful planning conversation.</small>
          </aside>
        </div>

        {tour.relatedTours.length > 0 ? (
          <section className="related-journeys section shell" aria-labelledby="related-title">
            <div className="tour-detail-section-heading">
              <div><p className="eyebrow">Keep exploring</p><h2 id="related-title">Related journeys</h2></div>
              <Link className="text-link text-link--large" href="/tours">View all journeys <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="related-journeys__grid">
              {tour.relatedTours.map((related) => (
                <article className="related-card" key={related.slug}>
                  <Link className="related-card__image" href={`/tours/${related.slug}`}>
                    <Image src={related.image} alt={related.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 33vw" />
                  </Link>
                  <div><p>{related.region} · {related.duration}</p><h3><Link href={`/tours/${related.slug}`}>{related.title}</Link></h3><Link className="text-link" href={`/tours/${related.slug}`}>View journey <span aria-hidden="true">↗</span></Link></div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <div className="tour-mobile-cta"><span>{tour.title}</span><a className="button" href={`mailto:info@easternrisen.com?subject=${mailSubject}`}>Plan this journey</a></div>
      <SiteFooter />
    </>
  );
}
