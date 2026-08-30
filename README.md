# Student's Document Collection Portal (SDCP)

A static site (GitHub Pages friendly) that lets students upload a document
straight into the correct Google Drive folder for their section — no Google
sign-in, no manual drive navigation.

## Why it needs one extra piece

A plain static site cannot write files into Google Drive on its own — Drive
only accepts uploads from an authenticated request, and that authentication
can't safely live in front-end code that anyone can view. The fix here is a
**Google Apps Script Web App**: a small script hosted for free on Google's
infrastructure, running under *your* Google account. Your site stays 100%
static; it just calls this script instead of talking to Drive directly.

```
Student's browser  --(file)-->  Apps Script Web App  --(saves)-->  Drive folder
   (GitHub Pages)                  (runs as you)
```

## 1. Create the Drive folders

Make one Drive folder per section (M13–M18, D13–D18) — or reuse folders you
already have. For each folder, open it and copy the ID out of the URL:

```
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
                                        \_______________________/
                                              this is the ID
```

## 2. Set up the Apps Script backend

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the placeholder code and paste in the contents of
   `apps-script/Code.gs`.
3. Replace every `PASTE_FOLDER_ID_FOR_...` with the real folder ID from
   step 1.
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize the permissions it asks for (this is you
   granting the script access to your own Drive), and copy the
   **Web app URL** it gives you — it ends in `/exec`.

You can re-run **Deploy → Manage deployments → Edit → New version** any time
you change the script (e.g., adding folder IDs later).

## 3. Connect the site to the script

Open `config.js` and paste your Web app URL:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

## 4. Publish on GitHub Pages

1. Create a new GitHub repo and push `index.html`, `style.css`, `script.js`,
   and `config.js` to it (the `apps-script/` folder is just for reference —
   it doesn't need to go live, only into the Apps Script editor).
2. Repo **Settings → Pages → Deploy from a branch** → pick `main` / `root`.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## How it behaves

- Landing page shows the 12 section buttons from `config.js`.
- Tapping one opens the upload screen for that section.
- Selecting a file enables **Submit**; **Clear** resets the selection.
- On submit, the file is uploaded to the Apps Script, which drops it into
  the matching Drive folder, and the student sees a thank-you screen.

## Limits and things to know

- **File size:** capped at 15MB by default (`MAX_FILE_SIZE_MB` in both
  `config.js` and `Code.gs` — keep them equal). Base64 encoding adds ~33%
  overhead in transit, so this leaves headroom under Apps Script's quotas.
- **File types:** restricted to PDF/DOC/DOCX/JPG/PNG by default via
  `ACCEPTED_FILE_TYPES` in `config.js`. Change or clear it as needed.
- **No student identity check:** anyone with the site link can upload to any
  section — there's no login. If you need to know *who* submitted, add a
  "Name / Roll number" field to the form (ask and I can add this).
- **Renaming files:** right now files keep the student's original filename.
  If two students upload `assignment.pdf` to the same folder, the second
  will show up as a separate file with the same name (Drive allows
  duplicate names). Say the word if you'd like automatic renaming, e.g. to
  `<student name>_<timestamp>.pdf`.

## Troubleshooting

- **"Could not reach the server"** — double-check `APPS_SCRIPT_URL` in
  `config.js`, and that the Apps Script is deployed with access set to
  **Anyone**.
- **Files aren't appearing in Drive** — open the Apps Script project →
  **Executions** (left sidebar) to see error logs from real submissions.
- **Re-deploying after edits** — editing `Code.gs` alone doesn't update the
  live URL. Use **Manage deployments → Edit → New version** each time.