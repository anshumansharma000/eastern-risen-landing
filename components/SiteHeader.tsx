import Image from "next/image";
import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";

type SiteHeaderProps = {
  variant?: "overlay" | "light";
  current?: "tours" | "destinations" | "styles" | "services" | "about" | "journal" | "contact";
};

const links = [
  { key: "tours", label: "Journeys", href: "/tours" },
  { key: "destinations", label: "Destinations", href: "/destinations" },
  { key: "styles", label: "Travel styles", href: "/travel-styles" },
  { key: "services", label: "Services", href: "/services" },
  { key: "about", label: "Our approach", href: "/about" },
  { key: "journal", label: "Journal", href: "/journal" },
] as const;

export function SiteHeader({ variant = "overlay", current }: SiteHeaderProps) {
  return (
    <header className={`site-header site-header--${variant}`}>
      <div className="shell header-inner">
        <Link className="wordmark notranslate" href="/" aria-label="Eastern Risen home" translate="no">
          <Image className="wordmark__logo" src="/images/eastern-risen-logo.png" alt="Eastern Risen" width={922} height={271} unoptimized priority sizes="(max-width: 720px) 160px, 190px" />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.key} href={link.href} aria-current={current === link.key ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSelector />
          <Link className="button button--header" href="/contact" aria-current={current === "contact" ? "page" : undefined}>Contact us</Link>
        </div>

        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span className="menu-lines" aria-hidden="true" /></summary>
          <div className="mobile-nav__panel">
            {links.map((link) => <Link key={link.key} href={link.href}>{link.label}</Link>)}
            <LanguageSelector mobile />
            <Link className="button" href="/contact">Contact us</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
