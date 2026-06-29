# TAIPOQ Vacancy Data Model Guide

Phase 2 foundation — `VacancyItem` schema and preview migration. The live site still uses `public/data/upcoming-exams.json` and `/upcoming-exams` until Phase 3+.

## Old vs new

| Aspect | `UpcomingExam` (legacy) | `VacancyItem` (new) |
|--------|-------------------------|---------------------|
| File | `public/data/upcoming-exams.json` | `public/data/vacancies.preview.json` (preview) |
| Purpose | Exam watchlist + prep links | Verified vacancy / exam-process cards |
| Status | Free-text string | Typed `VacancyStatus` + `statusLabel` |
| Dates | Text windows only | Optional ISO `YYYY-MM-DD` fields |
| Apply | Not modeled | Optional `applyUrl` with validator rules |
| Source | `officialSourceUrl` | `sourceType`, `sourceUrl`, `sourceLabel`, `sourceCheckedDate` |

Types: `src/types/vacancy.ts`

## Required fields

Every `VacancyItem` must include:

`id`, `title`, `organisation`, `category`, `status`, `statusLabel`, `vacanciesText`, `qualificationShort`, `notificationWindowText`, `examWindowText`, `sourceType`, `sourceUrl`, `sourceLabel`, `sourceCheckedDate`, `trustNote`, `preparationLinks` (array), `active`

Optional: `applicationStartDate`, `applicationEndDate`, `correctionStartDate`, `correctionEndDate`, `officialNoticeUrl`, `applyUrl`, `ageLimitShort`, `feeShort`, `selectionProcessShort`

## Status meanings

| Status | Use when |
|--------|----------|
| `active` | Application window open (verified) |
| `closing_soon` | ≤7 days left on verified last date |
| `closed` | Application ended |
| `correction_window` | Correction/edit window open |
| `exam_process` | Application closed; exam/admit/result stage |
| `departmental` | Departmental-only eligibility |
| `archive` | Old notice kept for reference |
| `preparation_only` | No apply — TAIPOQ prep tracking only |
| `verification_pending` | Migrated or draft — not publication-ready |

## Source priority

1. Official recruitment website / commission site  
2. Official notification PDF  
3. Employment News / Rozgar Samachar  
4. Reputed news — cross-check only (`cross_check_only`)  
5. Internal TAIPOQ prep (`internal_preparation`) — not a government vacancy

## applyUrl rules

- Only set when status is `active` or `closing_soon` and URL is verified HTTPS official apply portal.
- **Do not** set `applyUrl` when status is `closed`, `archive`, `preparation_only`, or `verification_pending`.
- Validator **fails** if `active: true` + `applyUrl` + disallowed status.

## Departmental exams

- Set `isDepartmental: true` and `status: departmental` (or appropriate label).
- Do not mix with open public vacancy cards on the homepage feed.

## Apprenticeship / training

- Use clear title/category wording (e.g. Agniveer Apprentice).
- `trustNote` should state training/apprenticeship nature if not a regular permanent post.

## Archive rules

- Set `active: false` and `status: archive` for expired notices.
- Keep rows in JSON for history; backup before delete.

## No fake dates

- Unknown dates → `घोषित नहीं` in text fields.
- Structured dates only as ISO `YYYY-MM-DD`.
- **Never** use `01/01/1970`, `1 Jan 1970`, or `1970-01-01`.

## Commands

```powershell
cd E:\TAIPOQ

# Regenerate preview from legacy upcoming-exams.json
npm run migrate:vacancies

# Validate preview schema
npm run validate:vacancies

# Legacy feed (still live)
npm run validate:upcoming-exams

npm run build
```

## Migration script

`tools/migrate-upcoming-exams-to-vacancies.mjs` reads `public/data/upcoming-exams.json` and writes `public/data/vacancies.preview.json`.

- Preserves all rows including `active: false`.
- Default migrated status: `verification_pending`.
- Special case: `ssc-cgl-2026` → `correction_window`, `isPreparationOnly: true`.
- Does **not** add new jobs from research MD.
