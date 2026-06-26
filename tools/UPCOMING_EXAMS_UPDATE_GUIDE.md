# Upcoming Exams — Manual Update Guide

This guide explains how to safely maintain `public/data/upcoming-exams.json` for the TAIPOQ **Upcoming Exams** page (`/upcoming-exams`).

## Policy (important)

- **Official sources only** — use government commission, board, or department websites/PDFs.
- **Do not** use coaching sites, private job portals, Telegram/WhatsApp links, or unverified aggregators as `officialSourceUrl`.
- **No auto-scraping** — all updates are manual edits to the JSON file.
- If an exam is **not verified** from an official source, keep `"active": false` so it stays hidden on the website.

The app loads `/data/upcoming-exams.json` and shows only rows where `active` is `true`. Invalid rows are skipped by the parser.

---

## 1. Add a new exam

1. Open `public/data/upcoming-exams.json`.
2. Add a new object inside the `exams` array with **all required fields**:

   | Field | Notes |
   |-------|--------|
   | `id` | Unique slug, e.g. `"rrb-ntpc-2026"` |
   | `examName` | Display name |
   | `department` | e.g. `"Central — RRB"` |
   | `qualification` | As per official notification |
   | `notificationWindow` | Notification timing text |
   | `examWindow` | Exam schedule text |
   | `typingRequired` | Typing/skill test note |
   | `status` | Current status from official source |
   | `officialSourceLabel` | Short label, e.g. `"RRB Official"` |
   | `officialSourceUrl` | **HTTPS** official link only |
   | `prepareLink` | Must start with `/test` or `/study-corner` |
   | `preparationFocus` | One-line prep hint |
   | `lastChecked` | Date you verified, e.g. `"2026-06-24"` |
   | `active` | `true` only when officially verified |

3. Set top-level `"lastUpdated"` to today’s date (ISO `YYYY-MM-DD`).
4. Run validation (see [Deployment steps](#7-deployment-steps)).

**Example** (verified exam):

```json
{
  "id": "example-exam-2026",
  "examName": "Example Exam 2026",
  "department": "Central — Example Board",
  "qualification": "Graduate as per official notification",
  "notificationWindow": "Official notification देखें",
  "examWindow": "Official calendar देखें",
  "typingRequired": "Check official notification",
  "status": "Official website check करें",
  "officialSourceLabel": "Example Board Official",
  "officialSourceUrl": "https://example.gov.in/",
  "prepareLink": "/test?language=english",
  "preparationFocus": "English typing speed and accuracy",
  "lastChecked": "2026-06-24",
  "active": true
}
```

---

## 2. Update an existing exam

1. Find the exam by `id` in `exams`.
2. Update fields that changed (dates, status, official URL, typing note, etc.).
3. Set `"lastChecked"` on that row to the date you re-verified.
4. Update top-level `"lastUpdated"`.
5. Run validation.

Do **not** change `id` unless you intend to replace the exam entry entirely (old bookmarks/links may break).

---

## 3. Mark an old / closed exam inactive

When notification is closed, exam is cancelled, or the row is outdated:

```json
"status": "Exam closed — archived",
"active": false,
"lastChecked": "2026-06-24"
```

Also update top-level `"lastUpdated"`.

Inactive exams remain in the JSON for history but **do not appear** on the website.

---

## 4. Keep unverified exams hidden

If you are unsure about dates, typing rules, or the official link:

```json
"status": "Official source verification pending",
"officialSourceUrl": "https://official-site.gov.in/",
"active": false,
"lastChecked": "2026-06-24"
```

Only set `"active": true` after you confirm details on the **official** website or PDF.

---

## 5. Update `lastUpdated` and `lastChecked`

| Field | Scope | Purpose |
|-------|--------|---------|
| `lastUpdated` | Top-level | When the **file** was last maintained |
| `lastChecked` | Each exam row | When **that exam** was last verified against official source |

Use `YYYY-MM-DD` format for both.

---

## 6. Official source rule

**Allowed**

- `.gov.in`, `.nic.in`, state PSC/RB/SSC/UPSC official domains
- Official PDF/notice pages hosted on those domains

**Not allowed**

- Coaching institutes, job alert apps, social media, private aggregators
- Copied content without a link to the official notice

`officialSourceUrl` must use **HTTPS**.

---

## 7. Deployment steps

From project root `E:\TAIPOQ`:

```powershell
# 1. Edit data
#    public/data/upcoming-exams.json

# 2. Validate
node tools/validate-upcoming-exams-json.mjs
# or
npm run validate:upcoming-exams

# 3. Build
npm run build

# 4. Commit and push
git add public/data/upcoming-exams.json tools/validate-upcoming-exams-json.mjs tools/UPCOMING_EXAMS_UPDATE_GUIDE.md
git commit -m "Update upcoming exams data"
git push origin main
```

When adding only the validator workflow (no data change):

```powershell
git add package.json tools/validate-upcoming-exams-json.mjs tools/UPCOMING_EXAMS_UPDATE_GUIDE.md
git commit -m "Add upcoming exams maintenance validation workflow"
git push origin main
```

### Validator behaviour

- **Exit code 1 (fail):** invalid JSON, missing `exams` array, missing `lastUpdated`, duplicate `id`, missing required field
- **Exit code 0 (pass):** structure OK; warnings may still print (review before deploy)

### Common warnings

- `active=true` but blank `officialSourceUrl`
- `active=true` but status contains `"verification pending"`
- Blank `lastChecked`
- `prepareLink` not starting with `/test` or `/study-corner`
- `officialSourceUrl` not HTTPS

---

## Prepare link examples

| prepareLink | Use for |
|-------------|---------|
| `/test?language=english` | English typing practice |
| `/test?language=hindi` | Hindi typing practice |
| `/study-corner/general-awareness` | GA library |
| `/study-corner` | Study Corner landing |

---

## Files (do not change for routine updates)

Routine data updates should **only** touch `public/data/upcoming-exams.json`.

Do not modify unless required:

- `src/routes/upcoming-exams.tsx` (UI)
- `src/lib/upcomingExams.ts` (parser / fallback)
- Typing engine, analytics, cookie consent, Study Corner content
