"use client";

import Image from "next/image";
import { AnnouncementRibbon } from "./AnnouncementRibbon";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SiteHeaderProps = {
  variant?: "overlay" | "light";
  current?: "tours" | "destinations" | "styles" | "services" | "about" | "journal" | "contact";
};

const links = [
  { key: "tours", label: "Tours", href: "/tours" },
  { key: "destinations", label: "Destinations", href: "/destinations" },
  { key: "styles", label: "Travel styles", href: "/travel-styles" },
  { key: "services", label: "Services", href: "/services" },
  { key: "about", label: "About us", href: "/about" },
] as const;

export function SiteHeader({ variant = "overlay", current }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [ribbonHeight, setRibbonHeight] = useState(0);
  const [ribbonOffset, setRibbonOffset] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const useDarkTheme = variant === "light" || pastHero;
  const logoSrc = useDarkTheme ? "/images/eastern-risen-logo-dark.png" : "/images/eastern-risen-logo.png";

  useEffect(() => {
    document.documentElement.style.setProperty("--announcement-height", `${ribbonHeight}px`);
    const update = () => setRibbonOffset(Math.max(0, ribbonHeight - window.scrollY));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); document.documentElement.style.removeProperty("--announcement-height"); };
  }, [ribbonHeight]);

  useEffect(() => {
    let active = true;
    // A full page navigation ensures marketing analytics never follows account URLs.
    import('@/lib/account/api').then(({ CustomerClient }) => new CustomerClient().me()).then(() => { if (active) setSignedIn(true); }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (variant !== "overlay") return;

    const hero = document.querySelector<HTMLElement>(".hero");
    const header = headerRef.current;
    if (!hero || !header) return;

    let animationFrame = 0;
    const updateTheme = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setPastHero(hero.getBoundingClientRect().bottom <= header.offsetHeight);
      });
    };

    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, [variant]);

  return (
    <>
    <AnnouncementRibbon onHeight={setRibbonHeight} />
    {variant === "light" && ribbonHeight > 0 && <div style={{ height: ribbonHeight }} aria-hidden="true" />}
    <header style={{ top: ribbonOffset }} ref={headerRef} className={`site-header site-header--${variant}${pastHero ? " site-header--scrolled" : ""}`}>
      <div className="shell header-inner">
        <Link className="wordmark notranslate" href="/" aria-label="Eastern Risen home" translate="no">
          <Image className="wordmark__logo" src={logoSrc} alt="Eastern Risen" width={922} height={271} unoptimized priority sizes="(max-width: 720px) 160px, 190px" />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.key} href={link.href} aria-current={current === link.key ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-account-link" href={signedIn ? "/account/bookings/" : "/account/login/"}>{signedIn ? "My account" : "Sign in"}</a>
          <Link className="button button--header" href="/contact" aria-current={current === "contact" ? "page" : undefined}>Contact us</Link>
        </div>

        <details className="mobile-nav">
          <summary aria-label="Open navigation"><span className="menu-lines" aria-hidden="true" /></summary>
          <div className="mobile-nav__panel">
            {links.map((link) => <Link key={link.key} href={link.href}>{link.label}</Link>)}
            <a href={signedIn ? "/account/bookings/" : "/account/login/"}>{signedIn ? "My account" : "Sign in"}</a>
            <Link className="button" href="/contact">Contact us</Link>
          </div>
        </details>
      </div>
    </header>
    </>
  );
}
