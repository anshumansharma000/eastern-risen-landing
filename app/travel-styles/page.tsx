import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { tours } from "@/lib/tours";
import { travelStyleDefinitions } from "@/lib/travel-styles";

export const metadata: Metadata = {
  title: "Travel Styles",
  description: "Explore Eastern Risen journeys by interest—from wildlife and living culture to craft, spirituality and active exploration.",
};

export default function TravelStylesPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="styles" />
      <main id="main-content" className="inner-page">
        <section className="styles-hero shell" aria-labelledby="styles-page-title">
          <div>
            <p className="eyebrow">Follow your curiosity</p>
            <h1 id="styles-page-title">How would you like to travel?</h1>
          </div>
          <div className="styles-hero__copy">
            <p className="lead">Begin with what draws you in. We’ll help shape the route around it.</p>
            <p>A travel style is not a rigid category. It is a useful starting point—one that can lead toward a particular landscape, tradition or way of moving through a place.</p>
          </div>
          <div className="styles-hero__image">
            <Image src="/images/hero-odisha-dawn-v2.webp" alt="A river winding through the forested hills of Odisha at dawn" fill unoptimized priority sizes="(max-width: 720px) 100vw, 1360px" />
            <div><span>Private journeys</span><span>Designed around your interests</span></div>
          </div>
        </section>

        <nav className="style-page-nav shell" aria-label="Explore travel styles">
          {travelStyleDefinitions.map((style) => (
            <a href={`#${style.id}`} key={style.id}><span>{style.number}</span>{style.name}</a>
          ))}
        </nav>

        <div className="style-chapters shell">
          {travelStyleDefinitions.map((style, styleIndex) => {
            const styleTours = tours.filter((tour) => tour.travelStyle === style.name);
            return (
              <section className="style-chapter" id={style.id} key={style.id} aria-labelledby={`${style.id}-title`}>
                <div className="style-chapter__visual">
                  <Image src={style.image} alt={style.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 840px) 100vw, 48vw" />
                  <span>{style.number}</span>
                </div>
                <div className="style-chapter__content">
                  <p className="eyebrow">{style.eyebrow}</p>
                  <h2 id={`${style.id}-title`}>{style.name}</h2>
                  <p className="lead">{style.description}</p>
                  <p>{style.introduction}</p>
                  <div className="style-chapter__meta">
                    <div><strong>{styleTours.length}</strong><span>Journeys in the collection</span></div>
                    <Link className="text-link text-link--large" href={`/tours?style=${encodeURIComponent(style.name)}`}>Explore this style <span aria-hidden="true">↗</span></Link>
                  </div>
                </div>

                {styleTours.length > 0 ? (
                  <div className="style-featured" aria-label={`Featured ${style.name} journeys`}>
                    {styleTours.slice(0, 3).map((tour) => (
                      <article className="style-featured-card" key={tour.slug}>
                        <Link className="style-featured-card__image" href={`/tours/${tour.slug}`}>
                          <Image src={tour.image} alt={tour.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 31vw" />
                        </Link>
                        <div>
                          <p>{tour.region} · {tour.duration}</p>
                          <h3><Link href={`/tours/${tour.slug}`}>{tour.title}</Link></h3>
                          <Link className="text-link" href={`/tours/${tour.slug}`}>View journey <span aria-hidden="true">↗</span></Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
                <span className="sr-only">Travel style {styleIndex + 1} of {travelStyleDefinitions.length}</span>
              </section>
            );
          })}
        </div>

        <section className="tailor-made shell" id="tailor-made" aria-labelledby="tailor-made-title">
          <div><p className="eyebrow eyebrow--warm">Not one thing or another</p><h2 id="tailor-made-title">Most good journeys cross categories.</h2></div>
          <div><p className="lead">A wildlife route can hold craft, food and history. A cultural journey can make room for a long walk.</p><p>Tell us what you care about and we’ll combine styles into a journey that feels coherent, personal and entirely your own.</p><a className="button button--light" href="mailto:info@easternrisen.com?subject=Planning%20a%20tailor-made%20journey">Plan a tailor-made journey <span aria-hidden="true">↗</span></a></div>
        </section>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
