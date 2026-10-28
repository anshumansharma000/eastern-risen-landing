import { TourEnquiryModal } from "./TourEnquiryModal";

export function PlanningCta() {
  return (
    <section className="planning section" id="plan" aria-labelledby="planning-title">
      <div className="shell planning__inner">
        <p className="eyebrow eyebrow--warm">Your journey, thoughtfully made</p>
        <h2 id="planning-title">Where would you like to go next?</h2>
        <p>Tell us what has caught your imagination. We’ll help turn it into a route that feels entirely your own.</p>
        <TourEnquiryModal general />
        <small>Share your plans and our team will get in touch.</small>
      </div>
    </section>
  );
}
