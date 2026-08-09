import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer__top">
        <div>
          <Link className="wordmark wordmark--footer notranslate" href="/" translate="no">
            <span className="wordmark__name">Eastern Risen</span>
            <span className="wordmark__place">Make your own travel</span>
          </Link>
          <p>Specialist journeys rooted in Odisha, reaching across India and its neighbouring lands.</p>
        </div>
        <div className="footer__links">
          <div><strong>Explore</strong><Link href="/tours">Journeys</Link><Link href="/destinations">Destinations</Link><Link href="/travel-styles">Travel styles</Link><Link href="/services">Travel services</Link></div>
          <div><strong>Eastern Risen</strong><Link href="/about">Our approach</Link><Link href="/journal">Field notes</Link><Link href="/contact">Contact us</Link></div>
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© {new Date().getFullYear()} Eastern Risen Expedition Pvt. Ltd.</span>
        <span>Bhubaneswar · Odisha · India</span>
      </div>
    </footer>
  );
}
