import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const workspace = new URL("../", import.meta.url).pathname;
const catalogPath = join(workspace, "content-bank/data/tour_catalog.json");
const outputDirectory = join(workspace, "public/images/tours");
const manifestPath = join(workspace, "content-bank/data/tour_images.json");
const temporaryDirectory = join(workspace, ".media-downloads");

const briefs = [
  "Sikkim Himalayan trekking trail Dzongri",
  "Amarnath cave Kashmir Himalaya",
  "Pahalgam valley Kashmir mountains",
  "Baltal Kashmir mountain landscape",
  "Kashmir Himalayan pilgrimage trail",
  "Coral Island Pattaya Thailand coast",
  "Ziro valley Arunachal Pradesh",
  "Siang river Arunachal Pradesh landscape",
  "Paro valley Bhutan",
  "Thimphu Bhutan dzong",
  "Wangdue Phodrang Bhutan landscape",
  "Punakha Dzong Bhutan",
  "Manali Leh highway Ladakh",
  "Sanchi Stupa Madhya Pradesh",
  "Kanha National Park India landscape",
  "Chilika Lake Odisha",
  "Raghurajpur Odisha crafts village",
  "Ratnagiri Buddhist site Odisha",
  "Darjeeling Himalaya Kanchenjunga",
  "Kalimpong hills West Bengal",
  "Bhitarkanika mangroves Odisha",
  "Lalitgiri Buddhist site Odisha",
  "Udayagiri Buddhist site Odisha",
  "Sambalpuri ikat Odisha textile",
  "Simlipal waterfall Odisha",
  "Kerala backwaters houseboat",
  "Marina Bay Singapore skyline",
  "Taj Mahal Agra",
  "Chhota Udaipur Gujarat architecture",
  "Manali Himachal Pradesh landscape",
  "Vaishno Devi Katra Jammu",
  "Hornbill Festival Nagaland",
  "Kisama heritage village Nagaland",
  "Kaziranga rhinoceros Assam",
  "Mon Nagaland landscape",
  "Patan Durbar Square Nepal",
  "Kathmandu Durbar Square Nepal",
  "Pokhara Annapurna Nepal",
  "Lumbini Nepal",
  "Bhaktapur Nepal",
  "Phewa Lake Pokhara Nepal",
  "Ladakh monastery landscape",
  "Lamayuru monastery Ladakh",
  "Genting Highlands Malaysia",
  "Sangken festival Arunachal Pradesh",
  "Muktinath temple Nepal",
  "Khonoma village Nagaland",
  "Longwa village Nagaland",
  "Mahabodhi Temple Bodh Gaya",
  "Jagdalpur Chhattisgarh landscape",
  "Gopalpur beach Odisha",
  "Konark Sun Temple Odisha",
  "Ratnagiri Odisha Buddhist monastery ruins",
  "Pipili applique Odisha craft",
  "Puri Jagannath temple Odisha",
  "Satkosia gorge Odisha",
  "Bhitarkanika crocodile Odisha",
  "Pashupatinath temple Nepal",
  "Jomsom Nepal Himalaya",
  "Reh festival Arunachal Pradesh",
  "Kamakhya temple Guwahati Assam",
  "Dhauli Shanti Stupa Odisha",
  "Tawang monastery Arunachal Pradesh",
  "Yumthang Valley Sikkim",
  "Rumtek Monastery Sikkim",
  "Singapore tropical bird park",
  "Brihadeeswarar Temple Thanjavur",
  "Dal Lake Srinagar Kashmir",
  "Colombo Sri Lanka coast",
  "Temple of the Tooth Kandy Sri Lanka",
  "Koneswaram Temple Trincomalee Sri Lanka",
  "Dambulla cave temple Sri Lanka",
  "Nuwara Eliya Sri Lanka landscape",
  "Sigiriya Sri Lanka",
  "Potala Palace Lhasa Tibet",
  "Bastar tribal art Chhattisgarh",
  "Dwarkadhish temple Gujarat",
  "Somnath Temple Gujarat",
  "Hirakud reservoir Debrigarh Odisha",
  "Bandhavgarh tiger India",
  "Gir lion Gujarat India",
  "Manas National Park Assam",
  "Satkosia wildlife Odisha",
  "Simlipal tiger reserve Odisha",
];

