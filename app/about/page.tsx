import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import company from "@/content-bank/data/company.json";
import { PlanningCta } from "@/components/PlanningCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet Eastern Risen, a specialist travel company rooted in Odisha and designing thoughtful journeys across India and neighbouring lands.",
};

const principles = [
  { number: "01", title: "Listen first", text: "A journey begins with the traveller: their interests, pace, comfort and reasons for going." },
  { number: "02", title: "Know the ground", text: "Strong routes come from regional knowledge and an understanding of how places connect." },
  { number: "03", title: "Take care", text: "Transport, timing and practical support should work quietly, so travellers can remain present." },
  { number: "04", title: "Travel respectfully", text: "Communities, sacred places and wildlife habitats deserve context, humility and thoughtful behaviour." },
];

export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader variant="light" current="about" />
      <main id="main-content" className="inner-page">
        <section className="about-hero shell" aria-labelledby="about-title">
          <div className="about-hero__content">
            <p className="eyebrow">About Eastern Risen</p>
            <h1 id="about-title">Rooted in Odisha. Curious about the world.</h1>
            <p className="lead">A specialist travel company built around local knowledge, personal planning and the belief that care changes how a journey feels.</p>
          </div>
          <div className="about-hero__image">
            <Image src="/images/hero-odisha-dawn-v2.webp" alt="A river passing through the forested hills of Odisha at dawn" fill unoptimized priority sizes="(max-width: 760px) 100vw, 46vw" />
            <span>Eastern Risen · Bhubaneswar</span>
          </div>
        </section>

        <section className="about-facts shell" aria-label="Eastern Risen at a glance">
          <div><strong>Odisha</strong><span>Our home ground and deepest regional focus</span></div>
          <div><strong>Private & small group</strong><span>Journeys shaped around people, not volume</span></div>
          <div><strong>India & beyond</strong><span>Distinctive routes into neighbouring lands</span></div>
        </section>

        <section className="about-story section shell" aria-labelledby="story-title">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 id="story-title">From travel intermediary to specialist journey house.</h2>
          </div>
          <div className="about-story__copy">
            <p className="lead">Eastern Risen began with a broad understanding of travel: tours, transport, tickets and the practical work required to bring them together.</p>
            <p>That foundation still matters. It means we see an itinerary as more than a sequence of sights. A memorable journey depends on timing, context, good people on the ground and the confidence that someone is paying attention.</p>
            <p>Over time, the company has found its character in specialist travel: Odisha and eastern India, wildlife, culture, craft, spiritual routes and journeys beyond the usual tourist circuits.</p>
          </div>
        </section>

        <section className="founder-story shell" aria-labelledby="founder-title">
          <div className="founder-story__image">
            <Image src="/images/founder-bijan-muduli.jpg" alt="Bijan Kumar Muduli, founder of Eastern Risen" fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 840px) 100vw, 48vw" />
            <span>Bijan Kumar Muduli · Founder</span>
          </div>
          <div className="founder-story__content">
            <p className="eyebrow eyebrow--warm">The founder</p>
            <h2 id="founder-title">{company.founder}</h2>
            <p className="lead">Eastern Risen grew from a founder-led belief that travel should be personal, ethically conducted and attentive to the traveller throughout.</p>
            <p>The company’s original profile describes Bijan’s experience accompanying individual and group journeys across different regions and countries. That first-hand perspective continues to inform a practical, hands-on approach: understand the concern, stay close to the details and treat every journey as a responsibility.</p>
            <Link className="text-link text-link--light text-link--large" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="about-principles section shell" aria-labelledby="principles-title">
          <div className="about-principles__heading">
            <div><p className="eyebrow">How we work</p><h2 id="principles-title">Personal care, made practical.</h2></div>
            <p>These are not decorative values. They influence the route, the pace, the people involved and how decisions are made along the way.</p>
          </div>
          <div className="about-principles__grid">
            {principles.map((principle) => (
              <article key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>
            ))}
          </div>
        </section>

        <section className="about-odisha shell" aria-labelledby="about-odisha-title">
          <div className="about-odisha__content">
            <p className="eyebrow">A local point of view</p>
            <h2 id="about-odisha-title">Odisha is our signature, not our limit.</h2>
            <p className="lead">Knowing one place deeply teaches you how to enter every other place with patience, context and respect.</p>
            <p>Our roots in Bhubaneswar give Eastern Risen a distinctive perspective: close knowledge of Odisha’s temple towns, coast, forests, craft traditions and communities, alongside the experience to carry that same care across India and beyond.</p>
            <Link className="button" href="/destinations#odisha">Discover Odisha</Link>
          </div>
          <div className="about-odisha__image">
            <Image src="/images/odisha-weaving.webp" alt="An Odisha artisan working at a traditional handloom" fill unoptimized loading="lazy" decoding="async" sizes="(max-width: 840px) 100vw, 46vw" />
          </div>
        </section>

        <section className="about-responsibility shell" aria-labelledby="responsibility-title">
          <div><p className="eyebrow eyebrow--warm">Travel as a guest</p><h2 id="responsibility-title">Respect belongs in the itinerary.</h2></div>
          <div>
            <p className="lead">The way we visit matters as much as where we go.</p>
            <p>Eastern Risen’s legacy story includes a belief in sharing tourism’s benefit with communities around destinations. The redesigned company approach carries that idea forward through respectful representation, locally informed planning and care around cultural, spiritual and wildlife encounters.</p>
            <p>As these practices are formalized, we will communicate them clearly and avoid claims that cannot be demonstrated.</p>
          </div>
        </section>

        <section className="about-capabilities section shell" aria-labelledby="capabilities-title">
          <div className="about-capabilities__heading">
            <div><p className="eyebrow">More than an itinerary</p><h2 id="capabilities-title">A journey house with practical depth.</h2></div>
            <p>Tour design remains at the centre, supported by the operational experience needed to make a complex route feel coherent.</p>
          </div>
          <div className="about-capabilities__links">
            <Link href="/tours"><span>01</span><strong>Explore journeys</strong><i aria-hidden="true">↗</i></Link>
            <Link href="/services"><span>02</span><strong>Travel services</strong><i aria-hidden="true">↗</i></Link>
            <Link href="/contact"><span>03</span><strong>Contact Eastern Risen</strong><i aria-hidden="true">↗</i></Link>
          </div>
        </section>

        <PlanningCta />
      </main>
      <SiteFooter />
    </>
  );
}
