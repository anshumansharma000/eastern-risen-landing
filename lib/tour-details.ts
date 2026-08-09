import pages from "@/content-bank/data/pages.json";
import { tours, type Tour } from "@/lib/tours";

type RawPage = {
  source_url: string;
  heading: string;
  main_content: string;
  duration: string;
  destination_or_route: string;
  day_headings: string[];
};

export type ItineraryDay = {
  day: string;
  title: string;
  description: string;
};

export type TourDetail = Tour & {
  itinerary: ItineraryDay[];
  routeStops: string[];
  startingPoint: string;
  endingPoint: string;
  relatedTours: Tour[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/program/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function pageDuration(page: RawPage) {
  return page.duration || page.main_content.match(/(?:Tour )?Duration\s*:\s*([^\n]+)/i)?.[1] || "";
}

function cleanLegacyCopy(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\bOver night\b/gi, "Overnight")
    .replace(/\bafter noon\b/gi, "afternoon")
    .replace(/\bbrakish\b/gi, "brackish")
    .replace(/\bIrrawady\b/gi, "Irrawaddy")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

function findItineraryPage(tour: Tour) {
  const itineraryPages = (pages as RawPage[]).filter((page) => page.day_headings?.length > 0);
  const exactSource = itineraryPages.find((page) => page.source_url.toLowerCase() === tour.sourceUrl.toLowerCase());
  if (exactSource) return exactSource;

  return itineraryPages.find((page) => (
    normalize(pageDuration(page)) === normalize(tour.duration)
    && normalize(page.destination_or_route) === normalize(tour.route)
  ));
}

function parseDayHeading(heading: string, index: number) {
  const withoutDay = heading.replace(/^DAY\s*[-–]?\s*\d+\s*[:.-]?\s*/i, "").trim();
  return {
    day: `Day ${index + 1}`,
    title: cleanLegacyCopy(withoutDay || "On the journey"),
  };
}

function parseItinerary(page: RawPage | undefined) {
  if (!page) return [];

  return page.day_headings.map((heading, index) => {
    const start = page.main_content.indexOf(heading);
    const nextHeading = page.day_headings[index + 1];
    const end = nextHeading ? page.main_content.indexOf(nextHeading, start + heading.length) : page.main_content.length;
    const description = start >= 0 ? page.main_content.slice(start + heading.length, end) : "";

    return {
      ...parseDayHeading(heading, index),
      description: cleanLegacyCopy(description),
    };
  }).filter((day) => day.description);
}

function getRouteStops(route: string, title: string) {
  const withoutVariant = (value: string) => value.replace(/\s*[-–]\s*[IVX]+\s*$/i, "");
  if (normalize(withoutVariant(route)) === normalize(withoutVariant(title))) return [];

  return route
    .split(/\s*[-–]\s*/)
    .map((stop) => cleanLegacyCopy(stop))
    .filter(Boolean);
}

export function getTourDetail(slug: string): TourDetail | undefined {
  const tour = tours.find((item) => item.slug === slug);
  if (!tour) return undefined;

  const routeStops = getRouteStops(tour.route, tour.title);
  const itinerary = parseItinerary(findItineraryPage(tour));
  const relatedTours = tours
    .filter((item) => item.slug !== tour.slug && (item.region === tour.region || item.travelStyle === tour.travelStyle))
    .sort((a, b) => Number(b.region === tour.region) - Number(a.region === tour.region))
    .slice(0, 3);

  return {
    ...tour,
    itinerary,
    routeStops,
    startingPoint: routeStops[0] || "Confirmed during planning",
    endingPoint: routeStops.at(-1) || "Confirmed during planning",
    relatedTours,
  };
}
