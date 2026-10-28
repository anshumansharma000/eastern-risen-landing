"use client";

import { useSyncExternalStore } from "react";
import { ContactForm } from "@/components/ContactForm";

const subscribeToLocation = () => () => {};
const getLocationSearch = () => window.location.search;
const getServerSearch = () => "";

export function ContactActions({ primaryEmail }: { primaryEmail: string }) {
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerSearch);
  const service = new URLSearchParams(search).get("service") ?? "";

  const subject = encodeURIComponent(
    service ? `Enquiry about ${service}` : "Planning a journey with Eastern Risen",
  );

  return (
    <>
      <ContactForm service={service} />
      {service ? <p className="contact-context">Enquiring about <strong>{service}</strong></p> : null}
      <section className="contact-actions shell" aria-label="Contact Eastern Risen">
        <article className="contact-action contact-action--primary">
          <p className="eyebrow eyebrow--warm">Email us</p>
          <h2>Write when it suits you.</h2>
          <p>Include your preferred destinations, approximate dates, group size and anything that matters to how you travel.</p>
          <a className="button button--light" href={`mailto:${primaryEmail}?subject=${subject}`}>{primaryEmail} <span aria-hidden="true">↗</span></a>
        </article>
        <article className="contact-action">
          <p className="eyebrow">Call us</p>
          <h2>Prefer to talk?</h2>
          <p>Speak with the Eastern Risen team in India about a journey or travel service.</p>
          <div className="contact-phone-list">
            <a href="tel:+919777564596">+91 97775 64596</a>
            <a href="tel:+919777564695">+91 97775 64695</a>
          </div>
        </article>
      </section>
    </>
  );
}
