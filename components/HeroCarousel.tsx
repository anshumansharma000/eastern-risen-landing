"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/hero-odisha-dawn-v2.webp",
    alt: "A quiet river winding through forested hills in Odisha at dawn",
    position: "center 54%",
  },
  {
    src: "/images/hero-jagannath-temple.webp",
    alt: "Jagannath Temple in Puri during the 2022 Snana Jatra festival",
    position: "center center",
  },
  {
    src: "/images/hero-konark-wheel.webp",
    alt: "An intricately carved stone wheel at the Konark Sun Temple in Odisha",
    position: "center center",
  },
  {
    src: "/images/hero-chilika-lake.webp",
    alt: "Boats crossing the broad blue waters of Chilika Lake in Odisha",
    position: "center center",
  },
  {
    src: "/images/hero-odissi-dance.webp",
    alt: "An Odissi dancer performing in traditional costume and jewellery",
    position: "center center",
  },
  {
    src: "/images/hero-pattachitra-artist.webp",
    alt: "A Pattachitra artist painting a traditional artwork in Odisha",
    position: "center center",
  },
] as const;

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (isPaused || prefersReducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="hero-carousel" role="region" aria-label="Scenes from Odisha">
      <div className="hero-carousel__slides">
        {slides.map((slide, index) => (
          <Image
            className={`hero-carousel__image${index === activeSlide ? " is-active" : ""}`}
            src={slide.src}
            alt={slide.alt}
            fill
            unoptimized
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            style={{ objectPosition: slide.position }}
            aria-hidden={index !== activeSlide}
            key={slide.src}
          />
        ))}
      </div>
      <div className="hero-carousel__controls">
        <div className="hero-carousel__dots" aria-label="Choose a hero image">
          {slides.map((slide, index) => (
            <button
              className={index === activeSlide ? "is-active" : ""}
              type="button"
              aria-label={`Show image ${index + 1}: ${slide.alt}`}
              aria-current={index === activeSlide ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
              key={slide.src}
            />
          ))}
        </div>
        <button
          className="hero-carousel__pause"
          type="button"
          aria-label={isPaused ? "Resume image carousel" : "Pause image carousel"}
          onClick={() => setIsPaused((current) => !current)}
        >
          <span aria-hidden="true">{isPaused ? "Play" : "Pause"}</span>
        </button>
      </div>
    </div>
  );
}
