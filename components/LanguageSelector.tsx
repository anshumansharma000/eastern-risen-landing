"use client";

import { useState } from "react";

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

export function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  function translatePage(language: string) {
    if (language === "en") return;

    setIsRedirecting(true);
    const translateUrl = new URL("https://translate.google.com/translate");
    translateUrl.searchParams.set("sl", "en");
    translateUrl.searchParams.set("tl", language);
    translateUrl.searchParams.set("u", window.location.href);
    window.location.assign(translateUrl.toString());
  }

  return (
    <label className={`language-selector${mobile ? " language-selector--mobile" : ""}`}>
      <span className="language-selector__icon" aria-hidden="true">◎</span>
      <span className="sr-only">Translate this page</span>
      <select
        aria-label="Translate this page with Google"
        defaultValue="en"
        disabled={isRedirecting}
        onChange={(event) => translatePage(event.target.value)}
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
