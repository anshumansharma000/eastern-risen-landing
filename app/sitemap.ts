import type { MetadataRoute } from "next";
import { journalEntries } from "@/lib/journal";
import { SITE_URL } from "@/lib/site";
import { tours } from "@/lib/tours";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/destinations",
  "/journal",
  "/photo-credits",
  "/privacy-policy",
  "/services",
  "/terms-of-service",
  "/tours",
  "/travel-styles",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}/`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...tours.map((tour) => ({
      url: `${SITE_URL}/tours/${tour.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...journalEntries.map((entry) => ({
      url: `${SITE_URL}/journal/${entry.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
