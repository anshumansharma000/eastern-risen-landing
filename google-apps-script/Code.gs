const SHEET_NAME = "Tour enquiries";
// Copy this value from the Sheet URL between `/d/` and `/edit`.
const SPREADSHEET_ID = "REPLACE_WITH_SPREADSHEET_ID";

const COLUMNS = [
  "Received at",
  "Full name",
  "Email",
  "Phone / WhatsApp",
  "Country",
  "Preferred contact method",
  "Preferred travel dates",
  "Adults",
  "Children",
  "Interests / changes",
  "Requirements",
  "Additional notes",
  "Tour",
  "Region",
  "Duration",
  "Page URL",
];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");

    // Quietly accept likely bot submissions without adding them to the sheet.
    if (data.website) return jsonResponse({ ok: true });

    if (!data.fullName || !data.email || !data.phone || !data.country ||
        !data.contactMethod || !data.travelDates || !data.tourTitle) {
      return jsonResponse({ ok: false, error: "Missing required fields" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);

      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
      }

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(COLUMNS);
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        new Date(),
        safeCell(data.fullName),
        safeCell(data.email),
        safeCell(data.phone),
        safeCell(data.country),
        safeCell(data.contactMethod),
        safeCell(data.travelDates),
        safeCell(data.adults),
        safeCell(data.children),
        safeCell(data.interests),
        safeCell(data.requirements),
        safeCell(data.additionalNotes),
        safeCell(data.tourTitle),
        safeCell(data.region),
        safeCell(data.duration),
        safeCell(data.pageUrl),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Unable to save enquiry" });
  }
}

// Prevent spreadsheet formulas from being injected through public form fields.
function safeCell(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
