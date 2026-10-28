import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import tourImages from "../content-bank/data/tour_images.json" with { type: "json" };

const SITE_URL = "https://easternrisen.co.in";

async function render(path = "/") {
  const pathname = new URL(path, SITE_URL).pathname;
  const relativeFile = pathname === "/" ? "index.html" : `${pathname.replace(/^\/|\/$/g, "")}/index.html`;
  const html = await fs.promises.readFile(new URL(`../out/${relativeFile}`, import.meta.url), "utf8");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

test("exports the Eastern Risen landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Eastern Risen \| Journeys that bring you closer<\/title>/i);
  assert.match(html, /Journeys that bring you closer\./);
  assert.match(html, /Odisha Golden Triangle/);
  assert.match(html, /Where would you like to go next\?/);
  assert.match(html, /Active member of/i);
  assert.match(html, /Commitment to sustainable tourism/i);
  assert.match(html, /commitment-to-sustainable-tourism\.pdf/i);
  assert.match(html, /Recognised by the Ministry of Tourism, Government of India/i);
  assert.match(html, /src="\/images\/hero-odisha-dawn-v2\.webp"/);
  assert.match(html, /src="\/images\/hero-jagannath-temple\.webp"/);
  assert.match(html, /src="\/images\/hero-konark-wheel\.webp"/);
  assert.match(html, /src="\/images\/hero-chilika-lake\.webp"/);
  assert.match(html, /src="\/images\/hero-odissi-dance\.webp"/);
  assert.match(html, /src="\/images\/hero-pattachitra-artist\.webp"/);
  assert.match(html, /src="\/images\/odisha-temple\.webp"/);
  assert.match(html, /Scenes from Odisha/i);
  assert.match(html, /Pause image carousel/i);
  assert.match(html, /src="\/images\/eastern-risen-logo\.png"/);
  assert.match(html, /490,302(?:<!-- -->)? site visits and counting/i);
  assert.doesNotMatch(html, /<script[^>]*goatcounter/i);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /\/_vinext\/image\?/);
  assert.doesNotMatch(html, /react-loading-skeleton|Server Action/i);
});

