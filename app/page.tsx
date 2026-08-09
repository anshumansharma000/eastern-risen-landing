import Image from "next/image";
import Link from "next/link";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { travelStyleDefinitions } from "@/lib/travel-styles";

type Journey = {
  slug: string;
  title: string;
  region: string;
  duration: string;
  description: string;
  image: string;
  imageAlt: string;
};

const journeys: Journey[] = [
  {
    slug: "odisha-golden-triangle",
    title: "Odisha Golden Triangle",
    region: "Odisha · Heritage & coast",
    duration: "3 nights · 4 days",
    description:
      "Temple cities, the sweep of Chilika and Puri’s coast—an intimate introduction to our home ground.",
    image: "/images/odisha-temple.webp",
    imageAlt: "Historic temple architecture in Odisha in warm evening light",
  },
  {
    slug: "sikkim-delight",
    title: "Sikkim Delight",
    region: "Sikkim · Culture & mountains",
    duration: "10 nights · 11 days",
    description:
      "A considered passage through monasteries, mountain roads and the living cultures of the eastern Himalaya.",
    image: "/images/sikkim-himalaya.webp",
    imageAlt: "A Himalayan valley in Sikkim with prayer flags in the foreground",
  },
  {
    slug: "north-east-wildlife-tour",
    title: "North East Wildlife",
    region: "Northeast India · Wildlife",
    duration: "8 nights · 9 days",
    description:
      "Slow, observant days in some of India’s richest habitats, guided by the rhythms of the forest.",
    image: "/images/assam-rhino.webp",
    imageAlt: "An Indian rhinoceros walking through dense green forest",
  },
];

const fieldNotes = [
  {
    label: "Field guide",
    title: "When Odisha’s coast feels most alive",
    text: "A seasonal perspective on lagoons, temple towns and the changing light along the Bay of Bengal.",
  },
  {
    label: "On the road",
    title: "The pleasure of travelling slowly",
    text: "Why the memorable moments often happen between the landmarks on a carefully paced journey.",
  },
  {
    label: "Travel well",
    title: "How to be a thoughtful guest",
    text: "Simple principles for entering communities, sacred spaces and wildlife habitats with respect.",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <article className="journey-card">
      <Link className="journey-card__image" href={`/tours/${journey.slug}`} aria-label={`View the ${journey.title} journey`}>
        <Image
          src={journey.image}
          alt={journey.imageAlt}
          fill
          unoptimized
          loading="lazy"
          decoding="async"
          sizes="(max-width: 720px) 88vw, (max-width: 1100px) 45vw, 31vw"
        />
      </Link>
      <div className="journey-card__body">
        <div className="journey-card__meta">
          <span>{journey.region}</span>
          <span>{journey.duration}</span>
        </div>
        <h3>{journey.title}</h3>
        <p>{journey.description}</p>
        <Link className="text-link" href={`/tours/${journey.slug}`}>
          View journey <Arrow />
        </Link>
      </div>
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
          <Image
            className="hero__image"
            src="/images/hero-odisha-dawn-v2.webp"
            alt="A quiet river winding through forested hills in Odisha at dawn"
            fill
            unoptimized
            priority
            sizes="100vw"
          />
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
              We design private and small-group journeys for travellers who want to understand a place—not simply pass through it.
            </p>
            <p>
              From Odisha’s temple towns and wild coast to the eastern Himalaya and neighbouring lands, every route is considered with curiosity, context and care.
            </p>
          </div>
          <div className="principles" aria-label="Our travel principles">
            <div><strong>Local depth</strong><span>Knowledge grounded in place</span></div>
            <div><strong>Your pace</strong><span>Private and small-group travel</span></div>
            <div><strong>Personal care</strong><span>A human hand throughout</span></div>
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
                Odisha is more than a destination in our collection—it is the perspective from which we travel. Here, depth comes from knowing which road to take, when to pause and how to enter a place with respect.
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
            {fieldNotes.map((note, index) => (
              <article className="note" key={note.title}>
                <div className="note__top"><span>{note.label}</span><span>0{index + 1}</span></div>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
                <a href="#plan" aria-label={`Read ${note.title}`}><Arrow /></a>
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
