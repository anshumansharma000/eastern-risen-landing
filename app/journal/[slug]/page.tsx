import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getJournalEntry, journalEntries } from "@/lib/journal";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return journalEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.excerpt,
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      type: "article",
      images: [{ url: entry.image, alt: entry.imageAlt }],
    },
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) notFound();

  const currentIndex = journalEntries.findIndex((item) => item.slug === entry.slug);
  const nextEntry = journalEntries[(currentIndex + 1) % journalEntries.length];

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="journal" />
      <main id="main-content" className="inner-page journal-article-page">
        <nav className="article-breadcrumb shell" aria-label="Breadcrumb">
          <Link href="/journal">Journal</Link><span aria-hidden="true">/</span><span>{entry.label}</span>
        </nav>

        <article>
          <header className="article-header shell">
            <p className="eyebrow">{entry.label}</p>
            <h1>{entry.title}</h1>
            <p className="lead">{entry.introduction}</p>
            <div className="article-header__meta">
              <span>{entry.published}</span><span>{entry.season}</span><span>{entry.readTime}</span>
            </div>
          </header>

          <div className="article-hero shell">
            <Image src={entry.image} alt={entry.imageAlt} fill unoptimized priority sizes="(max-width: 720px) 100vw, 1360px" />
          </div>

          <div className="article-body shell">
            {entry.sections.map((section, index) => (
              <section key={`${entry.slug}-${index}`}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.pullQuote && <blockquote>{section.pullQuote}</blockquote>}
              </section>
            ))}
          </div>
        </article>

        <aside className="article-next shell" aria-labelledby="next-story-title">
          <div>
            <p className="eyebrow">Continue reading</p>
            <h2 id="next-story-title">{nextEntry.title}</h2>
            <p>{nextEntry.excerpt}</p>
          </div>
          <Link className="button" href={`/journal/${nextEntry.slug}`}>Read next story <span aria-hidden="true">↗</span></Link>
        </aside>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
