# Eastern Risen media sourcing

## Production image set

The journey catalogue uses 84 separate cover images in `public/images/tours`—one
for every tour, with no reused file paths. The mapping and licensing record lives
in `content-bank/data/tour_images.json`.

- 67 high-resolution images were sourced from Wikimedia Commons under reusable
  Public Domain, CC0 or Creative Commons attribution licences.
- 17 destination-specific gaps were created as original documentary-style images.
- All production covers were converted to quality-82 WebP and retain enough
  resolution for responsive card and detail-page crops.
- The public `/photo-credits` page preserves creator, source and licence details.

Generated scenes are illustrative brand imagery and must not be represented as
photographs of a particular Eastern Risen departure, guest, employee or supplier.

## Assets Eastern Risen must supply

These materials need to be authentic and should not be generated:

1. **Founder or leadership portrait** — one horizontal environmental portrait and
   one clean vertical portrait, ideally at least 3000 px on the long edge.
2. **Team photograph** — a current group image of the people who plan and operate
   journeys, with written permission from everyone pictured.
3. **Bhubaneswar and Guwahati office photographs** — exterior or recognisable
   reception/workspace views, at least 2400 px wide.
4. **Real guiding and traveller photographs** — three to six candid images from
   Eastern Risen trips, with guest and guide consent for website use.
5. **Owned vehicle photographs** — only if the site should promise or display a
   specific fleet or vehicle class.
6. **Accreditation and association marks** — current vector logos plus evidence
   that Eastern Risen is authorised to display them.
7. **Authentic festival and community upgrades** — the current covers are complete,
   but first-party Hornbill, tribal, shamanic and community-hosted photography is
   preferable when accurate captions, licensing and consent are available.
8. **Accommodation and supplier photography** — use only images provided or
   licensed by the actual property or operator included in an itinerary.

For supplied photography, retain the original files and record the photographer,
copyright holder, licence, people pictured, location and capture date before
publishing.

## Loading policy

- Page heroes are eagerly loaded because they are the largest visible element.
- All card, chapter and supporting images use native lazy loading and asynchronous
  decoding.
- Every image declares responsive display sizes and uses `object-fit: cover` for
  predictable crops.
- WebP is used for production delivery; original camera files should be archived
  outside the deployed website.
