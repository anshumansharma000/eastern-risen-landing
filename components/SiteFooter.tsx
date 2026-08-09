import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer__top">
        <div>
          <Link className="wordmark wordmark--footer notranslate" href="/" translate="no">
            <Image className="wordmark__logo wordmark__logo--footer" src="/images/eastern-risen-logo.png" alt="Eastern Risen" width={922} height={271} unoptimized loading="lazy" sizes="220px" />
          </Link>
          <p>Specialist journeys rooted in Odisha, reaching across India and its neighbouring lands.</p>
        </div>
        <div className="footer__links">
          <div><strong>Explore</strong><Link href="/tours">Journeys</Link><Link href="/destinations">Destinations</Link><Link href="/travel-styles">Travel styles</Link><Link href="/services">Travel services</Link></div>
          <div><strong>Eastern Risen</strong><Link href="/about">Our approach</Link><Link href="/journal">Field notes</Link><Link href="/photo-credits">Photo credits</Link><Link href="/contact">Contact us</Link></div>
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© {new Date().getFullYear()} Eastern Risen Expedition Pvt. Ltd.</span>
        <span>Bhubaneswar · Odisha · India</span>
      </div>
    </footer>
  );
}
