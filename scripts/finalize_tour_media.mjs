import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "content-bank/data/tour_images.json");
const imagesDir = path.join(root, "public/images/tours");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const generatedFiles = new Map([
  [0, "tour-001-adventure-trekking-tour-i.webp"],
  [1, "tour-002-amarnath-yatra.webp"],
  [4, "tour-005-amarnath-yatra-start-from-28th-jun-till-21st-august-2013.webp"],
  [5, "tour-006-amazing-thiland.webp"],
  [7, "tour-008-arunachal-tribal-tour-ii.webp"],
  [10, "tour-011-bhutan-tour-iii.webp"],
  [23, "tour-024-eastern-textile-tour.webp"],
  [28, "tour-029-gujrat-tribal-tour.webp"],
  [34, "tour-035-itinerary-ii.webp"],
  [44, "tour-045-mopin-sangken-festival.webp"],
  [52, "tour-053-odisha-golden-triangle-1.webp"],
  [53, "tour-054-odisha-golden-triangle-i.webp"],
  [55, "tour-056-odisha-nature-tour.webp"],
  [68, "tour-069-srilanka-tour-i.webp"],
  [72, "tour-073-srilanka-tour-iv.webp"],
  [78, "tour-079-western-odisha-glipms.webp"],
  [82, "tour-083-odisha-wildlife-tour-ii.webp"],
]);

for (const [index, file] of generatedFiles) {
  Object.assign(manifest[index], {
    image: `/images/tours/${file}`,
    sourceTitle: "Generated for Eastern Risen",
    sourcePage: null,
    originalUrl: null,
    creator: "OpenAI ImageGen",
    license: "Original generated asset",
    licenseUrl: null,
    originalWidth: 1536,
    originalHeight: 1024,
    generated: true,
  });
}

const imagePaths = manifest.map((entry) => entry.image);
if (manifest.length !== 84 || imagePaths.some((image) => !image)) {
  throw new Error("The tour media manifest must contain 84 complete entries.");
}
if (new Set(imagePaths).size !== manifest.length) {
  throw new Error("Every tour must have a unique image path.");
}

const expected = new Set(imagePaths.map((image) => path.basename(image)));
for (const file of fs.readdirSync(imagesDir)) {
  if (!expected.has(file)) fs.unlinkSync(path.join(imagesDir, file));
}

for (const image of imagePaths) {
  if (!fs.existsSync(path.join(root, "public", image))) {
    throw new Error(`Missing final image: ${image}`);
  }
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Finalized ${manifest.length} unique tour images (${generatedFiles.size} generated).`);
