# Eastern Risen website inventory and audit

Audit date: 5 August 2026 (Asia/Kolkata)

Source: the public website at http://www.easternrisen.com and its linked ATOAI sustainability-pledge PDF. Company claims below are reported as published on the website; they were not independently verified.

## Executive view

Eastern Risen appears to be a real, specialist tour operator with unusually deep itinerary content, especially for Odisha, wildlife, tribal, Buddhist, Himalayan, and neighbouring-country travel. The content is the strongest asset.

The website itself substantially undermines that strength. It presents as a roughly 2010-era brochure site: fixed-width table layout, generic page titles, no semantic headings, old JavaScript, unsupported Flash, empty legal pages, broken or conflicting links, dated social links, inconsistent spelling, and no working HTTPS. The biggest immediate issue is trust and security: the site collects login credentials and personal enquiry data over plain HTTP, while the HTTPS certificate fails with `ERR_CERT_COMMON_NAME_INVALID`.

## Scope of inspection

- Crawled 105 URLs discovered through the rendered site's public internal link graph; 104 rendered and one malformed gallery/admin URL was blocked.
- Inspected four additional service pages exposed only through the scripted navigation.
- Checked the desktop visual layout, DOM structure, metadata, forms, scripts, images, navigation, gallery, contact/about/legal pages, and HTTPS behavior.
- Rendered and visually inspected both pages of the linked ATOAI sustainability PDF.
- Did not submit forms, attempt authentication, access private data, or test the server invasively.

## Company data published on the site

### Identity and positioning

- Trading identity: **Eastern Risen Expedition Pvt. Ltd.**
- Site/brand: **Eastern Risen**
- Tagline: **Make Your Own Travel**
- Business description: professional travel intermediary focused on wholesale and retail inbound, outbound, and domestic package tours.
- Positioning: common-interest and special-interest guided tours; personalized/round-the-clock service; support for individual package elements for FIT customers.
- Promotional line: **Make Your Own Travel Safely**
- Founder named on the site: **Mr. Bijan Kumar Muduli**
- Site-stated affiliations/claims: government-recognized travel agent; members/associations named include IATO, ADTOI, ATOAI, ITTA, and TOFTigers.
- Homepage claim: recognized by the Ministry of Tourism, Government of India; authorized to operate in PVTG areas; accredited by Odisha Tourism, Government of Odisha.
- Channel offices listed: Delhi, Mumbai, Kolkata, Hyderabad, Bengaluru, Chennai, Ahmedabad, and Guwahati.

### Contact details

**Head office**

Eastern Risen Expedition Pvt. Ltd.  
Plot No. 2382/9794 (First Floor), Elegance Villa  
Lane 03, Near Puri ByPass, NH-316  
Badagada Brit Colony, PS-Badagada  
Bhubaneswar 751018, Khurda, Odisha, India

- Mobile: 09777564596, 09777564695
- Email: info@easternrisen.com
- Website: www.easternrisen.com

**Guwahati office**

Eastern Risen Expedition Pvt. Ltd.  
2nd Floor, Hamtola  
Kamakhya Dham  
Guwahati 781010

- Telephone as printed: +9777564695
- Email: bijan@easternrisen.com

Note: the Guwahati telephone appears anomalous because `+977` is Nepal's country code; this should be verified before reuse.

### Services

- Inbound and domestic tour operation (page contains only navigation/category links, no descriptive copy)
- Car rental: site says it provides ground transport across India using Indica, Indigo, Innova, Honda City, Corolla, Tempo Traveller, and mini coaches, with trained uniformed chauffeurs.
- Air ticketing: domestic and international airline tickets, with travel-documentation support.
- Travel documentation (page exists but contains no descriptive content)

### Languages and forms

- Google Translate options shown: French, German, Hindi, Italian, Malay, Spanish, and Thai.
- Site search: Google site-search form.
- User login: username and password, posted over HTTP.
- Online enquiry: name, email, country, mobile, and enquiry details, posted to `/enq.asp` over HTTP.
- Homepage visitor counter observed: **488451**.

## Published tour catalog

Spellings and route names below largely preserve the site's wording so data problems remain visible.

### Odisha (9)

