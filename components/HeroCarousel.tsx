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
    src: "/images/odisha-temple.webp",
    alt: "The carved stone towers of an Odisha temple in warm evening light",
    position: "center center",
  },
  {
    src: "/images/odisha-weaving.webp",
    alt: "An Odisha artisan weaving a traditional textile by hand",
    position: "center center",
  },
  {
    src: "/images/tours/tour-016-coast-odisha.webp",
    alt: "Sunset reflected across the calm waters of coastal Odisha",
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
