#!/usr/bin/env node
/**
 * Validate the TAIPOQ vacancy Update Safety System data files:
 *   - public/data/vacancies.json          (published live data)
 *   - public/data/vacancies.preview.json  (proposed preview data)
 *   - public/data/vacancy-sources.json     (source registry)
 *   - public/data/content-registry.json    (lightweight registry)
 *
 * Run: npm run vacancies:validate   (alias: npm run validate:vacancies)
 *
 * Backward compatible: legacy records (no lifecycleStatus/verificationStatus)
 * keep the original legacy publication contract. The strict new-model checks
 * only apply to records that explicitly opt in via the new fields.
 *
 * Deterministic and offline: URLs are format-checked only; no network requests.
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// Honour VACANCY_DATA_DIR so publish staging + tests can validate an isolated
// sandbox instead of the real project data.
const DATA_DIR = process.env.VACANCY_DATA_DIR
  ? path.resolve(process.env.VACANCY_DATA_DIR)
  : path.join(ROOT, "public", "data");

const LIVE_PATH = path.join(DATA_DIR, "vacancies.json");
const PREVIEW_PATH = path.join(DATA_DIR, "vacancies.preview.json");
const SOURCES_PATH = path.join(DATA_DIR, "vacancy-sources.json");
const REGISTRY_PATH = path.join(DATA_DIR, "content-registry.json");

const LIVE_LIST_REFERENCE_DATE = "2026-07-01";

const STATUSES = new Set([
  "active",
  "closing_soon",
  "closed",
  "correction_window",
  "exam_process",
  "departmental",
  "archive",
  "preparation_only",
  "verification_pending",
]);

const SOURCE_TYPES = new Set([
  "official",
  "official_pdf",
  "employment_news",
  "cross_check_only",
  "internal_preparation",
]);

const LIFECYCLE_STATUSES = new Set(["draft", "review", "published", "expired", "withdrawn"]);
const VERIFICATION_STATUSES = new Set([
  "pending",
  "verified",
  "manual_confirmation_required",
  "rejected",
]);
const REGISTRY_SOURCE_TYPES = new Set([
  "official-notification",
  "official-corrigendum",
  "official-application",
  "official-website",
  "official-press-release",
  "secondary-cross-check",
]);
const OFFICIAL_REGISTRY_SOURCE_TYPES = new Set([
  "official-notification",
  "official-corrigendum",
  "official-application",
  "official-website",
  "official-press-release",
]);

const NO_APPLY_STATUSES = new Set(["closed", "archive", "preparation_only", "verification_pending"]);

const REQUIRED_FIELDS = [
  "id",
  "title",
  "organisation",
  "category",
  "status",
  "statusLabel",
  "vacanciesText",
  "qualificationShort",
  "notificationWindowText",
  "examWindowText",
  "sourceType",
  "sourceUrl",
  "sourceLabel",
  "sourceCheckedDate",
  "trustNote",
  "preparationLinks",
  "active",
];

const FORBIDDEN_DATE_SNIPPETS = ["01/01/1970", "1 Jan 1970"];
const VERIFIED_PUBLISH_STATUSES = new Set(["active", "closing_soon"]);
const ALLOWED_VERIFIED_SOURCE_TYPES = new Set(["official", "official_pdf", "employment_news"]);
const GENERIC_STATUS_LABEL = "Official website check करें";
const GENERIC_NOTIFICATION_TEXT = "Official notification देखें";

// -------------------- helpers --------------------

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function isHttpsUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return false;
  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

/** URL link-check classification (format-based, offline). */
function classifyUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return "broken";
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "broken";
  }
  if (parsed.protocol !== "https:") return "broken";
  return "valid";
}

function isIsoDate(value) {
  if (value === undefined || value === null || String(value).trim() === "") return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim());
}

function parseIsoDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return trimmed;
}

function isLiveVacancyByClosingDate(applicationEndDate, referenceDate = LIVE_LIST_REFERENCE_DATE) {
  const end = parseIsoDate(applicationEndDate);
  const ref = parseIsoDate(referenceDate);
  if (!end || !ref) return false;
  return end >= ref;
}

function isVerifiedPublishCandidate(item) {
  return (
    VERIFIED_PUBLISH_STATUSES.has(item.status) &&
    item.status !== "verification_pending" &&
    item.status !== "preparation_only" &&
    item.isPreparationOnly !== true
  );
}

