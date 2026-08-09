import catalog from "@/content-bank/data/tour_catalog.json";

type RawTour = {
  name: string;
  duration: string;
  destination_or_route: string;
  category_pages: string[];
  source_urls: string[];
};

export type Tour = {
  slug: string;
  title: string;
  duration: string;
  durationDays: number | null;
  route: string;
  region: string;
  travelStyle: string;
  summary: string;
  image: string;
  imageAlt: string;
  sourceUrl: string;
  status: "Itinerary available";
};

const imageByRegion: Record<string, string> = {
  Odisha: "/images/odisha-temple.webp",
  "Northeast India": "/images/sikkim-himalaya.webp",
  "North India": "/images/ladakh-trekking.webp",
  "South India": "/images/kerala-backwaters.webp",
  "Central India": "/images/assam-rhino.webp",
  "West India": "/images/gujarat-kutch.webp",
  India: "/images/hero-odisha-dawn-v2.webp",
  Nepal: "/images/nepal-kathmandu.webp",
  Bhutan: "/images/bhutan-monastery.webp",
  "Sri Lanka": "/images/sri-lanka-galle.webp",
  Tibet: "/images/ladakh-trekking.webp",
  "Southeast Asia": "/images/malaysia-penang.webp",
};

const imageByStyle: Record<string, string> = {
  "Wildlife & Nature": "/images/assam-rhino.webp",
  "Textile & Craft": "/images/odisha-weaving.webp",
  "Spiritual Journeys": "/images/bhutan-monastery.webp",
  Adventure: "/images/ladakh-trekking.webp",
  "Culture & Festivals": "/images/sikkim-himalaya.webp",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferRegion(tour: RawTour) {
  const text = `${tour.name} ${tour.destination_or_route} ${tour.category_pages.join(" ")}`.toLowerCase();

  if (text.includes("bhutan")) return "Bhutan";
  if (text.includes("nepal") || text.includes("kathmandu")) return "Nepal";
  if (text.includes("sri lanka") || text.includes("srilanka")) return "Sri Lanka";
  if (text.includes("tibet")) return "Tibet";
  if (text.includes("malaysia") || text.includes("singapore") || text.includes("thiland") || text.includes("thailand")) return "Southeast Asia";
  if (text.includes("odisha") || text.includes("orissa") || text.includes("bhubaneswar") || text.includes("puri") || text.includes("chilika")) return "Odisha";
  if (text.includes("sikkim") || text.includes("gangtok") || text.includes("gangtak") || text.includes("arunachal") || text.includes("northeast") || text.includes("north east") || text.includes("hornbill") || text.includes("guwahati")) return "Northeast India";
  if (text.includes("south india") || text.includes("kerala") || text.includes("cochin")) return "South India";
  if (text.includes("central india") || text.includes("bandhavgarh") || text.includes("kanha")) return "Central India";
  if (text.includes("west india") || text.includes("gujrat") || text.includes("gujarat")) return "West India";
  if (text.includes("north india") || text.includes("delhi") || text.includes("himachal") || text.includes("amarnath") || text.includes("ladakh")) return "North India";
  return "India";
}

function inferTravelStyle(tour: RawTour) {
  const text = `${tour.name} ${tour.category_pages.join(" ")}`.toLowerCase();

  if (text.includes("wild") || text.includes("nature")) return "Wildlife & Nature";
  if (text.includes("textile") || text.includes("craft") || text.includes("art")) return "Textile & Craft";
  if (text.includes("budd") || text.includes("spirt") || text.includes("spiritual") || text.includes("yoga") || text.includes("amarnath")) return "Spiritual Journeys";
  if (text.includes("adventure") || text.includes("trek") || text.includes("bike")) return "Adventure";
  if (text.includes("tribal") || text.includes("festival") || text.includes("hornbill")) return "Culture & Festivals";
  return "Classic Journeys";
}

function parseDurationDays(duration: string) {
  const dayMatch = duration.match(/(\d+)\s*days?/i);
  if (dayMatch) return Number(dayMatch[1]);

  const nightMatch = duration.match(/(\d+)\s*nights?/i);
  if (nightMatch) return Number(nightMatch[1]) + 1;

  return null;
}

function sentenceCase(value: string) {
  return value
    .replace(/[“”]/g, "")
    .toLowerCase()
    .replace(/(^|[\s–-])([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`)
    .replace(/\b(Xv|Xiv|Xiii|Xii|Xi|X|Ix|Viii|Vii|Vi|V|Iv|Iii|Ii|I)\b/g, (numeral) => numeral.toUpperCase())
    .replace(/\s*[-–]\s*(X{0,2}I{1,3}|IV|V|VI{1,3}|IX|X)$/i, (_, numeral: string) => ` ${numeral.toUpperCase()}`)
    .replace(/\bThiland\b/g, "Thailand")
    .replace(/\bGujrat\b/g, "Gujarat")
    .replace(/\bN\.p\b/gi, "N.P.");
}

function createSummary(region: string, style: string, route: string) {
  const opening: Record<string, string> = {
    "Wildlife & Nature": "A nature-led journey through habitats, waterways and landscapes that reward patient observation.",
    "Textile & Craft": "A close encounter with living craft traditions, regional artistry and the people who sustain them.",
    "Spiritual Journeys": "A reflective route through sacred places, enduring traditions and layered histories.",
    Adventure: "An active journey shaped by changing terrain, long horizons and the pleasure of going further.",
    "Culture & Festivals": "A culturally immersive journey approached with context, curiosity and respect.",
    "Classic Journeys": `A considered introduction to ${region}, balancing celebrated landmarks with a slower sense of place.`,
  };

  if (!route) return opening[style];
  const stops = route.split("-").map((stop) => stop.trim()).filter(Boolean).slice(0, 3);
  return `${opening[style]} The route begins with ${stops.join(", ")}.`;
}

const usedSlugs = new Map<string, number>();

const mappedTours: Tour[] = (catalog as RawTour[]).map((rawTour) => {
  const title = sentenceCase(rawTour.name.replace(/\s*\(.*?\)\s*/g, " ").trim());
  const baseSlug = slugify(title) || "journey";
  const occurrence = (usedSlugs.get(baseSlug) ?? 0) + 1;
  usedSlugs.set(baseSlug, occurrence);
  const slug = occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`;
  const region = inferRegion(rawTour);
  const travelStyle = inferTravelStyle(rawTour);
  const image = imageByStyle[travelStyle] ?? imageByRegion[region] ?? "/images/hero-odisha-dawn-v2.webp";

  return {
    slug,
    title,
    duration: rawTour.duration.replace(/\s*Program$/i, "").replace(/\s*\/\s*/g, " / ").trim(),
    durationDays: parseDurationDays(rawTour.duration),
    route: rawTour.destination_or_route,
    region,
    travelStyle,
    summary: createSummary(region, travelStyle, rawTour.destination_or_route),
    image,
    imageAlt: `${travelStyle} journey in ${region}`,
    sourceUrl: rawTour.source_urls[0] ?? "",
    status: "Itinerary available",
  };
});

const featuredTitles = [
  "Odisha Golden Triangle",
  "Eastern Nature Tour",
  "Sikkim Delight",
  "Eastern Textile Tour",
  "North East Wildlife Tour",
  "Bhutan Tour IV",
];

export const tours = [...mappedTours].sort((a, b) => {
  const aIndex = featuredTitles.indexOf(a.title);
  const bIndex = featuredTitles.indexOf(b.title);
  if (aIndex === -1 && bIndex === -1) return 0;
  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});

export const tourRegions = [...new Set(tours.map((tour) => tour.region))].sort();
export const tourStyles = [...new Set(tours.map((tour) => tour.travelStyle))].sort();
