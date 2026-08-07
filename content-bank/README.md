# Eastern Risen content bank

Generated from the public legacy site at http://www.easternrisen.com/ for redesign and migration.

## Repository map

- `data/company.json` - structured company, office, contact, recognition, and membership data
- `data/services.json` - service catalog
- `data/navigation.json` - legacy information architecture in reusable form
- `data/policies.json` - policy-page status and content gaps
- `data/tour_catalog.json` and `.csv` - deduplicated package records with provenance
- `data/tour_occurrences.json` - every package occurrence as printed across landing and detail pages
- `data/tour_review_queue.json` - records requiring editorial or factual review
- `data/pages.json` - complete normalized page records, including full and main text
- `data/url_inventory.csv` - crawl status and errors
- `data/links.csv` - complete observed hyperlink inventory
- `data/forms.csv` - form actions, methods, and field schemas
- `data/media_usage.csv` - media-to-page usage, alt text, dimensions, and type
- `data/assets.csv` - media/script/style/PDF inventory with hashes and download status
- `data/redirects.csv` - suggested legacy-to-new URL migration map
- `pages/` - one Markdown file per public page
- `tour-pages/` - one Markdown file for every tour page, including category pages
- `itineraries/` - tour pages containing detected day-by-day programs
- `legacy-html/` - byte-preserved source HTML snapshot
- `legacy-assets/` - downloaded same-origin public assets
- `DATA_QUALITY.md` - verification and editorial queue

## Coverage

- Public URLs discovered: 112
- Pages normalized: 108
- Tour pages: 94
- Tour Markdown files: 94
- Itinerary Markdown files: 78
- Deduplicated catalog records / raw occurrences: 84/126
- Catalog records flagged for review: 32
- Same-origin assets discovered/downloaded: 213/178

## Redesign usage

Use normalized JSON/Markdown as the working content source. Keep `legacy-html` and `legacy-assets` as provenance only. All business claims, contact data, prices (if any), dates, festival schedules, inclusions, policies, and destination facts must be verified before launch.
