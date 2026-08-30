/**
 * SDCP backend
 * ---------------------------------------------------------------
 * Deploy this as a Web App (see README.md). It receives a file
 * (as base64 text) from the static site and saves it into the
 * Google Drive folder that matches the chosen section.
 *
 * SETUP:
 * 1. Create/locate a Drive folder for each section (M13...D18).
 * 2. Open each folder, copy the ID from its URL:
 *      https://drive.google.com/drive/folders/<THIS_PART_IS_THE_ID>
 * 3. Paste each ID below.
 * 4. Deploy > New deployment > Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the deployment URL into config.js on the static site.
 * ---------------------------------------------------------------
 */

const FOLDER_IDS = {
  M13: "1KXC-MwgG_pGT8HqU9nPxMJ33NRH6vFhA",
  M14: "1Ec2_x6sQnYmJnAfMevpRZfdqYReEjTME",
  M15: "1yUb2wiNuVG8AXGL1VefvSmtDB65_4ISh",
  M16: "1bCVJFIQfSy1m8cKMHBLMC-8SgREmZeGC",
  M17: "1PlT7CQPxoijQYKyakhkSpTTatPHmsq62",
  M18: "1lyTE8hnNYRtxdTMzKSNiI6B66v1UeAIU",
  D13: "1YVY0xym24lYbdakvtIZ3AIB7ckMpNh9U",
  D14: "1JkH7j2lSq2-uty2falCm-3rogZ2CRrrK",
  D15: "1gZwgZqefJm3IMfaL-YoGpVd-eXa_SpFK",
  D16: "1eRBxntNsqXi9wYC3fX-2JS4KA66t3sYq",
  D17: "1HzkwM8Di4HT6j4PiXtnxK6-Y0eX6XErh",
  D18: "1INgfWYc9XSJFxG4feDIboioEDpwnOM7j",
};

// Keep this in sync with MAX_FILE_SIZE_MB in config.js on the site.
const MAX_FILE_SIZE_MB = 15;

function doPost(e) {
  try {
    const section = e.parameter.section;
    const filename = e.parameter.filename;
    const mimeType = e.parameter.mimeType || "application/octet-stream";
    const fileData = e.parameter.fileData;

    if (!section || !FOLDER_IDS[section] || FOLDER_IDS[section].indexOf("PASTE_FOLDER_ID") === 0) {
      return jsonResponse({ success: false, error: "This section isn't configured yet. Contact your teacher." });
    }
    if (!filename || !fileData) {
      return jsonResponse({ success: false, error: "No file was received." });
    }

    const bytes = Utilities.base64Decode(fileData);
    const sizeMB = bytes.length / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return jsonResponse({ success: false, error: "File exceeds the " + MAX_FILE_SIZE_MB + "MB limit." });
    }

    const folder = DriveApp.getFolderById(FOLDER_IDS[section]);
    const safeName = sanitizeFilename(filename);
    const blob = Utilities.newBlob(bytes, mimeType, safeName);
    folder.createFile(blob);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: "Server error: " + err.message });
  }
}

// Optional: lets you sanity-check the deployment by visiting the
// Web App URL directly in a browser.
function doGet() {
  return ContentService
    .createTextOutput("SDCP upload endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function sanitizeFilename(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, "-");
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
