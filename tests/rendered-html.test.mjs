import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import tourImages from "../content-bank/data/tour_images.json" with { type: "json" };

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Eastern Risen landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Eastern Risen \| Journeys that bring you closer<\/title>/i);
  assert.match(html, /Journeys that bring you closer\./);
  assert.match(html, /Odisha Golden Triangle/);
  assert.match(html, /Where would you like to go next\?/);
  assert.match(html, /src="\/images\/hero-odisha-dawn-v2\.webp"/);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /\/_vinext\/image\?/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Server Action/i);
});

test("server-renders the data-backed tour collection", async () => {
  const response = await render("/tours");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Journeys \| Eastern Risen<\/title>/i);
  assert.match(html, /84/);
  assert.match(html, /Odisha Golden Triangle/i);
  assert.match(html, /Filter &amp; refine/i);
  assert.match(html, /Northeast India &amp; Sikkim/i);
  assert.match(html, /Nepal &amp; Bhutan/i);
  assert.match(html, /Special Interest &amp; Across India/i);
  assert.match(html, /Season and activity filters will be added/i);
  assert.doesNotMatch(html, /\$[0-9]|Book now|Server Action/i);
});

test("assigns one optimized image to every tour", () => {
  assert.equal(tourImages.length, 84);
  assert.equal(new Set(tourImages.map((entry) => entry.image)).size, 84);
  for (const entry of tourImages) {
    assert.match(entry.image, /^\/images\/tours\/.+\.webp$/);
    assert.ok(fs.existsSync(new URL(`../public${entry.image}`, import.meta.url)));
  }
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
  assert.match(html, /Start a conversation/i);
  assert.doesNotMatch(html, /\$[0-9]|Book now|Server Action/i);
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
  assert.doesNotMatch(html, /\$[0-9]|Book now|Server Action/i);
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
  assert.doesNotMatch(html, /\$[0-9]|Book now|Server Action/i);
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
  assert.doesNotMatch(html, /\$[0-9]|Book now|Server Action/i);
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
  assert.doesNotMatch(html, /<form|Server Action/i);
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
  assert.doesNotMatch(html, /IATO|ADTOI|ATOAI|TOFTigers/i);
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
