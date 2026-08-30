/**
 * SDCP configuration
 * ---------------------------------------------------------------
 * 1. APPS_SCRIPT_URL
 *    After you deploy the Apps Script (see apps-script/Code.gs and
 *    the README) as a Web App, paste the deployment URL here.
 *    It looks like:
 *    https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
 *
 * 2. SECTIONS
 *    One entry per button on the landing page. "id" must match the
 *    key you use in the Apps Script FOLDER_IDS map exactly.
 *    "group" controls the color: "M" = orange, "D" = blue.
 * ---------------------------------------------------------------
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzoHn8UQAGFxAcQ87QSHoLFo2YkShqFSsWHDOGYSHNHbCIhbWxZSJC9dOlyJ433395g/exec";

const SECTIONS = [
  { id: "M13", group: "M" },
  { id: "M14", group: "M" },
  { id: "M15", group: "M" },
  { id: "M16", group: "M" },
  { id: "M17", group: "M" },
  { id: "M18", group: "M" },
  { id: "D13", group: "D" },
  { id: "D14", group: "D" },
  { id: "D15", group: "D" },
  { id: "D16", group: "D" },
  { id: "D17", group: "D" },
  { id: "D18", group: "D" },
];

// Maximum upload size in megabytes. Keep this in sync with
// MAX_FILE_SIZE_MB in apps-script/Code.gs.
const MAX_FILE_SIZE_MB = 15;

// Accepted file types (comma separated, used on the <input type="file">).
// Leave as "*" to accept anything.
const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
