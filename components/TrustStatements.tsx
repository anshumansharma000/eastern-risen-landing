const recognitions = [
  {
    number: "01",
    title: "Recognised nationally",
    text: "Recognised by the Ministry of Tourism, Government of India",
  },
  {
    number: "02",
    title: "Accredited in Odisha",
    text: "Accredited by Odisha Tourism, Government of Odisha",
  },
  {
    number: "03",
    title: "Trusted with specialist access",
    text: "Authorised to operate in PVTG areas",
  },
] as const;

const memberships = ["IATO", "ADTOI", "ATOAI", "ITTA", "TOFTigers"] as const;

export function HomeTrustStatements() {
  return (
    <aside
      className="principles-proof"
      aria-label="Eastern Risen recognition and memberships"
    >
      <div className="principles-proof__identity">
        <p className="principles-proof__label">Recognised expertise</p>
        <strong aria-hidden="true">Trust</strong>
        <span>that is backed by credentials</span>
      </div>
      <div className="principles-proof__body">
        <div className="principles-proof__statements">
          {recognitions.map((recognition) => (
            <p key={recognition.number}>
              <span>{recognition.number}</span>
              {recognition.text}
            </p>
          ))}
        </div>
        <p className="principles-proof__memberships">
          <span>Active member of</span> {memberships.join(" · ")}
        </p>
      </div>
    </aside>
  );
}

export function TourTrustStatement() {
  return (
    <div
      className="tour-trust"
      aria-label="Eastern Risen government recognition"
    >
      <span aria-hidden="true">✓</span>
      <p>
        <strong>Ministry of Tourism recognised</strong>
        <small>Government of India</small>
      </p>
    </div>
  );
}

export function AboutTrustStatements() {
  return (
    <section className="about-trust shell" aria-labelledby="about-trust-title">
      <div className="about-trust__heading">
        <div>
          <p className="eyebrow">Recognition & memberships</p>
          <h2 id="about-trust-title">Recognition you can travel with.</h2>
        </div>
        <p>
          Government recognition, Odisha accreditation and specialist
          authorisation support the thoughtful, well-informed way we plan each
          journey.
        </p>
      </div>
      <div className="about-trust__grid">
        {recognitions.map((recognition) => (
          <article key={recognition.number}>
            <span>{recognition.number}</span>
            <h3>{recognition.title}</h3>
            <p>{recognition.text}</p>
          </article>
        ))}
      </div>
      <div className="about-trust__memberships">
        <div>
          <p className="eyebrow eyebrow--warm">Active industry participation</p>
          <h3>Member of national travel bodies</h3>
        </div>
        <ul aria-label="Travel body memberships">
          {memberships.map((membership) => (
            <li key={membership}>{membership}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
