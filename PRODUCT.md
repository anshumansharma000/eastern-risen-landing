# Eastern Risen Website Redesign

Status: Product definition and design exploration  
Last updated: 2026-08-06  
Owner: Eastern Risen Expedition Pvt. Ltd.  
Working repository: `content-bank/`

## 1. Product summary

Eastern Risen needs a complete redesign of its public travel website. The new product will preserve the depth of the legacy tour and itinerary library while replacing the old site with a secure, responsive, accessible, editorially polished experience.

The website should position Eastern Risen as a knowledgeable expedition house: rooted in Odisha and eastern India, experienced across India and neighbouring countries, culturally respectful, quietly premium, and capable of designing unusual journeys with personal care.

This is not a discount travel marketplace. It is a specialist, trust-led travel brand.

## 2. Product vision

Create the most credible and inspiring digital home for Eastern Risen: a site where travellers can discover distinctive journeys, understand the company's expertise, trust the people behind it, and confidently begin planning a private or small-group tour.

The product should communicate:

> We know these places deeply, and we will take care of you.

## 3. Brand proposition

### Brand

- Public name: Eastern Risen
- Legal name: Eastern Risen Expedition Pvt. Ltd.
- Legacy tagline: Make Your Own Travel
- Supporting idea: Make Your Own Travel Safely
- Founder named on the legacy site: Bijan Kumar Muduli

All legal details, addresses, contact information, affiliations, recognition, and founder information must be verified before publication. The structured legacy data is stored in `content-bank/data/company.json`.

### Positioning

Eastern Risen is a specialist tour operator for private and small-group journeys across India and neighbouring countries, with particular strength in:

- Odisha
- Northeast India and Sikkim
- Wildlife and nature
- Tribal, cultural, craft and textile journeys
- Buddhist and spiritual travel
- Adventure, trekking and bike journeys
- Nepal, Bhutan, Sri Lanka and Tibet
- Tailor-made journeys

### Differentiators

- Deep local and regional knowledge
- Uncommon itineraries beyond standard tourist circuits
- Strong Odisha specialization
- Personal planning and support
- Cultural and community awareness
- Long-form, day-by-day travel expertise
- Ability to combine transport, documentation and tour operation services

## 4. Product principles

1. **Trust before conversion.** Credentials, real people, transparent information, security and current contact details come before aggressive sales tactics.
2. **Depth without clutter.** Preserve detailed itineraries while making them easy to scan, filter and understand.
3. **Odisha is the signature, not the limit.** Use Odisha as a distinctive brand anchor while presenting the wider portfolio confidently.
4. **Editorial, not transactional.** The experience should feel like an expert travel journal and expedition house, not an online travel agency grid.
5. **Human planning.** The primary conversion is a thoughtful enquiry or consultation, not an instant commodity purchase.
6. **Respectful representation.** Cultural, tribal, spiritual, community and wildlife content must be accurate, consent-aware and non-exploitative.
7. **Mobile first and accessible.** The entire experience must work beautifully on small screens, with semantic and inclusive interaction patterns.
8. **Preserve provenance.** Migrated content retains its legacy source URL and editorial verification status.

## 5. Target audiences

### Primary

- International travellers seeking culturally rich, guided India journeys
- Indian travellers seeking distinctive domestic itineraries
- Mature travellers who value support, reliability and knowledgeable planning
- Wildlife, cultural, Buddhist, textile, tribal and photography-interest travellers
- Private groups, families and small affinity groups

### Secondary

- Overseas tour operators and travel partners
- Educational, cultural and institutional groups
- Adventure and trekking travellers
- Travellers planning Nepal, Bhutan, Sri Lanka or Tibet alongside India

### User needs

- Understand what makes Eastern Risen credible
- Find tours by destination, interest, duration and travel style
- See a clear route, highlights and day-by-day plan
- Know whether a tour is appropriate for their interests and ability
- Ask for customization
- Speak with a real person
- Understand inclusions, exclusions, seasonality and practical requirements
- Feel confident sharing personal information

## 6. Primary product goals

- Increase qualified tour enquiries
- Establish Eastern Risen as an Odisha and specialist-journey authority
- Make the tour library searchable and comprehensible
- Improve trust through verified credentials, people, policies and secure forms
- Create reusable structured content for future campaigns and destination pages
- Retain useful legacy search equity through redirects and improved SEO

## 7. Initial success metrics

Final targets will be set after baseline analytics are available.

- Qualified enquiry conversion rate
- Clicks on Plan a Journey, email, phone and WhatsApp actions
- Tour-detail engagement and itinerary expansion rate
- Enquiry completion rate
- Organic entrances to tour, destination and journal pages
- Percentage of active tours with verified and complete content
- Core Web Vitals pass rate
- Accessibility audit score
- Zero insecure form submissions or mixed-content errors