function isPositiveIntegerOrNull(value) {
  if (value === undefined || value === null) return true;
  return Number.isInteger(value) && value >= 0;
}

// -------------------- per-record validation --------------------

function validateRecord(item, index, ctx) {
  const { errors, warnings, seenIds, label } = ctx;
  const rowLabel = `[${label}] Row ${index + 1} (id=${item?.id ?? "?"})`;

  if (!item || typeof item !== "object" || Array.isArray(item)) {
    errors.push(`${rowLabel}: item must be an object`);
    return;
  }

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in item)) {
      errors.push(`${rowLabel}: missing required field "${field}"`);
      continue;
    }
    if (field === "preparationLinks") {
      if (!Array.isArray(item.preparationLinks)) {
        errors.push(`${rowLabel}: preparationLinks must be an array`);
      }
      continue;
    }
    if (field === "active") {
      if (typeof item.active !== "boolean") errors.push(`${rowLabel}: active must be boolean`);
      continue;
    }
    if (isBlank(item[field])) errors.push(`${rowLabel}: missing or empty required field "${field}"`);
  }

  // Identity
  const id = String(item.id ?? "").trim();
  if (id) {
    if (seenIds.has(id)) {
      errors.push(`${rowLabel}: duplicate id "${id}" (also row ${seenIds.get(id)})`);
    } else {
      seenIds.set(id, index + 1);
    }
  }

  // Enum validity
  if (!STATUSES.has(item.status)) errors.push(`${rowLabel}: invalid status "${item.status}"`);
  if (!SOURCE_TYPES.has(item.sourceType)) {
    errors.push(`${rowLabel}: invalid sourceType "${item.sourceType}"`);
  }

  // New-model enum validity (only when present)
  if (item.lifecycleStatus !== undefined && !LIFECYCLE_STATUSES.has(item.lifecycleStatus)) {
    errors.push(`${rowLabel}: invalid lifecycleStatus "${item.lifecycleStatus}"`);
  }
  if (item.verificationStatus !== undefined && !VERIFICATION_STATUSES.has(item.verificationStatus)) {
    errors.push(`${rowLabel}: invalid verificationStatus "${item.verificationStatus}"`);
  }

  // URL format
  const sourceUrl = String(item.sourceUrl ?? "").trim();
  if (item.sourceType !== "internal_preparation") {
    if (classifyUrl(sourceUrl) === "broken") {
      errors.push(`${rowLabel}: sourceUrl must be a valid https URL (${sourceUrl || "(blank)"})`);
    }
  }
  for (const urlField of ["applyUrl", "officialNoticeUrl", "officialNotificationUrl", "officialApplicationUrl", "officialWebsiteUrl"]) {
    const v = item[urlField];
    if (v !== undefined && v !== null && String(v).trim() !== "" && !isHttpsUrl(v)) {
      errors.push(`${rowLabel}: ${urlField} must be https if present`);
    }
  }

  // applyUrl legacy rules
  if (item.applyUrl !== undefined && item.applyUrl !== null && String(item.applyUrl).trim() !== "") {
    if (NO_APPLY_STATUSES.has(item.status)) {
      errors.push(`${rowLabel}: applyUrl present but status is "${item.status}" (apply not allowed)`);
    }
    if (item.isPreparationOnly === true) {
      errors.push(`${rowLabel}: applyUrl present but isPreparationOnly is true`);
    }
    if (item.sourceType === "cross_check_only") {
      errors.push(`${rowLabel}: applyUrl present but sourceType is cross_check_only`);
    }
  }

  // Legacy verified-publish contract
  if (isVerifiedPublishCandidate(item)) {
    if (!parseIsoDate(item.applicationStartDate)) {
      errors.push(`${rowLabel}: active/closing_soon requires valid applicationStartDate (YYYY-MM-DD)`);
    }
    if (!parseIsoDate(item.applicationEndDate)) {
      errors.push(`${rowLabel}: active/closing_soon requires valid applicationEndDate (YYYY-MM-DD)`);
    } else if (!isLiveVacancyByClosingDate(item.applicationEndDate)) {
      errors.push(
        `${rowLabel}: active/closing_soon has expired applicationEndDate ${item.applicationEndDate} (reference ${LIVE_LIST_REFERENCE_DATE})`,
      );
    }
    if (!ALLOWED_VERIFIED_SOURCE_TYPES.has(item.sourceType)) {
      errors.push(`${rowLabel}: active/closing_soon must use sourceType official, official_pdf, or employment_news`);
    }
    if (isBlank(item.sourceCheckedDate)) errors.push(`${rowLabel}: active/closing_soon requires sourceCheckedDate`);
    if (isBlank(item.vacanciesText)) errors.push(`${rowLabel}: active/closing_soon requires vacanciesText`);
    if (isBlank(item.qualificationShort)) errors.push(`${rowLabel}: active/closing_soon requires qualificationShort`);
    if (item.statusLabel === GENERIC_STATUS_LABEL) {
      errors.push(`${rowLabel}: active/closing_soon must not use generic statusLabel`);
    }
    if (item.notificationWindowText === GENERIC_NOTIFICATION_TEXT) {
      errors.push(`${rowLabel}: active/closing_soon must not use generic notificationWindowText`);
    }
    if (item.sourceType === "official_pdf" && isBlank(item.officialNoticeUrl)) {
      errors.push(`${rowLabel}: official_pdf active/closing_soon requires officialNoticeUrl`);
    }
  }

  if (item.active === true) {
    if (isBlank(sourceUrl) && item.sourceType !== "internal_preparation") {
      errors.push(`${rowLabel}: active=true but sourceUrl is missing`);
    }
  }

  // Date format + sequence checks
  const dateFields = [
    "applicationStartDate",
    "applicationEndDate",
    "feePaymentLastDate",
    "correctionStartDate",
    "correctionEndDate",
    "notificationDate",
  ];
  for (const key of dateFields) {
    const v = item[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      if (!isIsoDate(v)) errors.push(`${rowLabel}: ${key} must be YYYY-MM-DD if present (got "${v}")`);
      if (String(v).startsWith("1970-")) errors.push(`${rowLabel}: ${key} must not be a 1970 placeholder`);
    }
  }
  const start = parseIsoDate(item.applicationStartDate);
  const end = parseIsoDate(item.applicationEndDate);
  const fee = parseIsoDate(item.feePaymentLastDate);
  const corrStart = parseIsoDate(item.correctionStartDate);
  const corrEnd = parseIsoDate(item.correctionEndDate);
  if (start && end && start > end) {
    errors.push(`${rowLabel}: applicationStartDate ${start} is after applicationEndDate ${end}`);
  }
  if (start && fee && fee < start) {
    errors.push(`${rowLabel}: feePaymentLastDate ${fee} is before applicationStartDate ${start}`);
  }
  if (corrStart && corrEnd && corrStart > corrEnd) {
    errors.push(`${rowLabel}: correctionStartDate ${corrStart} is after correctionEndDate ${corrEnd}`);
  }

  // Forbidden date snippets in any string field
  for (const field of REQUIRED_FIELDS) {
    const val = item[field];
    if (typeof val === "string") {
      for (const bad of FORBIDDEN_DATE_SNIPPETS) {
        if (val.includes(bad)) errors.push(`${rowLabel}: field "${field}" contains forbidden date "${bad}"`);
      }
    }
  }

  // Vacancy count checks (only when structured breakdowns present)
  if (!isPositiveIntegerOrNull(item.totalVacancies)) {
    errors.push(`${rowLabel}: totalVacancies must be a non-negative integer or null`);
  }
  if (Array.isArray(item.postWiseVacancies) && item.postWiseVacancies.length) {
    let sum = 0;
    let complete = true;
    for (const row of item.postWiseVacancies) {
      const count = row?.count;
      if (!Number.isInteger(count) || count < 0) {
        errors.push(`${rowLabel}: postWiseVacancies contains a negative or non-integer count`);
        complete = false;
        break;
      }
      sum += count;
    }
    if (complete && Number.isInteger(item.totalVacancies) && sum !== item.totalVacancies) {
      errors.push(`${rowLabel}: totalVacancies ${item.totalVacancies} != sum of postWiseVacancies ${sum}`);
    }
  }
  if (Array.isArray(item.categoryWiseVacancies) && item.categoryWiseVacancies.length) {
    let catSum = 0;
    for (const row of item.categoryWiseVacancies) {
      const count = row?.count;
      if (!Number.isInteger(count) || count < 0) {
        errors.push(`${rowLabel}: categoryWiseVacancies contains a negative or non-integer count`);
        catSum = -1;
        break;
      }
      catSum += count;
    }
    if (catSum >= 0 && Number.isInteger(item.totalVacancies) && catSum > item.totalVacancies) {
      errors.push(`${rowLabel}: categoryWiseVacancies total ${catSum} exceeds totalVacancies ${item.totalVacancies}`);
    }
  }

  // New-model publication contract (strict, only when opted in)
  const lifecycle = item.lifecycleStatus;
  const verification = item.verificationStatus;
  if (lifecycle === "published") {
    if (verification !== "verified") {
      errors.push(`${rowLabel}: lifecycleStatus "published" requires verificationStatus "verified"`);
    }
    for (const field of ["organisation", "title", "applicationEndDate", "sourceUrl"]) {
      if (isBlank(item[field])) errors.push(`${rowLabel}: published record missing "${field}"`);
    }
    const notice = item.officialNotificationUrl || item.officialNoticeUrl;
    const apply = item.officialApplicationUrl || item.applyUrl;
    if (!isHttpsUrl(notice)) errors.push(`${rowLabel}: published record requires an official notification URL`);
    if (!isHttpsUrl(apply)) errors.push(`${rowLabel}: published record requires an official application URL`);
    if (isBlank(item.lastVerifiedAt)) errors.push(`${rowLabel}: published record requires lastVerifiedAt`);
    if (!Array.isArray(item.sourceIds) || item.sourceIds.length === 0) {
      errors.push(`${rowLabel}: published record requires at least one sourceId`);
    }
  }
  if (verification === "pending" && lifecycle === "published") {
    errors.push(`${rowLabel}: verificationStatus "pending" must not be published`);
  }
  if (lifecycle === "expired" && isVerifiedPublishCandidate(item)) {
    errors.push(`${rowLabel}: lifecycleStatus "expired" conflicts with open status "${item.status}"`);
  }
  if (lifecycle === "withdrawn" && item.applyUrl && String(item.applyUrl).trim() !== "") {
    errors.push(`${rowLabel}: withdrawn record must not expose applyUrl`);
  }

  // Legacy preview warnings (data-quality, non-blocking)
  if (item.status === "verification_pending") {
    warnings.push(`${rowLabel}: status verification_pending — not ready for public feed`);
  }
  if (item.statusLabel === GENERIC_STATUS_LABEL) {
    warnings.push(`${rowLabel}: generic statusLabel`);
  }
  if (item.notificationWindowText === GENERIC_NOTIFICATION_TEXT) {
    warnings.push(`${rowLabel}: vague notificationWindowText`);
  }
  if (item.vacanciesText === "घोषित नहीं") {
    warnings.push(`${rowLabel}: vacanciesText "घोषित नहीं" — confirm before publishing`);
  }
}