1. Odisha Golden Triangle — 3 nights/4 days — Bhubaneswar, Konark, Chilika (Satapada), Puri
2. Odisha Golden Triangle-1 — 4 nights/5 days — Bhubaneswar, Ratnagiri, Lalitgiri, Udaygiri, Pipli, Konark, Puri
3. Odisha Golden Triangle-II — 4 nights/5 days — Bhubaneswar, Chilika (Satapada), Puri
4. Eastern Nature Tour — 3 nights/4 days — Bhubaneswar, Lalitgiri, Ratnagiri, Udayagiri, Bhitarkanika NP
5. Eastern Nature Tour-I — 5 nights/6 days — same core Buddhist circuit and Bhitarkanika route
6. Odisha Nature Tour — 8 nights/9 days — Bhubaneswar, Buddhist circuit, Bhitarkanika NP, Satkoshia, Bhubaneswar
7. Odisha Dream Destination — 5 nights/6 days — Bhubaneswar, Puri, Chilika, Taptapani
8. Western Odisha "Glipms" — 4 nights/5 days — Sambalpur, Nrusinghanath, Harishankar, Debrigarh WLS
9. Odisha Wildlife Tour — 7 nights/8 days — Bhubaneswar, Bhitarkanika NP, Similipal NP, Chandipur

### India regional tours (18)

**North India**

1. Leh-Ladakh — 5 nights/6 days — Leh, Khardongla Pass, Alchi, Uletokpo, Lamayuru
2. Heavenly Himachal — 6 nights/7 days — Chandigarh, Shimla, Kullu, Manali
3. Holy Vaishnodevi — 4 nights/5 days — Jammu, Katra, Vaishnodevi, Patnitop
4. Splendid Kashmir — 5 nights/6 days — Srinagar, Pahalgaon, Gulmarg, Sonmarg
5. Golden Triangle — 6 nights/7 days — Delhi, Jaipur, Agra

**South India**

6. Southern Heritage — 11 nights/12 days — Bengaluru, Hassan, Mysore, Trichy, Tanjore, Madurai, Kancheepuram, Mahabalipuram, Chennai
7. Exotic Kerala — 8 nights/9 days — Cochin, Munner, Thekkady, Allepy

**Northeast/Sikkim**

8. Sikkim Tour — 6 nights/7 days — Darjeeling, Gangtok, Lachung, Yumthang, Kalimpong
9. Eastern Himalayan-I — 2 nights/3 days — Gangtak, Darjeeling
10. Eastern Himalayan-II — 5 nights/6 days — Gangtak, Darjeeling, Kalimpong
11. Sikkim Delight — 10 nights/11 days — Gangtak, Lachung, Yumthang, Pelling, Kalimpong, Darjeeling

**East India**

12. Eastern Art & Craft — 10 nights/11 days — Bhubaneswar, Nuapatana, Dhenkanal, Ratnagiri, Lalitgiri, Chandipur, Cuttack, Puri, Chilika, Gopalpur, Taptapani
13. Eastern Wild Adventure — 9 nights/10 days — Bhubaneswar, Bhitarkanika NP, Similipal NP, Chandipur
14. Coast Odisha — 10 nights/11 days — Bhubaneswar, Bhitarkanika NP, Konark, Puri, Chilika, Gopalpur, Taptapani

**West India**

15. Vibrant Gujrat-I — 6 nights/7 days — Ahmedabad, Dwaraka, Porbandar, Somnath, Sasangir, Junagarh
16. Vibrant Gujrat-II — 9 nights/10 days — Ahmedabad, Dwaraka, Porbandar, Somnath, Diu, Sasangir, Junagarh, Mount Abu

**Central India**

17. Central Exotic — 14 nights/15 days — Bhopal, Sanchi, Mandu, Indore, Ujjain, Shivpuri, Gwalior, Orchha, Bandhavgarh, Jabalpur, Bhedaghat, Kanha NP, Pachmarhi, Pench, Nagpur
18. Central Nature's Treasure — 10 nights/11 days — Jabalpur, Bandhavgarh, Kanha, Pachmarhi, Pench, Nagpur

### Wildlife, tribal, spiritual, Buddhist, adventure and festivals (26)

**Wildlife**

1. North East Wildlife Tour — 8 nights/9 days — Guwahati, Manas NP, Hajo, Sualkochi, Kaziranga NP, Majuli, Jorhat
2. Odisha Wildlife Tour-II — 8 nights/9 days — Odisha Buddhist circuit, Bhitarkanika NP, Satkoshia, Bhubaneswar
3. Odisha Wildlife Tour-I — 7 nights/8 days — Bhubaneswar, Bhitarkanika NP, Similipal NP, Chandipur
4. Gujrat Wildlife Tour — 16 nights/17 days — Bhuj, Nakhatrana, Jamnagar, Porbandar, Bhavnagar, Dasada, Balaram, Ahmedabad
5. Central Wildlife Tour-I — 13 nights/14 days — Delhi, Nagpur, Tadoba NP, Kanha NP, Bandhavgarh NP, Khajuraho, Jhansi, Agra, Bharatpur