## 8. Information architecture

### Primary navigation

- Tours
- Destinations
- Travel Styles
- About
- Sustainability
- Journal
- Plan a Journey

### Utility navigation

- Search
- Contact
- Phone/WhatsApp, if verified and approved
- Language selection only if translations are properly maintained

### Tours by destination

- Odisha
- North India
- Northeast India and Sikkim
- East India
- South India
- Central India
- West India
- Nepal
- Bhutan
- Sri Lanka
- Tibet
- Southeast Asia

### Tours by interest

- Wildlife and Nature
- Tribal and Cultural
- Adventure and Trekking
- Buddhist and Spiritual
- Textile, Craft and Art
- Festivals
- Classic Journeys
- Tailor-made Travel

### Footer

- About Eastern Risen
- Founder/team
- Sustainability
- Contact and offices
- Privacy
- Terms
- Booking and cancellation policy
- Refund policy
- Accessibility statement
- Sitemap
- Verified memberships and social profiles

## 9. Core journeys

### Discover a tour

Home or search -> destination/travel-style collection -> filter or browse -> tour detail -> Plan this Journey -> enquiry confirmation.

### Request a tailor-made journey

Home/About/Tour -> Plan a Journey -> provide interests, destination, dates, group and contact information -> consent -> confirmation and response expectation.

### Establish trust

Landing page -> About/founder/credentials/sustainability/testimonials -> tour detail or enquiry.

## 10. Page requirements

### 10.1 Homepage

1. Cinematic hero with one clear promise
2. Primary CTA: Explore Journeys
3. Secondary CTA: Plan a Private Tour
4. Curated signature journeys, maximum six
5. Why Eastern Risen trust pillars
6. Explore by travel style
7. Dedicated "Our home ground: Odisha" story
8. Founder or local-expertise story
9. Sustainability and community approach
10. Verified testimonials and affiliations
11. Journal/field notes
12. Final conversational planning CTA

Working hero copy:

> Journeys that bring you closer.

Supporting copy:

> Private and small-group journeys across India and its neighbouring lands, designed with local knowledge and personal care.

### 10.2 Tour collection

- Editorial introduction
- Filters: destination, travel style, duration, season and activity level
- Sort only where it provides real value
- Clear active-filter state and reset
- Tour cards with image, name, route/region, duration, short promise and status
- No fabricated pricing
- Empty states and no-results suggestions
- Pagination or progressive loading with crawlable URLs

### 10.3 Tour detail

1. Hero image and concise tour promise
2. Duration, region, travel style, starting/ending points, ideal season and activity level
3. Route summary and optional map
4. Highlights
5. Day-by-day itinerary
6. Accommodation approach
7. Transport and meals
8. Inclusions and exclusions
9. Practical information, permits and accessibility/fitness expectations
10. Responsible-travel notes
11. Gallery
12. Related journeys
13. Sticky but unobtrusive Plan This Journey CTA

On mobile, itineraries may use accessible accordions. Content must remain server-rendered, indexable and printable.

### 10.4 Destination page

- Sense-of-place hero and editorial overview
- Why travel with Eastern Risen in this destination
- Key regions and experiences
- Best time to visit
- Signature tours
- Practical guidance
- Related journal content
- Enquiry CTA

Odisha receives the richest destination treatment.

### 10.5 Travel-style page

- Editorial explanation of the experience
- Ethical and practical context
- Matching tours and destinations
- Relevant expertise or guide profile
- FAQ and enquiry CTA

### 10.6 About

- Company story
- Founder story with authentic portrait
- Operating philosophy
- Current team/guides if available
- Verified recognition and memberships
- Service model and planning process
- Office/contact details

### 10.7 Sustainability

- Specific operating practices rather than generic claims
- Community benefit and cultural-respect approach
- Wildlife and environmental standards
- ATOAI pledge, if current and appropriate
- Evidence, dates and ownership for claims

### 10.8 Journal

- Destination guides
- Seasonal advice
- Festival and wildlife guidance
- Craft, textile, Buddhist and cultural context
- Author, publish date, update date and related tours

### 10.9 Plan a Journey

The form should feel conversational and low-pressure.

Suggested fields:

- Name
- Email
- Phone/WhatsApp optional
- Country
- Destinations of interest
- Travel styles/interests
- Approximate dates or flexibility
- Number and type of travellers
- Preferred trip length
- Existing tour of interest
- Accessibility, dietary or mobility needs optional
- Free-form message
- Privacy consent

Show a clear response-time expectation after submission.

## 11. Visual direction

### Creative concept

**Quiet Expedition Luxury with an Odisha soul.**

