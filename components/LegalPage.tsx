import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, introduction, updated, sections }: LegalPageProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" />
      <main id="main-content" className="inner-page legal-page">
        <header className="legal-hero shell">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{introduction}</p>
          <p className="legal-updated">Last updated {updated}</p>
        </header>

        <div className="legal-layout shell">
          <aside className="legal-nav" aria-label={`${title} sections`}>
            <p>On this page</p>
            {sections.map((section, index) => (
              <a href={`#${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>
            ))}
          </aside>

          <article className="legal-content">
            <div className="legal-note">
              <p>Questions about this page?</p>
              <a href="mailto:info@easternrisen.com">info@easternrisen.com <span aria-hidden="true">↗</span></a>
            </div>
            {sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                <div>{section.content}</div>
              </section>
            ))}
            <div className="legal-closing">
              <p>Looking for the other policy?</p>
              <div><Link href="/terms-of-service">Terms of service</Link><Link href="/privacy-policy">Privacy policy</Link></div>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
