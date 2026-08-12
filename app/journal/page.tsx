import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { journalEntries } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Field notes, practical perspectives and stories from Eastern Risen journeys across India and neighbouring lands.",
};

export default function JournalPage() {
  const [featured, ...entries] = journalEntries;

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="journal" />
      <main id="main-content" className="inner-page">
        <section className="journal-hero shell" aria-labelledby="journal-title">
          <div>
            <p className="eyebrow">The Eastern Risen journal</p>
            <h1 id="journal-title">Notes from places worth knowing.</h1>
          </div>
          <div className="journal-hero__copy">
            <p className="lead">Stories, seasonal perspective and practical context for travellers who want to look a little closer.</p>
            <p>These are observations gathered from the road: useful before you go, and sometimes worth carrying long after you return.</p>
          </div>
        </section>

        <section className="journal-feature shell" id={featured.slug} aria-labelledby="featured-note-title">
          <Link className="journal-feature__image" href={`/journal/${featured.slug}`} aria-label={`Read ${featured.title}`}>
            <Image src={featured.image} alt={featured.imageAlt} fill unoptimized priority sizes="(max-width: 800px) 100vw, 55vw" />
          </Link>
          <div className="journal-feature__content">
            <p className="eyebrow">Featured · {featured.label}</p>
            <h2 id="featured-note-title"><Link href={`/journal/${featured.slug}`}>{featured.title}</Link></h2>
            <p className="lead">{featured.excerpt}</p>
            <div className="journal-entry__meta"><span>{featured.season}</span><span>{featured.readTime}</span></div>
            <Link className="text-link text-link--large" href={`/journal/${featured.slug}`}>Read the full story <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="journal-index section shell" aria-labelledby="journal-index-title">
          <div className="section-heading">
            <div><p className="eyebrow">From the field</p><h2 id="journal-index-title">Read on</h2></div>
            <p>Culture, wildlife, craft and the quiet art of moving through a place with care.</p>
          </div>
          <div className="journal-grid">
            {entries.map((entry, index) => (
              <article className="journal-entry" id={entry.slug} key={entry.slug}>
                <Link className="journal-entry__link" href={`/journal/${entry.slug}`} aria-label={`Read ${entry.title}`}>
                  <div className="journal-entry__image">
                    <Image src={entry.image} alt={entry.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 720px) 100vw, 50vw" />
                    <span>0{index + 2}</span>
                  </div>
                  <div className="journal-entry__body">
                    <p className="eyebrow">{entry.label}</p>
                    <h3>{entry.title}</h3>
                    <p>{entry.excerpt}</p>
                    <div className="journal-entry__meta"><span>{entry.season}</span><span>{entry.readTime}</span></div>
                    <span className="journal-entry__read">Read the full story <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="journal-letter shell" aria-labelledby="journal-letter-title">
          <p className="eyebrow eyebrow--warm">A note from Bhubaneswar</p>
          <h2 id="journal-letter-title">The best journeys begin with a good question.</h2>
          <p>Tell us what you are curious about. It could be a landscape, a living tradition or a particular season. We will help turn that curiosity into a thoughtful route.</p>
          <Link className="button button--light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
        </section>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