**Tribal**

6. Arunachal Tribal Tour-I — 9 nights/10 days — Guwahati, Tezpur, Ziro, Daporijo, Along, Pasighat, Dibrugarh
7. Arunachal Tribal Tour-II — 5 nights/6 days — Dibrugarh, Along, Daporijo, Ziro, Nameri, Tejpur, Guwahati
8. Nagaland Tribal Tour-I — 5 nights/6 days — Dimapur, Kohima, Khonoma, Touphema, Mokokchung, Mon, Longwa, Langmeang, Dibrugarh
9. Odisha & Chhattisgarh Tribal Tour — 10 nights/11 days — Bhubaneswar, Konark, Puri, Chilika, Gopalpur, Rayagada, Jeypore, Jagdalpur, Raipur
10. Gujrat Tribal Tour — 14 nights/15 days — Mumbai, Saputara, Varoda/Vadodara, Chotta Udepur, Ahmedabad, Poshina, Modhera, Dasada, Zainabad, Bhuj
11. Tribal Itinerary — 14 nights/15 days — route omitted on summary page

**Buddhist/spiritual**

12. Northern Buddhist Tour — 8 nights/9 days — Delhi, Gaya, Bodhgaya, Rajgiri, Nalanda, Varanasi, Gorakhpur, Kushinagar, Lumbini, Agra
13. Eastern Buddhist Tour — 10 nights/11 days — Bhubaneswar, Chandragiri, Ratnagiri, Lalitgiri, Udayagiri, Konark, Gangtak, Darjeeling
14. Shaman Tour — 9 nights/10 days — Delhi, Guwahati, Kolkata, Bhubaneswar, Konark, Puri
15. Yoga and Meditation Tour — 8-day Bhubaneswar/Puri program with ashrams, yoga, Buddhist sites, Konark and Chilika; no duration field is printed.

**Adventure/special interest**

16. Adventure & Trekking Tour-I — 15 nights/16 days — Gangtok, Lachen, Tallem, Jakthang, Yabuk, Darjeeling
17. Eastern Textile Tour — 10 nights/11 days — Bhubaneswar, Nuapatana, Dhenkanal, Sonepur, Sambalpur, Bargad, Bolangir, Baliguda, Berhampur, Gopalpur, Chilika
18. Bike Safari Tour-I — 14 nights/15 days — Delhi, Manali, Keylong, Sarchu, Leh, Pangong, Nubra Valley, Kargil, Srinagar, Patnitop, Jammu
19. Ladakh Tour-I — 5 nights/6 days — detailed Leh/monasteries/Alchi/Uletokpo/Lamayuru/Khardongla itinerary; destination field is blank.
20. Amarnath Yatra-III — 3 nights/4 days (summary formatting is broken)
21. Amarnath Yatra-IV — 2 nights/3 days

**Tribal festivals**

22. Si-Donyi & Torgya Festival — 19 nights/20 days — Tagin and Monpa
23. Reh & Boori Boot Festival — 18 nights/19 days — Adi Mishmi and Hill Miri
24. Mopin & Sangken Festival — 18 nights/19 days — Gallong and Khampti
25. Hornbill Festival itinerary I — 8 nights/9 days — Guwahati, Kaziranga, Dimapur, Kohima, Touphema, Mokokchung, Jorhat
26. Hornbill Festival itinerary II — 10 nights/11 days — Guwahati, Jorhat, Mon, Mokokchung, Touphema, Kohima, Kaziranga NP

### Neighbouring countries (19) and outbound holidays (4)

**Nepal (9)**

1. Kathmandu Culture Tour — 3 nights/4 days — Kathmandu, Patan
2. Kathmandu Culture Tour-I — 4 nights/5 days — Kathmandu, Patan
3. Kathmandu-Nagarkot Tour — 4 nights/5 days — Kathmandu, Nagarkot, Bhaktapur
4. Kathmandu-Pokhara Tour — 5 nights/6 days — Kathmandu, Pokhara
5. Pashupatinath & Muktinath Tour — 5 nights/6 days — Kathmandu, Pokhara, Jomsom
6. Pashupatinath & Muktinath Tour-I — 6 nights/7 days — Kathmandu, Pokhara, Jomsom
7. Kathmandu Nature Tour — 7 nights/8 days — Kathmandu, Pokhara, Jomsom
8. Kathmandu Nature Tour with Lumbini — 7 nights/8 days — Kathmandu, Chitwan NP, Lumbini, Pokhara
9. Muktinath Darsha — 3 nights/4 days — Kathmandu, Jomsom, Pokhara

