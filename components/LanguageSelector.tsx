"use client";

import { useState, useSyncExternalStore } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "th", label: "ไทย" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

const productionOrigin = "https://easternrisen.co.in";
const subscribeToLocation = () => () => {};
const getLocationHref = () => window.location.href;
const getServerHref = () => productionOrigin;

function isLanguageCode(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function getActiveLanguage(href: string): LanguageCode {
  const url = new URL(href);
  const targetLanguage = url.hostname === "translate.google.com"
    ? url.searchParams.get("tl")
    : url.hostname.endsWith(".translate.goog") || url.searchParams.has("_x_tr_tl")
      ? url.searchParams.get("_x_tr_tl")
      : null;

  return isLanguageCode(targetLanguage) ? targetLanguage : "en";
}

export function getOriginalPageUrl(href: string): URL {
  const currentUrl = new URL(href);

  if (currentUrl.hostname === "translate.google.com") {
    const sourceUrl = currentUrl.searchParams.get("u");
    if (sourceUrl) return new URL(sourceUrl);
  }

  if (currentUrl.hostname.endsWith(".translate.goog") || currentUrl.searchParams.has("_x_tr_tl")) {
    const originalOrigin = currentUrl.hostname.endsWith(".translate.goog")
      ? productionOrigin
      : currentUrl.origin;
    const originalUrl = new URL(
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
      originalOrigin,
    );
    for (const key of [...originalUrl.searchParams.keys()]) {
      if (key.startsWith("_x_tr_")) originalUrl.searchParams.delete(key);
    }
    return originalUrl;
  }

  return currentUrl;
}

export function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<LanguageCode | null>(null);
  const locationHref = useSyncExternalStore(subscribeToLocation, getLocationHref, getServerHref);
  const selectedLanguage = pendingLanguage ?? getActiveLanguage(locationHref);

  function translatePage(language: LanguageCode) {
    const originalPageUrl = getOriginalPageUrl(window.location.href);

    if (language === selectedLanguage) return;

    setPendingLanguage(language);
    setIsRedirecting(true);

    if (language === "en") {
      window.location.assign(originalPageUrl.toString());
      return;
    }

    const translateUrl = new URL("https://translate.google.com/translate");
    translateUrl.searchParams.set("sl", "en");
    translateUrl.searchParams.set("tl", language);
    translateUrl.searchParams.set("u", originalPageUrl.toString());
    window.location.assign(translateUrl.toString());
  }

  return (
    <label className={`language-selector notranslate${mobile ? " language-selector--mobile" : ""}`} translate="no">
      <span className="language-selector__icon" aria-hidden="true">◎</span>
      <span className="sr-only">Translate this page</span>
      <select
        aria-label="Translate this page with Google"
        value={selectedLanguage}
        disabled={isRedirecting}
        onChange={(event) => translatePage(event.target.value as LanguageCode)}
        title="Automatic translation by Google"
      >
        {languages.map((language) => (
          <option value={language.code} key={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
