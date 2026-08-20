# Tour enquiry storage in Google Sheets

The tour form can send enquiries directly from this static site to a Google Sheet through a Google Apps Script web app. No Google credentials or private sheet access are exposed in the website.

## One-time setup

1. Create the destination Google Sheet in the Google account that should own the enquiries.
2. In that Sheet, open **Extensions → Apps Script**.
3. Replace the editor contents with [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. In the pasted code, replace `REPLACE_WITH_SPREADSHEET_ID` with the part of the Sheet URL between `/d/` and `/edit`, then save the project. Apps Script web apps cannot rely on an “active” spreadsheet, so the ID is required; it is an identifier, not a secret credential.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and approve the requested permission.
7. Copy the deployment URL ending in `/exec`.
8. Copy `.env.example` to `.env.local`, replace the placeholder with that URL, and rebuild the site. Set the same environment variable in the production build environment.
9. Submit one test enquiry. The script will create a **Tour enquiries** tab and its header row automatically.

If the Apps Script code is changed later, use **Deploy → Manage deployments → Edit**, select **New version**, and deploy it. Keep the existing deployment URL unless Google explicitly issues a new one.

## Operational notes

- Keep the spreadsheet private and give access only to staff who handle enquiries.
- The endpoint is necessarily public because the static browser submits to it. The included honeypot filters simple bots, but it is not full abuse protection. If spam becomes material, move submission behind a serverless function with rate limiting or CAPTCHA.
- Apps Script does not expose a browser-readable response for this cross-origin static submission. The form can detect a network failure, but it cannot independently confirm that a row was appended. Check the Sheet after the first production test.
