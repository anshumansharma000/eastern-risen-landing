import type { Metadata } from "next";
import Link from "next/link";
import company from "@/content-bank/data/company.json";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactActions } from "./ContactActions";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Start planning a journey or speak with Eastern Risen in Bhubaneswar, Odisha.",
  alternates: { canonical: "/contact/" },
};

const primaryEmail = company.emails[0];

export default function ContactPage() {
  const subject = encodeURIComponent("Planning a journey with Eastern Risen");
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="contact" />
      <main id="main-content" className="inner-page">
        <section className="contact-hero shell" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">Start a conversation</p>
            <h1 id="contact-title">Tell us where your curiosity is leading.</h1>
          </div>
          <div className="contact-hero__copy">
            <p className="lead">You do not need a finished itinerary to get in touch.</p>
            <p>Share a place, an interest or simply the kind of journey you have in mind. We can help turn it into a route and identify the practical support it needs.</p>
          </div>
        </section>

        <ContactActions primaryEmail={primaryEmail} />

        <section className="contact-prep section shell" aria-labelledby="contact-prep-title">
          <div className="contact-prep__heading">
            <div><p className="eyebrow">A useful place to begin</p><h2 id="contact-prep-title">What to share with us.</h2></div>
            <p>Even approximate answers are useful. Every detail can be refined together later.</p>
          </div>
          <div className="contact-prep__grid">
            <article><span>01</span><h3>Where</h3><p>A destination, region or landscape that has caught your imagination.</p></article>
            <article><span>02</span><h3>When</h3><p>Your likely travel window and how much time you hope to spend away.</p></article>
            <article><span>03</span><h3>Who</h3><p>Whether you are travelling privately, as a family or with a small group.</p></article>
            <article><span>04</span><h3>Why</h3><p>The interests, pace and experiences that would make the journey meaningful.</p></article>
          </div>
        </section>

        <section className="contact-offices shell" aria-labelledby="offices-title">
          <div className="contact-offices__intro">
            <p className="eyebrow">Where to find us</p>
            <h2 id="offices-title">Rooted in eastern India.</h2>
            <p>Eastern Risen’s head office is in Bhubaneswar, with an additional office in Guwahati and published channel-office presence across major Indian cities.</p>
          </div>
          <div className="contact-office-grid">
            <article>
              <p>Head office</p><h3>Bhubaneswar</h3>
              <address>{company.head_office.address_lines.map((line) => <span key={line}>{line}</span>)}</address>
              <a className="text-link" href={`mailto:${primaryEmail}?subject=${subject}`}>Contact head office <span aria-hidden="true">↗</span></a>
            </article>
            <article>
              <p>Regional office</p><h3>Guwahati</h3>
              <address>{company.guwahati_office.address_lines.map((line) => <span key={line}>{line}</span>)}</address>
              <a className="text-link" href="mailto:bijan@easternrisen.com?subject=Eastern%20Risen%20Guwahati%20office">Contact Guwahati <span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <div className="channel-offices"><span>Channel-office network</span><p>{company.channel_offices.join(" · ")}</p></div>
        </section>

        <section className="contact-explore shell">
          <p>Still exploring?</p>
          <h2>Begin with the journeys, then come back when something stays with you.</h2>
          <div><Link className="button" href="/tours">Explore journeys</Link><Link className="button button--outline" href="/services">View travel services</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