**Sri Lanka (5)**

10. Sri Lanka Tour-I — 2 nights/3 days — Colombo, "Kany"
11. Sri Lanka Tour-II / Shankari Devi — 3 nights/4 days — Colombo, Kandy, Beruwela
12. Sri Lanka Tour-III — 5 nights/6 days — Colombo, Dambulla, Trincomalee, Kandy, Nuwara Eliya
13. Sri Lanka Tour-IV — 5 nights/6 days — "Colomb", Dambulla, Kandy, Nuwara Eliya
14. Sri Lanka Tour-V — 2 nights/3 days — destination field blank

**Bhutan (4)**

15. Bhutan Tour-I — 4 nights/5 days — Paro, Thimphu, Paro
16. Bhutan Tour-II — 5 nights/6 days — Paro, Thimphu, Wangdi
17. Bhutan Tour-III — 6 nights/7 days — Paro, Thimphu, Wangdi
18. Bhutan Tour-IV — 8 nights/9 days — Paro, Thimphu, Punakha, Wangdi, Bumthang

**Tibet (1)**

19. Tibet Tour-I — 7 nights/8 days — Kathmandu, Nyalam, Lhatse, Xigatse, Gyantse, Lhasa

**Southeast Asia (4)**

- Amazing Thailand — 4 nights/5 days — Bangkok, Safari World/Dream World, Pattaya, Coral Island
- Magical Malaysia — 3 nights/4 days — Kuala Lumpur, Genting Highlands
- Singapore Delight — 3 nights/4 days — Singapore, Jurong Bird Park
- Experience Malaysia & Singapore — 6 nights/7 days — Kuala Lumpur, Singapore, Sentosa Island

The site therefore exposes at least **76 named packages/programs** in its summary and standalone itinerary pages, plus multiple detailed variants and full day-by-day itinerary pages.

## Linked sustainability document

The linked two-page, image-only PDF is titled **Pledge for Our Commitment to Sustainable Tourism** and bears the Adventure Tour Operators Association of India (ATOAI) branding. It pledges responsible citizenship, sustainable workplace and tourism practices, environmental and heritage protection, local-community benefit, sustainable resource use, and ethical business benefiting culture and heritage. It is signed for **Bijan Kumar Muduli / Eastern Risen Expedition**, dated **21 January 2013**, with an Eastern Risen stamp and the printed name/signature of ATOAI president Tejbir Singh Anand.

PDF technical metadata: created/modified 25 January 2013; Adobe Acrobat 6.0 Image Conversion Plug-in; 2 pages; PDF 1.3; untagged; image-only; no forms, JavaScript, or encryption.

## Page and content inventory

### Primary/company pages

- `/` and `/default.asp` — homepage
- `/about.asp` — company/founder narrative
- `/contact.asp` — office/contact details
- `/photo_gallery.asp` and `?page=2` — gallery entries, including "Happy New Year-2012", "With Tribals", "01", and "Welcome..."
- `/disclaimer.asp` — heading only; no policy text
- `/privcy_pol.asp` — heading only; no policy text
- `/terms_use.asp` — heading only; no terms text
- `/feedback.asp` — heading only; no feedback mechanism/content
- `/ATOAI1.pdf` — sustainability pledge

### Service pages

- `/Service/inbound_domstic_tour.asp`
- `/Service/car_rental.asp`
- `/Service/air_ticketing.asp`
- `/Service/travel_docum.asp`
- A Buddhist-tour link incorrectly points to `/Service/budhist_tour.asp`, while the working tour page is `/Tour/budhist_tour.asp`.

### Tour sections and detailed itinerary pages

- India regions: north (overview + 5 itineraries), south (overview + 2), northeast (overview + 4), east (overview + 3), west (overview + 2), central (overview + 2).
- Odisha: overview + 9 detailed packages.
- Wildlife: overview + 5 detailed packages.
- Sri Lanka: overview + 5 detailed packages.
- Nepal: overview + 9 detailed packages.
- Bhutan: overview + 4 detailed packages.
- Tibet: 1 full itinerary.
- Amarnath Yatra: overview + 4 itinerary pages.
- Tribal: overview + Arunachal I/II, Nagaland, Odisha/Chhattisgarh, Gujarat, and a general tribal itinerary.
- Buddhist: overview + 2 detailed itineraries.
- Tribal festivals: overview + Si-Donyi/Torgya, Reh/Boori Boot, Mopin/Sangken, and two Hornbill itineraries.
- Standalone: Thailand, Malaysia, Singapore, Malaysia/Singapore, Eastern Textile, Adventure & Trekking, Ladakh, Bike Safari, Spiritual/Shaman, and Yoga/Meditation.