The design combines the calm confidence of a boutique expedition operator with subtle influences from Odisha's landscapes, architecture, textiles and craft traditions.

### Desired feelings

- Grounded
- Exploratory
- Human
- Culturally respectful
- Calm
- Experienced
- Trustworthy
- Quietly premium

### Colour palette

The refreshed palette preserves the legacy site's recognisable orange, cream, grey, blue and berry character while making the tones calmer and more premium.

- Heritage orange: `#E3701D` - original brand accent retained for logo details, highlights, rules and selected states
- CTA rust: `#B95016` - accessible primary button and high-emphasis action colour
- CTA rust hover: `#963E12` - primary-action hover and pressed state
- Sunlit apricot: `#F1A15D` - softened secondary orange for gentle highlights and warm editorial graphics
- Warm ivory: `#FFF9F2` - primary page background
- Sand cream: `#F3E7D5` - alternating editorial sections and soft surfaces
- White: `#FFFFFF` - cards, image overlays and high-clarity surfaces
- Ink charcoal: `#25221F` - primary text and dark navigation/footer surfaces
- Warm grey: `#6A625C` - secondary text
- Sand border: `#DED2C3` - dividers, inputs and quiet component boundaries
- Expedition slate: `#244E63` - the single cool counterpoint, refined from the legacy blue family for links, maps and informational accents

Use warm ivory, sand cream and white for roughly 70% of the interface, charcoal/grey for approximately 20%, orange/rust for 8-10%, and expedition slate for no more than 2-3%. Do not recreate the legacy site's large saturated orange outer background. Orange should create recognition and energy through navigation details, buttons, rules and selected states rather than overwhelming photography and content. Do not use white text on Heritage Orange `#E3701D` for small controls; use Ink Charcoal on the bright orange or use CTA Rust `#B95016` with white text. Legacy magenta `#BB005E` is not part of the core interface palette and may appear only inside archival artwork or photography.

### Typography

- Editorial serif for display headings: Newsreader, Fraunces or comparable
- Clean sans-serif for UI and body: Inter, Manrope or comparable
- Large, confident headlines; comfortable body size; generous line height
- Avoid decorative faux-ethnic typefaces

### Photography

- Documentary and atmospheric rather than generic stock
- People situated naturally within landscape and culture
- Genuine local guides and interactions
- Odisha coast, forests, crafts, temples and Buddhist heritage
- Wildlife shown respectfully in habitat
- Wide cinematic views mixed with intimate details
- Rights, consent, credit and alt text required for every selected image

### Graphic language

- Generous whitespace
- Thin dividers and restrained borders
- Subtle paper grain or natural texture
- Light use of abstracted Odisha architectural or textile geometry
- Editorial card layouts with varied image ratios
- Soft transitions and meaningful motion only
- Maps, compass marks and field-note details used sparingly

### Explicitly avoid

- Generic OTA or booking-marketplace appearance
- Discount banners and fake urgency
- Bright blue travel gradients
- Aeroplane-path clichés
- Overloaded card grids
- Image collages containing many destinations
- Excessive rounded cards and floating pills
- Auto-rotating carousels
- Flash, visitor counters and obsolete social icons
- Cultural motifs used as decoration without context

## 12. Responsive and interaction requirements

- Design mobile, tablet and desktop states
- Mobile navigation must expose destination and interest categories clearly
- Minimum 44px touch targets
- Visible keyboard focus
- No hover-only information or navigation
- Sticky CTAs must not obscure content
- Filters open in an accessible mobile sheet or dedicated view
- Motion respects `prefers-reduced-motion`
- Itineraries are printable and shareable

## 13. Accessibility requirements

- Target WCAG 2.2 AA
- Semantic landmarks and logical heading order
- Keyboard-operable navigation, filters, accordions, dialogs and forms
- Meaningful alt text and decorative-image handling
- Sufficient colour contrast
- Form labels, instructions, inline validation and error summary
- No reliance on colour alone
- Captions/transcripts for meaningful video/audio
- Language attribute and appropriate language changes

## 14. Content system

### Legacy source of truth

The migration repository is documented in `content-bank/README.md` and includes:

- 108 normalized pages
- 94 tour pages
- 78 detected day-by-day itineraries
- 84 deduplicated extracted catalog records
- 126 raw package occurrences
- 178 downloaded same-origin assets
- URL, link, form, media and redirect inventories

### Required tour fields

- ID and slug
- Active/draft/archived status
- Display name and legacy name
- Destination and travel-style taxonomy
- Duration as numeric nights/days
- Summary and highlights
- Structured route
- Day-by-day itinerary
- Ideal season and activity level
- Inclusions/exclusions
- Accommodation, meals and transport
- Permits and practical notes
- Responsible-travel notes
- Hero/gallery media and alt text
- Source URLs
- Verification status and review date

