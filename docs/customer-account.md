# Customer account area

The existing static Next.js website now serves `/account/` as a client-only account shell. No additional frontend deployment or staff endpoints are used. Public marketing/enquiry pages and `/quote/:token/` stay independent; quote links never require customer login and never grant membership.

## Configuration and hosting

- Set `NEXT_PUBLIC_CUSTOMER_API_BASE_URL` to the actual API origin (HTTPS in production), optionally ending in `/api/v1`. Customer requests append `/api/v1/customer` exactly once. If unset, the existing `NEXT_PUBLIC_QUOTE_API_BASE_URL` origin is used; that quote setting remains an origin without a path. Public variables are compiled into the static build: rebuild after changing them.
- Account routes use the fixed `/account` base: `login`, `activate`, `forgot-password`, `reset-password`, `bookings`, `bookings/:bookingId`, `billing`, `billing/:invoiceId`, and `profile`.
- Deploy `out/` on the existing host. `public/_redirects` rewrites `/account/*` to `/account/` with status 200; the original quote rewrites are retained. Equivalent local Next rewrites are included. Hosts that do not consume `_redirects` must configure these rewrites themselves; they are required for hard refreshes and email links.
- Preserve `_headers`: `/account/` and `/account/*` use `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, and no-index headers. Account metadata also disables indexing/referrers. Apply equivalent host rules where `_headers` is not supported. Do not apply CDN/offline/service-worker caching to customer APIs. This repository has no service worker. Static account HTML contains no customer records; records are fetched only in the browser with `cache: 'no-store'`.
- Configure backend credentialed CORS with this website's exact origin, `Access-Control-Allow-Credentials: true`, required methods and `Content-Type`. A wildcard origin cannot support credentialed sessions. Expose `x-request-id` and `Retry-After` for browser-readable support/rate-limit information. Error-body request IDs work even without exposed headers; unreadable Retry-After uses a conservative 60-second wait.
- Backend origin allowlists must allow customer mutations from the website. The browser manages the separate HttpOnly customer cookie; production cookie domain, Secure and SameSite settings must work across the deployed website/API origins. Verify customer and staff sessions coexist and customer logout leaves staff signed in. No staff login/logout calls or bearer tokens are used here.

## Invitations, mail and payments

Align the backend `CUSTOMER_ACCOUNT_URL` with the actual website account base, for example `https://easternrisen.co.in/account`. Verify the generated invitation URL ends in `/activate#token=…` and recovery URL in `/reset-password#token=…` (including the backend's expected slash handling). Tokens must remain in fragments. The frontend captures them in memory and removes the fragment; after a reload users may need to reopen the original email link. Opening another invitation in the same tab is supported.

Before launch, staff must deploy the backend migration, link named contacts to existing customers, and issue invitations. No automatic registration, ownership matching or public resend endpoint was added. Configure and test recovery/invitation mail delivery and sender/domain settings. A 202 recovery response means the request was accepted, not that email was delivered; `CUSTOMER_RECOVERY_UNAVAILABLE` shows contact assistance.

Use the existing `NEXT_PUBLIC_CASHFREE_MODE` (`sandbox` or `production`) and Cashfree v3 modal helper. Provider secrets and payment sessions originate on the backend. Keep existing public-link provider return URLs unchanged. Verify the backend's account return URL targets the account booking page if a provider redirects/reloads. Only scoped identity/customer/booking/order identifiers are retained in session storage for status checks; session IDs, tokens, records and passwords are not retained. Customer logout, expired-session handling, reset and login clear account order contexts independently of public-link orders.

After checkout closes, reconciliation runs on the customer API and refreshes the booking. PENDING receives at most three automatic retries (10/20/30 seconds) after the initial check, followed by manual Check payment status/Refresh. Rate-limit errors stop automatic checks and transport blocks early retry. PAID is shown only from the backend; review/ambiguous checkout states block new collection and offer contact assistance. Reloading always re-fetches balances; stored order context is optional.

## Privacy and behaviour

All private text is escaped React content. Money is formatted directly from decimal strings, including large amounts; server subtotal/tax/total/adjustment values are never recomputed. Date-only values retain their calendar date; timestamps display in Asia/Kolkata. Profile names never replace immutable invoice document identity. Billing does not infer booking relationships, aggregate a paginated account balance, or fabricate document/download/payment endpoints. Browser Print uses safe invoice snapshots.

Only a preferred customerId is stored locally and is revalidated against `/accounts`. Session/record state stays in memory. Account switches, logout, 401, membership changes and identity changes abort/invalidate previous requests. Focus/visibility changes revalidate identity and memberships; record ownership 404s remove the record and refresh memberships. Lists use page/pageSize only. Analytics does not initialise on account or quote routes, and marketing account links use full-page navigation to avoid carrying tracking into sensitive routes.

## Verification

Run `npm run lint` and `npm test` (production export plus all Node tests). Focused customer tests cover credentialed/no-store transport, 204, validation paths, invalid credentials versus session expiry, new/existing invitation contracts, fragment cleanup, preferred-account validation/revocation, aborted late responses, redirect validation, exact money/null dates, displayed quote versions, paid/cancelled/review restrictions, reconciliation states/backoff, invoice-only pagination, recovery/service/HTML/rate-limit failures and isolated return-order storage. Existing public quote/payment and marketing export tests are retained.

Browser QA used an isolated local API with synthetic test-only records, never deployed production records: customer switching, null travel dates, stale quote replacement requiring a new unchecked confirmation, invoice-only/cancelled history, immutable invoice data/escaped text/bank numbers/receipts, activation new versus current-password forms, expired invitation assistance, fragment removal including a second invitation in the same tab, and a 390px mobile invoice layout.

Not verified against a live customer session/provider: production CORS/cookies, staff-cookie coexistence, invitation and recovery email delivery, actual backend membership revocation, simultaneous account/link checkout order reuse, and provider callbacks. Complete these launch checks using staff-issued accounts and backend-approved sandbox fixtures; automated tests do not charge real money. No deployment was performed.

## Invoice print layout

The account invoice's Print action uses a separate A4 document styled to match the supplied admin invoice reference: company letterhead, taxable/non-taxable service tables, tax summary, amount in words, payment notes, authorised signature, bank details and accreditation strip. Screen views retain the website's account design. The supplied artwork lives at `public/invoice/er-signature.png` and `public/invoice/footer-logos.jpg`; the existing dark Eastern Risen logo is reused. Draft and cancelled copies are explicitly labelled and omit the signature.

The customer invoice snapshot may optionally include company `phone`, `mobileNumber`, `email`, `pan`, `serviceTaxNumber` and `cin`, plus invoice `serviceCategory: { name, code }`, `serviceProvidedAt`, `placeOfSupplyState`, `placeOfSupplyCountry` and `passengerCount`. The customer API must return these fields to reproduce the complete letterhead and service metadata. Older payloads still print the supplied identity, amounts and bank details; missing fields are omitted. No reference-document customer data, company registration values or bank numbers are hardcoded, and no staff endpoints are queried.

Grand total and total tax come directly from the invoice snapshot. Printed section subtotals and grouped component/rate tax rows use exact decimal-string arithmetic; the amount in words uses the same authoritative total. Print CSS repeats table headings and avoids splitting service rows, totals, bank details and signature blocks. Browser-controlled date/title/URL/page-number headers depend on the user's print settings.

Verified locally with synthetic one-page and 45-line, three-page invoices in Chrome print preview, including the uploaded images and final-page totals. Invoice print tests cover exact decimal sums, component/rate grouping and Indian rupee amount wording.