function validateDataset(label, filePath, sourcesByVacancy) {
  const errors = [];
  const warnings = [];
  if (!existsSync(filePath)) {
    return { label, exists: false, count: 0, errors, warnings };
  }
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (e) {
    errors.push(`[${label}] invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { label, exists: true, count: 0, errors, warnings };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push(`[${label}] top-level must be an object with an items array`);
    return { label, exists: true, count: 0, errors, warnings };
  }
  if (!Array.isArray(data.items)) {
    errors.push(`[${label}] missing or invalid items array`);
    return { label, exists: true, count: 0, errors, warnings };
  }

  const seenIds = new Map();
  const seenSlugs = new Map();
  const seenAdvOrg = new Map();
  const seenNoticeUrls = new Map();
  const ctx = { errors, warnings, seenIds, label };

  data.items.forEach((item, index) => {
    validateRecord(item, index, ctx);

    // slug uniqueness (where used)
    if (item && typeof item.slug === "string" && item.slug.trim()) {
      const slug = item.slug.trim();
      if (seenSlugs.has(slug)) errors.push(`[${label}] duplicate slug "${slug}"`);
      else seenSlugs.set(slug, index + 1);
    }
    // duplicate advertisement number for same organisation
    if (item && typeof item.advertisementNumber === "string" && item.advertisementNumber.trim()) {
      const key = `${String(item.organisation ?? "").trim().toLowerCase()}::${item.advertisementNumber.trim().toLowerCase()}`;
      if (seenAdvOrg.has(key)) {
        errors.push(`[${label}] duplicate advertisementNumber "${item.advertisementNumber}" for "${item.organisation}"`);
      } else {
        seenAdvOrg.set(key, index + 1);
      }
    }
    // duplicate official notification URL
    const noticeUrl = (item?.officialNotificationUrl || item?.officialNoticeUrl || "").trim();
    if (noticeUrl) {
      if (seenNoticeUrls.has(noticeUrl)) {
        warnings.push(`[${label}] duplicate official notification URL shared by rows ${seenNoticeUrls.get(noticeUrl)} and ${index + 1}`);
      } else {
        seenNoticeUrls.set(noticeUrl, index + 1);
      }
    }

    // sourceIds cross-reference (when present)
    if (Array.isArray(item?.sourceIds)) {
      for (const sid of item.sourceIds) {
        if (!sourcesByVacancy.allSourceIds.has(sid)) {
          errors.push(`[${label}] row ${index + 1} references missing sourceId "${sid}"`);
        }
      }
    }

    // published records must have official-notification + official-application sources registered
    if (item?.lifecycleStatus === "published") {
      const recs = sourcesByVacancy.byVacancy.get(item.id) ?? [];
      if (!recs.some((r) => r.sourceType === "official-notification")) {
        errors.push(`[${label}] published id "${item.id}" has no official-notification source in registry`);
      }
      if (!recs.some((r) => r.sourceType === "official-application")) {
        errors.push(`[${label}] published id "${item.id}" has no official-application source in registry`);
      }
    }
  });

  return { label, exists: true, count: data.items.length, errors, warnings };
}

function validateSourceRegistry(knownVacancyIds) {
  const errors = [];
  const warnings = [];
  const byVacancy = new Map();
  const allSourceIds = new Set();

  if (!existsSync(SOURCES_PATH)) {
    warnings.push("[sources] vacancy-sources.json not found — source registry checks skipped");
    return { errors, warnings, byVacancy, allSourceIds, exists: false, count: 0 };
  }

  let data;
  try {
    data = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));
  } catch (e) {
    errors.push(`[sources] invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { errors, warnings, byVacancy, allSourceIds, exists: true, count: 0 };
  }
  if (!Array.isArray(data)) {
    errors.push("[sources] vacancy-sources.json must be an array of source records");
    return { errors, warnings, byVacancy, allSourceIds, exists: true, count: 0 };
  }

  const seen = new Set();
  data.forEach((rec, i) => {
    const row = `[sources] Row ${i + 1} (id=${rec?.id ?? "?"})`;
    if (!rec || typeof rec !== "object") {
      errors.push(`${row}: must be an object`);
      return;
    }
    if (isBlank(rec.id)) errors.push(`${row}: missing id`);
    else if (seen.has(rec.id)) errors.push(`${row}: duplicate source id "${rec.id}"`);
    else {
      seen.add(rec.id);
      allSourceIds.add(rec.id);
    }
    if (isBlank(rec.vacancyId)) errors.push(`${row}: missing vacancyId`);
    else if (!knownVacancyIds.has(rec.vacancyId)) {
      errors.push(`${row}: vacancyId "${rec.vacancyId}" not found in live or preview data`);
    }
    if (!REGISTRY_SOURCE_TYPES.has(rec.sourceType)) {
      errors.push(`${row}: invalid sourceType "${rec.sourceType}"`);
    }
    if (rec.sourceType === "secondary-cross-check" && /official/i.test(String(rec.title ?? "")) === false) {
      // ok: secondary sources may reference official docs, no action
    }
    // Third-party source must never be labelled official.
    if (OFFICIAL_REGISTRY_SOURCE_TYPES.has(rec.sourceType) && !isHttpsUrl(rec.url)) {
      errors.push(`${row}: official source must have a valid https url`);
    }
    if (typeof rec.corrigendumChecked !== "boolean") {
      errors.push(`${row}: corrigendumChecked must be recorded as boolean`);
    }
    if (rec.verificationStatus !== undefined && !VERIFICATION_STATUSES.has(rec.verificationStatus)) {
      errors.push(`${row}: invalid verificationStatus "${rec.verificationStatus}"`);
    }
    if (isBlank(rec.checkedAt)) warnings.push(`${row}: missing checkedAt date`);

    if (rec.vacancyId) {
      const list = byVacancy.get(rec.vacancyId) ?? [];
      list.push(rec);
      byVacancy.set(rec.vacancyId, list);
    }
  });

  return { errors, warnings, byVacancy, allSourceIds, exists: true, count: data.length };
}

function validateContentRegistry() {
  const errors = [];
  const warnings = [];
  if (!existsSync(REGISTRY_PATH)) {
    warnings.push("[registry] content-registry.json not found — registry checks skipped");
    return { errors, warnings };
  }
  let data;
  try {
    data = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
  } catch (e) {
    errors.push(`[registry] invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { errors, warnings };
  }
  if (typeof data.schemaVersion !== "number") errors.push("[registry] schemaVersion must be a number");
  if (isBlank(data.contentVersion)) errors.push("[registry] contentVersion is required");
  else if (!/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(String(data.contentVersion))) {
    warnings.push(`[registry] contentVersion "${data.contentVersion}" is not YYYY.MM.DD.REVISION`);
  }
  if (!data.vacancies || typeof data.vacancies !== "object") {
    errors.push("[registry] vacancies section is required");
  } else {
    for (const key of ["liveSource", "previewSource", "sourceRegistry", "lastReviewed"]) {
      if (isBlank(data.vacancies[key])) errors.push(`[registry] vacancies.${key} is required`);
    }
  }
  return { errors, warnings };
}

// -------------------- run --------------------

console.log("TAIPOQ Vacancy Validation");
console.log("=".repeat(48));

const allErrors = [];
const allWarnings = [];

// Collect known vacancy ids across both datasets for source cross-reference.
const knownVacancyIds = new Set();
for (const p of [LIVE_PATH, PREVIEW_PATH]) {
  if (!existsSync(p)) continue;
  try {
    const d = JSON.parse(readFileSync(p, "utf8"));
    for (const it of d.items ?? []) if (it?.id) knownVacancyIds.add(it.id);
  } catch {
    /* JSON errors are reported by validateDataset */
  }
}

const sources = validateSourceRegistry(knownVacancyIds);
allErrors.push(...sources.errors);
allWarnings.push(...sources.warnings);

const registry = validateContentRegistry();
allErrors.push(...registry.errors);
allWarnings.push(...registry.warnings);

const live = validateDataset("live", LIVE_PATH, sources);
const preview = validateDataset("preview", PREVIEW_PATH, sources);
allErrors.push(...live.errors, ...preview.errors);
allWarnings.push(...live.warnings, ...preview.warnings);

if (!live.exists) {
  allWarnings.push("[live] vacancies.json not found — no published data validated");
}
if (!preview.exists) {
  allWarnings.push("[preview] vacancies.preview.json not found");
}

// Cross-file relationship (informational): shared ids are intentional updates.
if (live.exists && preview.exists) {
  try {
    const liveIds = new Set(
      (JSON.parse(readFileSync(LIVE_PATH, "utf8")).items ?? []).map((i) => i.id),
    );
    const previewData = JSON.parse(readFileSync(PREVIEW_PATH, "utf8")).items ?? [];
    const previewOnly = previewData.filter((i) => !liveIds.has(i.id)).length;
    if (previewOnly > 0) {
      allWarnings.push(`[compare] preview introduces ${previewOnly} new record(s) not yet in live`);
    }
  } catch {
    /* already reported */
  }
}

console.log("");
console.log(`Live records checked: ${live.count}`);
console.log(`Preview records checked: ${preview.count}`);
console.log(`Source records checked: ${sources.count}`);
console.log(`Errors: ${allErrors.length}`);
console.log(`Warnings: ${allWarnings.length}`);
console.log("");

if (allErrors.length) {
  console.log(`ERRORS (${allErrors.length}) — fix before publish:`);
  allErrors.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
  console.log("");
}
if (allWarnings.length) {
  console.log(`WARNINGS (${allWarnings.length}) — review recommended (non-blocking):`);
  allWarnings.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
  console.log("");
}

if (allErrors.length > 0) {
  console.log("RESULT: FAIL");
  process.exit(1);
}
console.log("RESULT: PASS");
process.exit(0);