test("publishes canonical URLs on the production domain", async () => {
  const pages = [
    ["/", "/"],
    ["/about", "/about/"],
    ["/contact", "/contact/"],
    ["/destinations", "/destinations/"],
    ["/journal", "/journal/"],
    ["/journal/odisha-coast", "/journal/odisha-coast/"],
    ["/services", "/services/"],
    ["/tours", "/tours/"],
    ["/tours/odisha-golden-triangle", "/tours/odisha-golden-triangle/"],
    ["/travel-styles", "/travel-styles/"],
  ];

  for (const [path, canonicalPath] of pages) {
    const html = await (await render(path)).text();
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="${SITE_URL}${canonicalPath}"\\s*\\/?\u003e`, "i"),
      `${path} should have a self-referencing canonical URL`,
    );
  }
});

test("exports an indexable robots file and a complete sitemap", async () => {
  const robots = await fs.promises.readFile(new URL("../out/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, new RegExp(`Sitemap:\\s*${SITE_URL}/sitemap\\.xml`, "i"));

  const sitemap = await fs.promises.readFile(new URL("../out/sitemap.xml", import.meta.url), "utf8");
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locations.length > 11 + tourImages.length);
  assert.ok(locations.every((url) => url.startsWith(`${SITE_URL}/`)));
  assert.ok(locations.includes(`${SITE_URL}/`));
  assert.ok(locations.includes(`${SITE_URL}/tours/odisha-golden-triangle/`));
  assert.ok(locations.includes(`${SITE_URL}/journal/odisha-coast/`));
});

test("server-renders the data-backed tour collection", async () => {
  const response = await render("/tours");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Journeys \| Eastern Risen<\/title>/i);
  assert.match(html, /src="\/images\/eastern-risen-logo-dark\.png"/);
  assert.match(html, /82/);
  assert.match(html, /Odisha Golden Triangle/i);
  assert.match(html, /Filter &amp; refine/i);
  assert.match(html, /Northeast India &amp; Sikkim/i);
  assert.match(html, /Nepal &amp; Bhutan/i);
  assert.match(html, /Special Interest &amp; Across India/i);
  assert.match(html, /Season and activity filters will be added/i);
  assert.doesNotMatch(html, /Book now|Server Action/i);
});

test("assigns one image to every curated tour", () => {
  assert.equal(tourImages.length, 82);
  assert.equal(new Set(tourImages.map((entry) => entry.image)).size, 82);
  for (const entry of tourImages) {
    assert.match(entry.image, /^\/images\/tours\/.+\.(?:webp|jpg)$/);
    assert.ok(fs.existsSync(new URL(`../public${entry.image}`, import.meta.url)));
  }
});

test("renders corrected and newly curated journeys", async () => {
  const response = await render("/tours");
  const html = await response.text();
  assert.match(html, /Yoga And Meditation Tour/i);
  assert.match(html, /Amarnath Yatra Via Pahalgam/i);
  assert.match(html, /Amarnath Express Yatra By Helicopter/i);
  assert.doesNotMatch(html, /Amarnath Yatra Start From|2013/i);
  assert.doesNotMatch(html, /\b\d+ night\s*\/|\/\s*\d+ day\b/i);
});

test("server-renders the photo credits", async () => {
  const response = await render("/photo-credits");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Photo credits \| Eastern Risen<\/title>/i);
  assert.match(html, /Image provenance/i);
  assert.match(html, /View source/i);
  assert.match(html, /Original generated asset created for Eastern Risen/i);
});

test("server-renders a complete tour detail page", async () => {
  const response = await render("/tours/odisha-golden-triangle");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Odisha Golden Triangle \| Eastern Risen<\/title>/i);
  assert.match(html, /A route to make your own/i);
  assert.match(html, /Day 1/i);
  assert.match(html, /Arrival Bhubaneswar/i);
  assert.match(html, /Related journeys/i);
  assert.match(html, /Make this yours/i);
  assert.match(html, /personalised plan and quote/i);
  assert.match(html, /Ministry of Tourism recognised/i);
  assert.doesNotMatch(html, /Book now|Server Action/i);
});

test("server-renders the travel styles collection", async () => {
  const response = await render("/travel-styles");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Travel Styles \| Eastern Risen<\/title>/i);
  assert.match(html, /How would you like to travel\?/i);
  assert.match(html, /Classic Journeys/i);
  assert.match(html, /Wildlife &amp; Nature/i);
  assert.match(html, /Celebrated places, quieter encounters/i);
  assert.match(html, /Forests, wetlands and wildlife encounters/i);
  assert.match(html, /Most good journeys cross categories/i);
  assert.match(html, /Odisha Golden Triangle/i);
  assert.doesNotMatch(html, /Book now|Server Action/i);
});

test("server-renders the destination collection", async () => {
  const response = await render("/destinations");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Destinations \| Eastern Risen<\/title>/i);
  assert.match(html, /Places worth knowing slowly/i);
  assert.match(html, /Odisha, known from the inside/i);
  assert.match(html, /Northeast India &amp; Sikkim/i);
  assert.match(html, /Journeys beyond India/i);
  assert.match(html, /Nepal/i);
  assert.match(html, /Sri Lanka/i);
  assert.doesNotMatch(html, /Book now|Server Action/i);
});

test("server-renders the travel services page", async () => {
  const response = await render("/services");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Travel Services \| Eastern Risen<\/title>/i);
  assert.match(html, /Inbound &amp; Domestic Tour Operations/i);
  assert.match(html, /Private Ground Transport/i);
  assert.match(html, /Air Ticketing/i);
  assert.match(html, /Travel Documentation Guidance/i);
  assert.match(html, /How we bring it together/i);
  assert.doesNotMatch(html, /Book now|Server Action/i);
});

test("server-renders the contact page", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Contact Us \| Eastern Risen<\/title>/i);
  assert.match(html, /Tell us where your curiosity is leading/i);
  assert.match(html, /info@easternrisen\.com/i);
  assert.match(html, /Bhubaneswar/i);
  assert.match(html, /Guwahati/i);
  assert.match(html, /<form/);
  assert.match(html, /Send my enquiry/);
  assert.doesNotMatch(html, /Server Action/i);
});

test("server-renders the about page", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>About Us \| Eastern Risen<\/title>/i);
  assert.match(html, /Rooted in Odisha\. Curious about the world/i);
  assert.match(html, /Bijan Kumar Muduli/i);
  assert.match(html, /Personal care, made practical/i);
  assert.match(html, /Odisha is our signature, not our limit/i);
  assert.match(html, /Respect belongs in the itinerary/i);
  assert.match(html, /Recognition &amp; memberships/i);
  assert.match(html, /IATO/i);
  assert.match(html, /TOFTigers/i);
});

test("server-renders the journal", async () => {
  const response = await render("/journal");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Journal \| Eastern Risen<\/title>/i);
  assert.match(html, /Notes from places worth knowing/i);
  assert.match(html, /When Odisha’s coast feels most alive/i);
  assert.match(html, /The pleasure of travelling slowly/i);
  assert.match(html, /The best journeys begin with a good question/i);
  assert.doesNotMatch(html, /Server Action/i);
});

test("server-renders complete journal stories", async () => {
  const response = await render("/journal/odisha-coast");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>When Odisha’s coast feels most alive \| Eastern Risen<\/title>/i);
  assert.match(html, /Chilika in motion/i);
  assert.match(html, /Temple towns and ordinary mornings/i);
  assert.match(html, /Continue reading/i);
  assert.doesNotMatch(html, /Server Action/i);
});

test("server-renders the legal pages", async () => {
  const terms = await (await render("/terms-of-service")).text();
  const privacy = await (await render("/privacy-policy")).text();

  assert.match(terms, /<title>Terms of Service \| Eastern Risen<\/title>/i);
  assert.match(terms, /Planning and booking/i);
  assert.match(terms, /Changes and cancellations/i);
  assert.match(privacy, /<title>Privacy Policy \| Eastern Risen<\/title>/i);
  assert.match(privacy, /Information we collect/i);
  assert.match(privacy, /Your choices and rights/i);
  assert.match(privacy, /We use GoatCounter to understand general website traffic/i);
  assert.doesNotMatch(`${terms}${privacy}`, /Server Action/i);
});


test("exports a private quote shell with no indexing or analytics", async () => {
  const html = await (await render("/quote")).text();
  const headers = await fs.promises.readFile(new URL("../out/_headers", import.meta.url), "utf8");
  const redirects = await fs.promises.readFile(new URL("../out/_redirects", import.meta.url), "utf8");
  assert.match(html, /<title>Your private quote \| Eastern Risen<\/title>/i);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/i);
  assert.match(html, /<meta name="referrer" content="no-referrer"/i);
  assert.doesNotMatch(html, /rel="canonical"|goatcounter|sdk\.cashfree\.com/i);
  assert.match(headers, /\/quote\/\*\s+Cache-Control: no-store/);
  assert.match(headers, /Referrer-Policy: no-referrer/);
  assert.match(redirects, /\/quote\/:token \/quote\/ 200/);
});