### Editorial rule

Never silently correct or overwrite the archival source. Approved copy belongs in the new CMS/content layer; legacy wording and provenance remain available for comparison.

## 15. Functional requirements

- Tour search and faceted filtering
- Site-wide search
- Secure enquiry workflow
- CMS-managed tours, destinations, travel styles, pages, people, testimonials and journal posts
- Related-content relationships
- Draft, review and publish workflow
- Image transformation and responsive delivery
- Redirect management
- XML sitemap and structured data
- Analytics and consent controls
- Spam protection without inaccessible CAPTCHA dependence
- Optional WhatsApp/phone actions after business verification
- No payments or instant booking in the initial release unless separately approved

## 16. Security and privacy

- Valid HTTPS everywhere with HTTP redirect
- No mixed content
- Server-side form validation and sanitization
- Rate limiting and spam mitigation
- Secure data transmission and storage
- Explicit privacy consent and retention policy
- Least-privilege CMS roles and multifactor authentication
- No public legacy login
- Dependency and security-update process

## 17. SEO requirements

- Unique page titles and descriptions
- Clean canonical URLs
- 301 redirects from legacy `.asp` URLs
- Destination, tour, organization, breadcrumb and article structured data where valid
- Crawlable filters strategy
- XML sitemap and robots policy
- Open Graph and social metadata
- Strong internal linking among tours, destinations, travel styles and journal content
- Correct heading hierarchy and descriptive link text
- Avoid thin pages and unverified duplicate itineraries

## 18. Performance requirements

- Target Core Web Vitals pass on representative mobile traffic
- Responsive modern image formats with explicit dimensions
- No autoplay background video on constrained connections
- Minimal third-party scripts
- Server-render or statically generate primary content
- Progressive enhancement for filters and itinerary interactions

## 19. Migration requirements

- Review `content-bank/data/tour_review_queue.json`
- Decide active versus archived tours
- Verify routes, durations, dates, facts and spellings
- Verify company/contact/accreditation data
- Select rights-cleared images from the legacy archive or commission replacements
- Write missing legal, booking, cancellation and refund content
- Resolve duplicate proposed slugs in `content-bank/data/redirects.csv`
- Preserve source URLs in migrated CMS records
- Test every redirect before launch

## 20. Release scope

### Phase 1: Design and content foundation

- Design system and high-fidelity prototypes
- Homepage, tour collection, tour detail, destination, About/Sustainability and Plan a Journey
- Content model and CMS selection
- Tour catalog editorial review

### Phase 2: Production launch

- Responsive front end and CMS
- Approved tour/destination content
- Secure enquiries
- SEO migration and redirects
- Analytics, accessibility, security and performance QA

### Phase 3: Growth

- Journal program
- Additional destination depth
- Partner/agent journeys if required
- Multilingual content only with editorial ownership
- Personalization, saved tours or account features only if validated

## 21. Current product decisions

- Chosen direction: Quiet Expedition Luxury with an Odisha soul
- Primary conversion: Plan a Journey enquiry
- Commerce model for initial release: enquiry-led, not instant booking
- Odisha will receive prominent homepage and destination treatment
- Legacy content will be preserved but not automatically republished
- The visual palette will preserve the legacy orange-led identity using Heritage Orange `#E3701D`, supported by accessible rust actions, warm cream, charcoal and one restrained slate-blue counterpoint
- Mobile-first responsive design and WCAG 2.2 AA are required
- `PRODUCT.md` is the product source of truth
- A future `DESIGN.md` will contain the approved visual system after Stitch exploration

## 22. Open decisions

- Final logo: retain, refine or redesign
- Current verified accreditations and memberships
- Current offices, phone numbers, email and WhatsApp number
- Which tours are active, seasonal or archived
- Whether prices should ever be displayed
- CMS and implementation stack
- Photography ownership and replacement budget
- Availability of verified testimonials and team portraits
- Language strategy
- Journal ownership and publishing cadence
- Whether B2B tour-operator content needs a separate pathway

## 23. Design acceptance criteria

- The homepage clearly communicates the proposition within the first viewport
- Odisha expertise is distinctive without making the wider catalog feel secondary
- Users can reach an appropriate tour by destination or interest
- Tour details remain readable even with long itineraries
- Primary actions are obvious but not aggressive
- Desktop and mobile designs feel intentionally composed
- The interface does not resemble a generic travel marketplace
- Trust, accessibility and cultural respect are evident in the content hierarchy
- The design can scale across at least 80 tour records without becoming visually repetitive

## 24. Document maintenance

Update this file whenever product scope, audience, information architecture, conversion strategy, content model, design direction or release requirements change. Record approved visual tokens and component rules separately in `DESIGN.md` after design exploration converges.
