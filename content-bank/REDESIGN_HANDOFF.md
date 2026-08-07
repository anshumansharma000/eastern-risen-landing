# Redesign handoff

## What this repository is

This is a migration source of truth for rebuilding Eastern Risen with the legacy site's public data. It contains both:

1. **Preservation data** - original HTML and downloadable same-origin assets, retained so no wording, route, itinerary, or image is accidentally lost.
2. **Working content** - structured JSON, CSV, and Markdown suitable for editing, importing into a CMS, or converting to application data.

The preserved content is not automatically approved for publication. Contact information, accreditations, festival dates, destination facts, tour availability, policies, and spelling must be checked by the business owner.

## Recommended content model

### Site settings

- Brand name, legal name, tagline, logo, primary phone/email, social accounts
- Head office, branch offices, channel-office locations
- Accreditations and memberships, each with verification date and supporting document
- Default SEO title/description and enquiry CTA

### Tour

- Stable ID and URL slug
- Display name and legacy name
- Status: active, seasonal, draft, archived
- Tour group: Odisha, India region, neighbouring country, outbound, wildlife, tribal, spiritual, adventure, festival
- Destinations and route as structured locations
- Duration in nights and days as numbers
- Summary and highlights
- Day-by-day itinerary
- Inclusions, exclusions, accommodation, transport, meals, permits, fitness level, best season
- Starting point, ending point, map coordinates
- Hero image and gallery with rights/credits and accessible alt text
- Enquiry CTA
- Legacy source URLs
- Editorial verification status and last-reviewed date

### Service

- Name, summary, full description, supported locations, vehicle/product types, CTA
- Active/draft status and source URL

### Policy

- Policy type, body, effective date, last-updated date, owner/approver

### Testimonial or commendation

- Customer name, quote, trip, date, photo, consent status

## Suggested new information architecture

- Home
- About
- Tours
  - Odisha
  - India by region
  - Wildlife
  - Tribal and cultural
  - Adventure and trekking
  - Spiritual and Buddhist
  - Nepal, Bhutan, Sri Lanka and Tibet
  - International holidays
- Services
  - Tour operations
  - Car rental
  - Air ticketing
  - Travel documentation
- Sustainability
- Gallery
- Contact / Enquire
- Privacy, terms, booking/cancellation and refund policies

## Migration sequence

1. Use `data/tour_review_queue.json` to resolve naming, duration, route, spelling, and dated-content issues.
2. Decide which of the 84 extracted catalog records are currently active. The archive contains 126 occurrences because some packages appear on both summary and detailed pages and some legacy versions conflict.
3. Edit the 78 detected day-by-day itinerary Markdown files. Preserve source URLs in CMS records.
4. Verify company/contact data in `data/company.json` and replace unverified claims with current evidence.
5. Write missing policies listed in `data/policies.json`.
6. Review `data/assets.csv` and `data/media_usage.csv`; select usable images, establish usage rights, replace Flash, and write alt text.
7. Implement the 301 map in `data/redirects.csv`, resolving duplicate suggested slugs before launch.
8. Import approved content into the new CMS/site and run editorial, accessibility, SEO, security, and mobile QA.

## Non-negotiable launch requirements

- Valid HTTPS with automatic HTTP-to-HTTPS redirects
- No legacy public login unless rebuilt as an authenticated, secured requirement
- Enquiry consent and privacy disclosure
- Server-side validation, spam protection, and secure storage/transmission for form data
- Responsive design, semantic headings, keyboard navigation, visible focus states, meaningful alt text
- Unique page titles/descriptions, canonical URLs, XML sitemap, robots policy, and structured tour/business data
- No Flash, Google+, visitor counter, or obsolete third-party scripts

## Coverage caveats

- Four discovered page endpoints failed: two malformed duplicate paths, the broken `/Service/budhist_tour.asp`, and the enquiry form handler returning HTTP 500 to a GET request.
- Thirty-five asset references failed. These are retained in `data/assets.csv` as evidence of broken legacy dependencies.
- Third-party assets and external-site content were inventoried through links but not mirrored.
- The crawl was public and read-only; no forms were submitted and no private/admin content was accessed.
