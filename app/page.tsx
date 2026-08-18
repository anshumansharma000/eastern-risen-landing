import Image from "next/image";
import Link from "next/link";
import { PlanningCta } from "@/components/PlanningCta";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { tours } from "@/lib/tours";
import { travelStyleDefinitions } from "@/lib/travel-styles";
import { journalEntries } from "@/lib/journal";

type Journey = {
  slug: string;
  title: string;
  region: string;
  duration: string;
  description: string;
  image: string;
  imageAlt: string;
};

function tourMedia(slug: string) {
  const tour = tours.find((entry) => entry.slug === slug);
  if (!tour) throw new Error(`Missing signature journey: ${slug}`);
  return { image: tour.image, imageAlt: tour.imageAlt };
}

const journeys: Journey[] = [
  {
    slug: "odisha-golden-triangle",
    title: "Odisha Golden Triangle",
    region: "Odisha · Heritage & coast",
    duration: "3 nights · 4 days",
    description:
      "Temple cities, the sweep of Chilika and Puri’s coast offer an intimate introduction to our home ground.",
    ...tourMedia("odisha-golden-triangle"),
  },
  {
    slug: "sikkim-delight",
    title: "Sikkim Delight",
    region: "Sikkim · Culture & mountains",
    duration: "10 nights · 11 days",
    description:
      "A considered passage through monasteries, mountain roads and the living cultures of the eastern Himalaya.",
    ...tourMedia("sikkim-delight"),
  },
  {
    slug: "north-east-wildlife-tour",
    title: "North East Wildlife",
    region: "Northeast India · Wildlife",
    duration: "8 nights · 9 days",
    description:
      "Slow, observant days in some of India’s richest habitats, guided by the rhythms of the forest.",
    ...tourMedia("north-east-wildlife-tour"),
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <article className="journey-card">
      <Link className="journey-card__link" href={`/tours/${journey.slug}`} aria-label={`View the ${journey.title} journey`}>
        <div className="journey-card__image">
          <Image
            src={journey.image}
            alt={journey.imageAlt}
            fill
            unoptimized
            loading="lazy"
            decoding="async"
            sizes="(max-width: 720px) 88vw, (max-width: 1100px) 45vw, 31vw"
          />
        </div>
        <div className="journey-card__body">
          <div className="journey-card__meta">
            <span>{journey.region}</span>
            <span>{journey.duration}</span>
          </div>
          <h3>{journey.title}</h3>
          <p>{journey.description}</p>
          <span className="text-link">View journey <Arrow /></span>
        </div>
      </Link>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <SiteHeader />

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <HeroCarousel />
          <div className="hero__shade" />
          <div className="shell hero__content">
            <p className="eyebrow eyebrow--light">Private journeys · India & beyond</p>
            <h1 id="hero-title">Journeys that bring you closer.</h1>
            <p className="hero__lede">
              Travel shaped by local knowledge, uncommon routes and the kind of personal care that lets you be fully present.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/tours">Explore journeys</Link>
              <a className="button button--ghost" href="#plan">Plan a private tour</a>
            </div>
          </div>
          <div className="hero__foot shell" aria-hidden="true">
            <span>Our home ground</span><span>20.2961° N · 85.8245° E</span>
          </div>
        </section>

        <section className="intro section shell" aria-labelledby="intro-title">
          <div>
            <p className="eyebrow">The knowledgeable specialist</p>
            <h2 id="intro-title">Beyond the familiar, never beyond your comfort.</h2>
          </div>
          <div className="intro__copy">
            <p className="lead">
              We design private and small-group journeys for travellers who want to understand a place, not simply pass through it.
            </p>
            <p>
              From Odisha’s temple towns and wild coast to the eastern Himalaya and neighbouring lands, every route is considered with curiosity, context and care.
            </p>
          </div>
          <div className="principles principles--photographic" aria-label="Our travel principles">
            <div className="principle-card">
              <Image src="/images/principle-local-depth.jpg" alt="The intricately carved stone wheel of the Konark Sun Temple in Odisha" fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 33vw" />
              <div className="principle-card__shade" />
              <span className="principle-card__number">01</span>
              <div className="principle-card__content"><strong>Local depth</strong><span>Knowledge grounded in place</span></div>
            </div>
            <div className="principle-card">
              <Image src="/images/principle-your-pace.jpg" alt="A group of travellers trekking through the mountains of Himachal Pradesh" fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 33vw" />
              <div className="principle-card__shade" />
              <span className="principle-card__number">02</span>
              <div className="principle-card__content"><strong>Your pace</strong><span>Private and small-group travel</span></div>
            </div>
            <div className="principle-card">
              <Image src="/images/principle-personal-care.jpg" alt="Hotel staff in traditional Indian dress welcoming a traveller with namaste" fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 33vw" />
              <div className="principle-card__shade" />
              <span className="principle-card__number">03</span>
              <div className="principle-card__content"><strong>Personal care</strong><span>A human hand throughout</span></div>
            </div>
          </div>
        </section>

        <section className="journeys section" id="journeys" aria-labelledby="journeys-title">
          <div className="shell section-heading">
            <div>
              <p className="eyebrow">A place to begin</p>
              <h2 id="journeys-title">Signature journeys</h2>
            </div>
            <p>Distinctive routes with time to notice the details, meet the people and feel the landscape change.</p>
          </div>
          <div className="shell journey-grid">
            {journeys.map((journey) => <JourneyCard key={journey.title} journey={journey} />)}
          </div>
          <div className="shell section-action">
            <Link className="text-link text-link--large" href="/tours">Discover all journeys <Arrow /></Link>
          </div>
        </section>

        <section className="odisha section" id="odisha" aria-labelledby="odisha-title">
          <div className="shell odisha__grid">
            <div className="odisha__visual">
              <Image
                src="/images/odisha-temple.webp"
                alt="The carved stone towers of an Odisha temple complex"
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 800px) 100vw, 54vw"
              />
              <span className="image-note">Temple country · Coastal light · Living craft</span>
            </div>
            <div className="odisha__copy">
              <p className="eyebrow eyebrow--warm">Our home ground</p>
              <h2 id="odisha-title">Odisha, known from the inside.</h2>
              <p className="lead">
                Ancient temple cities. Forested river deltas. Buddhist hills, weaving villages and one of Asia’s great lagoons.
              </p>
              <p>
                Odisha is more than a destination in our collection. It shapes the way we travel. Here, depth comes from knowing which road to take, when to pause and how to enter a place with respect.
              </p>
              <Link className="text-link text-link--light" href="/destinations#odisha">Explore Odisha <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="styles section shell" id="travel-styles" aria-labelledby="styles-title">
          <div className="styles__intro">
            <p className="eyebrow">Follow your curiosity</p>
            <h2 id="styles-title">How would you like to travel?</h2>
            <p className="lead">Start with what draws you in. We’ll shape the route around it.</p>
          </div>
          <div className="styles__list">
            {travelStyleDefinitions.map((style) => (
              <Link href={`/travel-styles#${style.id}`} className="style-row" key={style.id}>
                <span className="style-row__number">{style.number}</span>
                <span className="style-row__title">{style.name}</span>
                <span className="style-row__description">{style.description}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </section>

        <section className="approach section" id="about" aria-labelledby="approach-title">
          <div className="shell approach__grid">
            <div className="approach__image">
              <Image
                src="/images/journey-planning.webp"
                alt="Hands planning a journey together over a route map"
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 800px) 100vw, 42vw"
              />
            </div>
            <div className="approach__copy">
              <p className="eyebrow">The Eastern Risen way</p>
              <h2 id="approach-title">A well-planned journey should still leave room for wonder.</h2>
              <p className="lead">
                The route, timing and practical details matter. So does the freedom to stop when the light changes, ask another question or linger over lunch.
              </p>
              <div className="approach__points">
                <div><span>01</span><p><strong>Listen first.</strong> Every journey begins with the traveller, not a template.</p></div>
                <div><span>02</span><p><strong>Go with context.</strong> Good guiding turns a sight into a story you understand.</p></div>
                <div><span>03</span><p><strong>Travel with respect.</strong> Care for communities, cultures and habitats is part of the plan.</p></div>
              </div>
              <Link className="text-link text-link--large approach__link" href="/about">More about Eastern Risen <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="notes section shell" aria-labelledby="notes-title">
          <div className="section-heading">
            <div><p className="eyebrow">From the field</p><h2 id="notes-title">Notes for curious travellers</h2></div>
            <p>Ideas, observations and practical context from the places we know.</p>
          </div>
          <div className="notes__grid">
            {journalEntries.slice(0, 3).map((note, index) => (
              <article className="note" key={note.title}>
                <div className="note__top"><span>{note.label}</span><span>0{index + 1}</span></div>
                <h3>{note.title}</h3>
                <p>{note.excerpt}</p>
                <Link href={`/journal#${note.slug}`} aria-label={`Read ${note.title}`}><Arrow /></Link>
              </article>
            ))}
          </div>
        </section>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
