#!/usr/bin/env node
/**
 * Validate public/data/vacancies.preview.json
 * Run: npm run validate:vacancies
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "public", "data", "vacancies.preview.json");

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

const NO_APPLY_STATUSES = new Set([
  "closed",
  "archive",
  "preparation_only",
  "verification_pending",
]);

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
const LIVE_LIST_REFERENCE_DATE = "2026-06-30";

const errors = [];
const warnings = [];

function isVerifiedPublishCandidate(item) {
  return (
    VERIFIED_PUBLISH_STATUSES.has(item.status) &&
    item.status !== "verification_pending" &&
    item.status !== "preparation_only" &&
    item.isPreparationOnly !== true
  );
}

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function isHttpsUrl(url) {
  try {
    return new URL(String(url).trim()).protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim());
}

function parseIsoDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!isIsoDate(trimmed)) return null;
  return trimmed;
}

function isLiveVacancyByClosingDate(applicationEndDate, referenceDate = LIVE_LIST_REFERENCE_DATE) {
  const end = parseIsoDate(applicationEndDate);
  const ref = parseIsoDate(referenceDate);
  if (!end || !ref) return false;
  return end >= ref;
}

function scanForbiddenDates(item, rowLabel) {
  for (const field of REQUIRED_FIELDS) {
    const val = item[field];
    if (typeof val === "string") {
      for (const bad of FORBIDDEN_DATE_SNIPPETS) {
        if (val.includes(bad)) {
          fail(`${rowLabel}: field "${field}" contains forbidden date snippet "${bad}"`);
        }
      }
    }
  }
  for (const key of [
    "applicationStartDate",
    "applicationEndDate",
    "correctionStartDate",
    "correctionEndDate",
  ]) {
    const val = item[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      if (!isIsoDate(val)) {
        fail(`${rowLabel}: ${key} must be YYYY-MM-DD if present (got "${val}")`);
      }
      if (String(val).startsWith("1970-")) {
        fail(`${rowLabel}: ${key} must not be 1970 placeholder`);
      }
    }
  }
}

console.log("TAIPOQ — Vacancies JSON Validator");
console.log("=".repeat(48));
console.log(`File: ${DATA_PATH}`);
console.log("");

if (!existsSync(DATA_PATH)) {
  fail("File does not exist. Run npm run migrate:vacancies first.");
  printReport({ total: 0 });
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
} catch (e) {
  fail(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  printReport({ total: 0 });
  process.exit(1);
}

if (!data || typeof data !== "object" || Array.isArray(data)) {
  fail("Top-level must be an object with items array.");
}

if (!Array.isArray(data.items)) {
  fail("Missing or invalid top-level field: items (must be an array)");
}

const items = Array.isArray(data.items) ? data.items : [];
const seenIds = new Map();

items.forEach((item, index) => {
  const rowLabel = `Row ${index + 1} (id=${item?.id ?? "?"})`;

  if (!item || typeof item !== "object" || Array.isArray(item)) {
    fail(`${rowLabel}: item must be an object`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in item)) {
      fail(`${rowLabel}: missing required field "${field}"`);
      continue;
    }
    if (field === "preparationLinks") {
      if (!Array.isArray(item.preparationLinks)) {
        fail(`${rowLabel}: preparationLinks must be an array`);
      }
      continue;
    }
    if (field === "active") {
      if (typeof item.active !== "boolean") {
        fail(`${rowLabel}: active must be boolean`);
      }
      continue;
    }
    if (isBlank(item[field])) {
      fail(`${rowLabel}: missing or empty required field "${field}"`);
    }
  }

  const id = String(item.id ?? "").trim();
  if (id) {
    if (seenIds.has(id)) {
      fail(`Duplicate id "${id}" (rows ${seenIds.get(id)} and ${index + 1})`);
    } else {
      seenIds.set(id, index + 1);
    }
  }

  if (!STATUSES.has(item.status)) {
    fail(`${rowLabel}: invalid status "${item.status}"`);
  }

  if (!SOURCE_TYPES.has(item.sourceType)) {
    fail(`${rowLabel}: invalid sourceType "${item.sourceType}"`);
  }

  const sourceUrl = String(item.sourceUrl ?? "").trim();
  if (item.sourceType !== "internal_preparation") {
    if (!isHttpsUrl(sourceUrl)) {
      fail(`${rowLabel}: sourceUrl must be https (${sourceUrl || "(blank)"})`);
    }
  }

  if (item.applyUrl !== undefined && item.applyUrl !== null && String(item.applyUrl).trim() !== "") {
    if (!isHttpsUrl(item.applyUrl)) {
      fail(`${rowLabel}: applyUrl must be https if present`);
    }
    if (NO_APPLY_STATUSES.has(item.status)) {
      fail(
        `${rowLabel}: applyUrl present but status is "${item.status}" (not allowed for Apply)`,
      );
    }
    if (item.isPreparationOnly === true) {
      fail(`${rowLabel}: applyUrl present but isPreparationOnly is true`);
    }
    if (item.sourceType === "cross_check_only") {
      fail(`${rowLabel}: applyUrl present but sourceType is cross_check_only`);
    }
  }

  if (
    item.officialNoticeUrl !== undefined &&
    item.officialNoticeUrl !== null &&
    String(item.officialNoticeUrl).trim() !== ""
  ) {
    if (!isHttpsUrl(item.officialNoticeUrl)) {
      fail(`${rowLabel}: officialNoticeUrl must be https if present`);
    }
  }

  if (isVerifiedPublishCandidate(item)) {
    if (!parseIsoDate(item.applicationStartDate)) {
      fail(
        `${rowLabel}: active/closing_soon verified item requires valid applicationStartDate (YYYY-MM-DD)`,
      );
    }
    if (!parseIsoDate(item.applicationEndDate)) {
      fail(
        `${rowLabel}: active/closing_soon verified item requires valid applicationEndDate (YYYY-MM-DD)`,
      );
    } else if (!isLiveVacancyByClosingDate(item.applicationEndDate)) {
      fail(
        `${rowLabel}: active/closing_soon verified item has expired applicationEndDate ${item.applicationEndDate} (reference ${LIVE_LIST_REFERENCE_DATE})`,
      );
    }
    if (!ALLOWED_VERIFIED_SOURCE_TYPES.has(item.sourceType)) {
      fail(
        `${rowLabel}: active/closing_soon verified item must have sourceType official, official_pdf, or employment_news`,
      );
    }
    if (isBlank(item.sourceCheckedDate)) {
      fail(`${rowLabel}: active/closing_soon verified item requires sourceCheckedDate`);
    }
    if (isBlank(item.vacanciesText)) {
      fail(`${rowLabel}: active/closing_soon verified item requires vacanciesText`);
    }
    if (isBlank(item.qualificationShort)) {
      fail(`${rowLabel}: active/closing_soon verified item requires qualificationShort`);
    }
    if (item.statusLabel === GENERIC_STATUS_LABEL) {
      fail(
        `${rowLabel}: active/closing_soon verified item must not use generic statusLabel "${GENERIC_STATUS_LABEL}"`,
      );
    }
    if (item.notificationWindowText === GENERIC_NOTIFICATION_TEXT) {
      fail(
        `${rowLabel}: active/closing_soon verified item must not use generic notificationWindowText "${GENERIC_NOTIFICATION_TEXT}"`,
      );
    }
    if (item.sourceType === "official_pdf" && isBlank(item.officialNoticeUrl)) {
      fail(
        `${rowLabel}: active/closing_soon verified item with sourceType official_pdf requires officialNoticeUrl`,
      );
    }
  }

  if (item.active === true) {
    if (isBlank(sourceUrl) && item.sourceType !== "internal_preparation") {
      fail(`${rowLabel}: active=true but sourceUrl is missing`);
    }
    if (item.applyUrl && NO_APPLY_STATUSES.has(item.status)) {
      fail(
        `${rowLabel}: active=true with applyUrl but status is "${item.status}" (not allowed)`,
      );
    }
  }

  scanForbiddenDates(item, rowLabel);

  if (item.status === "verification_pending") {
    warn(`${rowLabel}: status is verification_pending — not ready for public vacancy feed`);
  }
  if (item.statusLabel === "Official website check करें") {
    warn(`${rowLabel}: statusLabel is generic "Official website check करें"`);
  }
  if (item.notificationWindowText === "Official notification देखें") {
    warn(`${rowLabel}: notificationWindowText is vague "Official notification देखें"`);
  }
  if (item.vacanciesText === "घोषित नहीं") {
    warn(`${rowLabel}: vacanciesText is "घोषित नहीं" — confirm before publishing as vacancy card`);
  }
});

printReport({
  lastUpdated: data.lastUpdated,
  source: data.source,
  total: items.length,
  active: items.filter((i) => i.active).length,
});

if (errors.length > 0) {
  process.exit(1);
}

console.log("");
console.log("Result: PASS (warnings only — preview data; review before live use)");
process.exit(0);

function printReport({ lastUpdated, source, total, active }) {
  console.log("Summary");
  console.log("-".repeat(48));
  if (lastUpdated) console.log(`lastUpdated: ${lastUpdated}`);
  if (source) console.log(`source: ${source}`);
  console.log(`Total items:  ${total}`);
  if (active !== undefined) console.log(`Active:       ${active}`);
  console.log("");

  if (errors.length) {
    console.log(`ERRORS (${errors.length}) — fix before deploy:`);
    errors.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    console.log("");
  } else {
    console.log("ERRORS: none");
    console.log("");
  }

  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length}) — review recommended:`);
    warnings.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    console.log("");
  } else {
    console.log("WARNINGS: none");
    console.log("");
  }

  if (errors.length > 0) {
    console.log("Result: FAIL — validation blocked (exit code 1)");
  }
}