// These searches returned technically matching but editorially misleading files.
// Keep them in the generation queue instead of accepting a weak substitute.
const forceGenerationIndexes = new Set([4, 52, 68, 72]);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’'“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function acceptedLicense(shortName = "") {
  const normalized = shortName.toLowerCase();
  return (
    normalized.includes("public domain") ||
    normalized.includes("cc0") ||
    normalized.startsWith("cc by")
  ) && !normalized.includes("-nc") && !normalized.includes("-nd");
}

async function searchCommons(query) {
  const parameters = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "30",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1600",
    format: "json",
    formatversion: "2",
    origin: "*",
  });
  const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${parameters}`);
  if (!response.ok) throw new Error(`Commons search failed (${response.status}) for ${query}`);
  const payload = await response.json();
  return payload.query?.pages ?? [];
}

const genericSearchTerms = new Set([
  "and", "the", "india", "indian", "travel", "tour", "landscape", "nature",
  "heritage", "site", "temple", "monastery", "mountain", "mountains", "valley",
  "festival", "national", "park", "wildlife", "coast", "architecture",
]);

const locationTerms = new Set([
  "sikkim", "dzongri", "amarnath", "kashmir", "pahalgam", "baltal", "pattaya",
  "thailand", "ziro", "arunachal", "siang", "paro", "bhutan", "thimphu",
  "wangdue", "punakha", "manali", "ladakh", "sanchi", "madhya", "kanha",
  "chilika", "odisha", "raghurajpur", "ratnagiri", "darjeeling", "kanchenjunga",
  "kalimpong", "bhitarkanika", "lalitgiri", "udayagiri", "sambalpuri", "simlipal",
  "kerala", "singapore", "agra", "mahal", "udaipur", "gujarat", "himachal",
  "vaishno", "jammu", "nagaland", "kisama", "kaziranga", "patan", "nepal",
  "kathmandu", "pokhara", "lumbini", "bhaktapur", "phewa", "lamayuru", "genting",
  "malaysia", "sangken", "muktinath", "khonoma", "longwa", "bodh", "gaya",
  "jagdalpur", "chhattisgarh", "gopalpur", "konark", "pipili", "puri", "satkosia",
  "pashupatinath", "jomsom", "kamakhya", "guwahati", "dhauli", "tawang", "yumthang",
  "rumtek", "thanjavur", "srinagar", "colombo", "lanka", "kandy", "trincomalee",
  "dambulla", "nuwara", "sigiriya", "potala", "lhasa", "tibet", "bastar", "dwarkadhish",
  "somnath", "hirakud", "debrigarh", "bandhavgarh", "gir", "manas",
]);

function scoreCandidate(page, usedUrls, query) {
  const info = page.imageinfo?.[0];
  if (!info || usedUrls.has(info.url)) return -1;
  if (!acceptedLicense(info.extmetadata?.LicenseShortName?.value)) return -1;
  if (!/^image\/(jpeg|png|webp)$/i.test(info.mime ?? "")) return -1;
  if ((info.width ?? 0) < 1400 || (info.height ?? 0) < 800) return -1;

  const queryTerms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 3 && !genericSearchTerms.has(term));
  const searchableText = `${page.title} ${JSON.stringify(info.extmetadata ?? {})}`.toLowerCase();
  const matchingTerms = queryTerms.filter((term) => searchableText.includes(term));
  if (queryTerms.length && matchingTerms.length === 0) return -1;
  const requiredLocations = queryTerms.filter((term) => locationTerms.has(term));
  if (requiredLocations.length && !requiredLocations.some((term) => searchableText.includes(term))) return -1;

  const landscapeBonus = info.width / info.height >= 1.25 ? 40 : 0;
  const resolutionBonus = Math.min(30, Math.round((info.width * info.height) / 1_000_000));
  const featuredBonus = /featured|quality image/i.test(JSON.stringify(info.extmetadata ?? {})) ? 15 : 0;
  return matchingTerms.length * 120 + landscapeBonus + resolutionBonus + featuredBonus;
}

async function selectImage(primaryBrief, usedUrls) {
  for (const query of [primaryBrief]) {
    const pages = await searchCommons(query);
    const candidates = pages
      .map((page) => ({ page, score: scoreCandidate(page, usedUrls, query) }))
      .filter((candidate) => candidate.score >= 0)
      .sort((a, b) => b.score - a.score);
    if (candidates.length) return { ...candidates[0], query };
  }
  return null;
}

async function download(url, destination) {
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function fetchWithRetry(url, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": "EasternRisenMediaAudit/1.0 (website image sourcing)" },
    });
    if (response.ok || response.status !== 429 || attempt === attempts) return response;
    await new Promise((resolve) => setTimeout(resolve, attempt * 4000));
  }
  throw new Error(`Request retry loop failed: ${url}`);
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
if (catalog.length !== briefs.length) {
  throw new Error(`Expected ${briefs.length} tours, found ${catalog.length}`);
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(temporaryDirectory, { recursive: true });

const usedUrls = new Set();
const manifest = [];

for (let index = 0; index < catalog.length; index += 1) {
  const tour = catalog[index];
  const selected = forceGenerationIndexes.has(index) ? null : await selectImage(briefs[index], usedUrls);
  if (!selected) {
    manifest.push({
      index,
      tour: tour.name,
      route: tour.destination_or_route,
      brief: briefs[index],
      searchQuery: briefs[index],
      image: null,
      sourceTitle: null,
      sourcePage: null,
      originalUrl: null,
      creator: null,
      license: null,
      licenseUrl: null,
      originalWidth: null,
      originalHeight: null,
      generated: null,
    });
    console.log(`${index + 1}/${catalog.length} ${tour.name} ← GENERATION REQUIRED`);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    continue;
  }

  const info = selected.page.imageinfo[0];
  const metadata = info.extmetadata ?? {};
  const fileStem = `tour-${String(index + 1).padStart(3, "0")}-${slugify(tour.name).slice(0, 58)}`;
  const temporaryFile = join(temporaryDirectory, `${fileStem}-${basename(new URL(info.thumburl ?? info.url).pathname)}`);
  const outputFile = join(outputDirectory, `${fileStem}.webp`);

  await download(info.thumburl ?? info.url, temporaryFile);
  execFileSync("cwebp", ["-quiet", "-mt", "-q", "82", temporaryFile, "-o", outputFile]);
  usedUrls.add(info.url);

  manifest.push({
    index,
    tour: tour.name,
    route: tour.destination_or_route,
    brief: briefs[index],
    searchQuery: selected.query,
    image: `/images/tours/${basename(outputFile)}`,
    sourceTitle: selected.page.title.replace(/^File:/, ""),
    sourcePage: info.descriptionurl,
    originalUrl: info.url,
    creator: stripHtml(metadata.Artist?.value || metadata.Credit?.value || "Unknown creator"),
    license: stripHtml(metadata.LicenseShortName?.value || "Unknown licence"),
    licenseUrl: metadata.LicenseUrl?.value || "",
    originalWidth: info.width,
    originalHeight: info.height,
    generated: false,
  });

  console.log(`${index + 1}/${catalog.length} ${tour.name} ← ${selected.page.title}`);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await new Promise((resolve) => setTimeout(resolve, 1100));
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Saved ${manifest.length} unique tour images and ${manifestPath}`);
