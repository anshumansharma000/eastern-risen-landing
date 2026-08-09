import Link from "next/link";

export function PlanningCta() {
  return (
    <section className="planning section" id="plan" aria-labelledby="planning-title">
      <div className="shell planning__inner">
        <p className="eyebrow eyebrow--warm">Your journey, thoughtfully made</p>
        <h2 id="planning-title">Where would you like to go next?</h2>
        <p>Tell us what has caught your imagination. We’ll help turn it into a route that feels entirely your own.</p>
        <Link className="button button--light" href="/contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
        <small>The full journey-planning form will arrive with our connected backend.</small>
      </div>
    </section>
  );
}