## Technical and UX findings

### Critical

1. **HTTPS is broken.** `https://www.easternrisen.com/` fails certificate validation with `ERR_CERT_COMMON_NAME_INVALID`.
2. **Sensitive forms use HTTP.** Login credentials and enquiry/contact details can be transmitted without transport encryption.
3. **Three unsupported Flash modules dominate key homepage space:** `easternrisen_banner.swf`, `holiday_aboard.swf`, and `car_rental1.swf`. Visitors see "Adobe Flash Player is no longer supported."

### High impact

4. Fixed approximately 1002-pixel table layout; not a modern responsive layout and likely requires horizontal zoom/scroll on phones.
5. Every inspected page uses the same generic title, `:: Welcome to Eastern Risen ::`; no page-specific title strategy.
6. Homepage has no H1-H6 headings, no `lang` attribute, and no viewport meta tag.
7. Only 1 of 63 homepage images has non-empty alt text; 21 of 61 links have no text/accessible label.
8. No meta description, Open Graph, canonical, or other modern discoverability/social metadata was observed; only an ISO-8859-1 content-type meta tag.
9. The disclaimer, privacy policy, terms, feedback, travel-documentation, and inbound-operation pages are empty or nearly empty despite being linked as substantive pages.

### Maintenance/content quality

10. Dated dependencies and patterns: Classic ASP URLs, jQuery 1.11.3, a Sothink DHTMLMenu script marked 2007, Jssor slider, table-based layout, image-based controls, and Flash.
11. Dated/dead social presence: Google+ link and icon remain; Twitter is misspelled in an asset filename (`twiter.gif`).
12. Frequent spelling and editorial errors: "Tourisim", "Srilanka", "Tiebt", "Commendation", "Inforamation", "Thiland", "Gujrat", "Glipms", "Gangtak", inconsistent night/day formatting, inconsistent capitalization, and blank route fields.
13. Navigation conflict: the Buddhist tour is linked both correctly under `/Tour/` and incorrectly under `/Service/`.
14. Gallery contains a malformed link to `/admin/big_img_upload/NO`.
15. Search posts to Google over HTTP and relies on a legacy site-search pattern.
16. The homepage visually gives large, prime areas to broken Flash and a login box, while the most persuasive material—expertise, accreditations, reviews, clear packages, and enquiry CTA—is fragmented below the fold.

## What is good

- Deep inventory of real itinerary content; many pages include day-by-day routes and practical sequencing.
- Strong specialization in Odisha, northeast India, wildlife, tribal/cultural travel, Buddhism, trekking, and neighbouring countries.
- Clear physical addresses, phone numbers, and email addresses.
- Sustainability/community-benefit language is consistent between the About page and ATOAI pledge.
- The brand has potentially valuable trust signals and associations, though each should be freshly verified before being reused.

## Recommended priorities

1. Fix DNS/SSL and enforce HTTPS everywhere before accepting any form submission.
2. Remove or disable the public login until it is secured and demonstrably needed.
3. Replace the site with a responsive, accessible implementation; migrate every itinerary into structured tour data rather than copying the old markup.
4. Preserve the tour catalog and day-by-day content, but professionally edit names, facts, routes, dates, and spelling.
5. Verify and refresh accreditations, office details, phone numbers, emails, and memberships.
6. Add complete privacy, terms, cancellation/refund, booking, accessibility, and enquiry-consent content.
7. Replace Flash hero/service modules, dead social links, and image buttons; add a clear enquiry/WhatsApp/call CTA.
8. Give each tour a unique title, description, canonical URL, semantic heading structure, image alt text, current photos, and structured data.
9. Redirect old `.asp` URLs to clean new URLs so existing links and any remaining search equity are preserved.

## Bottom line

The business content is worth saving; the current presentation is not. The strongest redesign direction is a modern, trust-first specialist travel site built around searchable tour collections, strong Odisha/niche-tour positioning, genuine credentials, edited itinerary pages, clear enquiry flows, and secure mobile-first performance.
