import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { serviceDefinitions } from "@/lib/services";

export const metadata: Metadata = {
  title: "Travel Services",
  description: "Journey planning, ground transport, flight coordination and travel documentation guidance from Eastern Risen.",
};

export default function ServicesPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="services" />
      <main id="main-content" className="inner-page">
        <section className="services-hero shell" aria-labelledby="services-title">
          <div>
            <p className="eyebrow">Travel, joined up</p>
            <h1 id="services-title">The practical side of a remarkable journey.</h1>
          </div>
          <div className="services-hero__copy">
            <p className="lead">Good travel depends on the details working quietly in the background.</p>
            <p>Eastern Risen began as a full-service travel intermediary. Today, that experience supports the complete journey—from route design and road transport to flights and destination-specific documentation.</p>
          </div>
        </section>

        <nav className="service-nav shell" aria-label="Explore travel services">
          {serviceDefinitions.map((service) => <a href={`#${service.id}`} key={service.id}><span>{service.number}</span>{service.name}</a>)}
        </nav>

        <div className="service-chapters shell">
          {serviceDefinitions.map((service) => (
            <section className="service-chapter" id={service.id} key={service.id} aria-labelledby={`${service.id}-title`}>
              <div className="service-chapter__image">
                <Image src={service.image} alt={service.imageAlt} fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 840px) 100vw, 46vw" />
                <span>{service.number}</span>
              </div>
              <div className="service-chapter__content">
                <p className="eyebrow">Our services</p>
                <h2 id={`${service.id}-title`}>{service.name}</h2>
                <p className="lead">{service.shortDescription}</p>
                <p>{service.description}</p>
                <ul>
                  {service.includes.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}
                </ul>
                <Link className="text-link text-link--large" href={`/contact?service=${encodeURIComponent(service.name)}`}>Ask about this service <span aria-hidden="true">↗</span></Link>
              </div>
            </section>
          ))}
        </div>

        <section className="service-process shell" aria-labelledby="service-process-title">
          <div><p className="eyebrow eyebrow--warm">One conversation, one plan</p><h2 id="service-process-title">How we bring it together.</h2></div>
          <div className="service-process__steps">
            <article><span>01</span><h3>Understand</h3><p>We begin with your route, dates, group and the kind of support you need.</p></article>
            <article><span>02</span><h3>Coordinate</h3><p>The moving parts are considered together, so transfers, flights and touring make sense as one journey.</p></article>
            <article><span>03</span><h3>Confirm</h3><p>You receive clear arrangements and practical next steps before the journey begins.</p></article>
          </div>
          <Link className="button button--light" href="/contact">Talk through your plans <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
