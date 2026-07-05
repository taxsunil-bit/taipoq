#!/usr/bin/env node
/**
 * Smoke test for live verified government job vacancies.
 * Run: npm run smoke:vacancies
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  computePublicVacancySummary,
  filterVerifiedPublicVacanciesBySector,
  getVerifiedPublicVacancies,
  getVerifiedVacancySector,
  resolveVacancyDataUpdatedIso,
} from "../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LIVE_PATH = path.join(ROOT, "public", "data", "vacancies.json");
const PREVIEW_PATH = path.join(ROOT, "public", "data", "vacancies.preview.json");
// Production serves the live file; fall back to preview only if live is absent.
const DATA_PATH = existsSync(LIVE_PATH) ? LIVE_PATH : PREVIEW_PATH;
const CARD_PATH = path.join(ROOT, "src", "components", "VerifiedVacancyCard.tsx");
const VACANCIES_TS = path.join(ROOT, "src", "lib", "vacancies.ts");
const ROUTE_PATH = path.join(ROOT, "src", "routes", "upcoming-exams.tsx");
const PREVIEW_ROUTE_PATH = path.join(ROOT, "src", "routes", "vacancies-preview.tsx");

const LIVE_LIST_REFERENCE_DATE = "2026-07-01";
const FORBIDDEN_DATE = "01/01/1970";
const AUDIT_CLOCK = { now: () => new Date("2026-07-05T04:00:00.000Z") };
const NEW_JOB_IDS = [
  "delhi-hjs-examination-2026",
  "ibps-po-mt-xvi-2026",
  "uppsc-pcs-2026",
  "aiims-cre-5-2026",
];

const errors = [];
const checks = [];

function fail(msg) {
  errors.push(msg);
}

function pass(msg) {
  checks.push(msg);
}

function parseIsoDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return trimmed;
}

function formatDDMMYYYY(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function applyWindowStrip(start, end) {
  const s = formatDDMMYYYY(start);
  const e = formatDDMMYYYY(end);
  if (s && e) return `Apply Window: ${s} → ${e}`;
  if (e && !s) return `Last Date: ${e}`;
  return null;
}

console.log("TAIPOQ — Live Vacancies Smoke Test");
console.log("=".repeat(48));

if (!existsSync(LIVE_PATH)) {
  fail("Missing public/data/vacancies.json (published live data)");
} else {
  pass("Live data file vacancies.json present");
}

if (!existsSync(DATA_PATH)) {
  fail("Missing vacancy data file");
  process.exit(1);
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const items = data.items ?? [];
const summary = computePublicVacancySummary(items, AUDIT_CLOCK);
const verified = summary.displayed;

pass(`Open public job cards (IST audit clock): ${verified.length}`);
pass(`Open listings window count: ${summary.openListings}`);

// Production loads only live data; preview must not leak into the public page.
if (existsSync(ROUTE_PATH)) {
  const publicRouteSrc = readFileSync(ROUTE_PATH, "utf8");
  if (!publicRouteSrc.includes("loadVacanciesLive")) {
    fail("upcoming-exams route must load live data via loadVacanciesLive");
  } else {
    pass("Public route loads live vacancy data");
  }
  if (publicRouteSrc.includes("loadVacanciesPreview")) {
    fail("Public route must NOT reference the preview loader");
  } else {
    pass("Public route has no preview loader reference");
  }
  if (/[?&]preview=1|useVacancyPreviewMode|get\(["']preview["']\)/.test(publicRouteSrc)) {
    fail("Public route must NOT expose a preview query switch");
  } else {
    pass("Public route has no preview query switch");
  }
}

// No draft/review record may pass the verified-public gate.
for (const item of verified) {
  if (item.status === "verification_pending") {
    fail(`${item.id}: verification_pending leaked into verified-public list`);
  }
  if (item.lifecycleStatus && item.lifecycleStatus !== "published") {
    fail(`${item.id}: non-published lifecycleStatus "${item.lifecycleStatus}" in verified list`);
  }
}
pass("No draft/review record leaked into verified-public list");

// Preview review page must carry the explicit preview marker.
if (existsSync(PREVIEW_ROUTE_PATH)) {
  const previewRouteSrc = readFileSync(PREVIEW_ROUTE_PATH, "utf8");
  if (!previewRouteSrc.includes("PREVIEW — NOT PUBLISHED")) {
    fail("vacancies-preview route must show 'PREVIEW — NOT PUBLISHED' marker");
  } else {
    pass("Preview route shows preview marker");
  }
}

if (verified.length < 24) {
  fail(`Expected at least 24 open public jobs on audit date, got ${verified.length}`);
} else {
  pass("Open public count is at least 24 on audit date");
}

const aiims = items.find((i) => i.id === "aiims-cre-5-2026");
if (aiims && verified.some((v) => v.id === "aiims-cre-5-2026")) {
  fail("AIIMS CRE-5 must be excluded after 2026-07-03 17:00 IST");
} else {
  pass("AIIMS CRE-5 excluded after deadline");
}

const titles = new Set();
for (const item of items) {
  const title = item.title?.trim();
  if (!title) continue;
  if (titles.has(title)) fail(`Duplicate title: ${title}`);
  titles.add(title);
}
pass("No duplicate titles");

for (const id of NEW_JOB_IDS) {
  const row = items.find((i) => i.id === id);
  if (!row) fail(`Missing new job: ${id}`);
  else pass(`New job present: ${id}`);
}

const delhi = items.find((i) => i.id === "delhi-hjs-examination-2026");
const ibps = items.find((i) => i.id === "ibps-po-mt-xvi-2026");
const uppsc = items.find((i) => i.id === "uppsc-pcs-2026");
const aiimsRow = items.find((i) => i.id === "aiims-cre-5-2026");

if (delhi && getVerifiedVacancySector(delhi) !== "judicial") fail("Delhi HJS must be under Judicial Exams sector");
else if (delhi) pass("Delhi HJS under Judicial Exams");

if (delhi && getVerifiedVacancySector(delhi) === "contract_local") fail("Delhi HJS must not be under Contract / Local");
else if (delhi) pass("Delhi HJS not under Contract / Local");

if (ibps && getVerifiedVacancySector(ibps) !== "banking") fail("IBPS PO/MT-XVI must be under Banking");
else if (ibps) pass("IBPS PO/MT-XVI under Banking");

if (uppsc && getVerifiedVacancySector(uppsc) !== "state_psc") fail("UPPSC PCS must be under State PSC / PCS");
else if (uppsc) pass("UPPSC PCS under State PSC / PCS");

if (uppsc && getVerifiedVacancySector(uppsc) === "upsc") fail("UPPSC PCS must not be under UPSC");

if (aiimsRow && getVerifiedVacancySector(aiimsRow) !== "medical") fail("AIIMS CRE-5 must be under Medical");
else if (aiimsRow) pass("AIIMS CRE-5 under Medical");

const rrb = items.find((i) => i.id === "rrb-technician-cen-02-2026");
if (rrb) {
  const strip = applyWindowStrip(rrb.applicationStartDate, rrb.applicationEndDate);
  if (strip !== "Apply Window: 30/06/2026 → 29/07/2026") {
    fail(`RRB apply window strip mismatch: ${strip}`);
  } else {
    pass("RRB apply window dates correct");
  }
  if (rrb.applicationEndTime !== "23:59") fail("RRB should have applicationEndTime 23:59");
  else pass("RRB applicationEndTime set");
}

for (const item of verified) {
  const json = JSON.stringify(item);
  if (json.includes(FORBIDDEN_DATE)) fail(`${item.id}: contains forbidden date ${FORBIDDEN_DATE}`);
  if (item.applicationStartDate?.startsWith("1970-")) fail(`${item.id}: 1970 start date`);

  if (item.applicationStartDate && item.applicationEndDate) {
    const strip = applyWindowStrip(item.applicationStartDate, item.applicationEndDate);
    if (!strip?.includes("Apply Window")) {
      fail(`${item.id}: both dates exist but no Apply Window strip logic`);
    }
  }

  if (
    (item.status === "closed" || item.status === "archive") &&
    item.applyUrl?.trim()
  ) {
    fail(`${item.id}: closed/archive with applyUrl`);
  }
}

pass("No forbidden 1970 dates on live verified jobs");

const sscCgl = items.find((i) => i.id === "ssc-cgl-2026");
if (sscCgl && verified.some((v) => v.id === "ssc-cgl-2026")) {
  fail("SSC CGL must not appear in live verified public list");
} else {
  pass("SSC CGL not in live verified list");
}

const navyBtech = items.find((i) => i.id === "indian-navy-btech-cadet-entry-jan-2027");
if (navyBtech && verified.some((v) => v.id === "indian-navy-btech-cadet-entry-jan-2027")) {
  fail("Indian Navy 10+2 B.Tech Cadet Entry must not be active after 29/06/2026");
} else {
  pass("Indian Navy B.Tech Cadet Entry not live");
}

const cardSrc = readFileSync(CARD_PATH, "utf8");
if (!cardSrc.includes("formatVacancyApplyWindowStrip")) {
  fail("VerifiedVacancyCard must use formatVacancyApplyWindowStrip");
} else {
  pass("Card uses Apply Window strip helper");
}
if (!cardSrc.includes("Application End")) fail("Card must label Application End");
else pass("Card uses Application End label");
if (cardSrc.includes('label="Last Date"')) fail("Card must not use duplicate Last Date label in details");
else pass("No duplicate Last Date label in card details");

const routeSrc = readFileSync(ROUTE_PATH, "utf8");
if (!routeSrc.includes("State PSC / PCS")) fail("Missing State PSC / PCS chip");
else pass("State PSC / PCS chip present");
if (!routeSrc.includes("Open listings:")) fail("Missing honest Open listings summary");
else pass("Honest Open listings summary present");
if (!routeSrc.includes("Vacancy data updated:")) fail("Missing Vacancy data updated label");
else pass("Vacancy data updated label present");
if (routeSrc.includes("Open verified:")) fail("Misleading Open verified summary must be removed");
else pass("No misleading Open verified summary");

const updatedIso = resolveVacancyDataUpdatedIso(data);
if (!updatedIso || formatDDMMYYYY(updatedIso) !== "05/07/2026") {
  fail(`Expected dataset update date 05/07/2026 from metadata, got ${updatedIso}`);
} else {
  pass("Dataset update date from lastUpdated metadata");
}

if (summary.fullyVerified !== 2) {
  fail(`Expected 2 fully verified open records after partial B1 release, got ${summary.fullyVerified}`);
} else {
  pass("Fully verified count matches partial B1 release (2 records)");
}

const legacyOnDisplay = summary.displayed.length - summary.fullyVerified;
if (legacyOnDisplay !== summary.displayed.length - 2) {
  fail(`Expected ${summary.displayed.length - 2} review-pending cards on display, got ${legacyOnDisplay}`);
} else {
  pass("Review-pending on display count consistent with partial verification");
}

const sectorCounts = {};
for (const item of verified) {
  const s = getVerifiedVacancySector(item) ?? "other";
  sectorCounts[s] = (sectorCounts[s] ?? 0) + 1;
}

for (const [sector, count] of Object.entries(sectorCounts)) {
  const filtered = filterVerifiedPublicVacanciesBySector(items, sector, AUDIT_CLOCK);
  if (filtered.length !== count) {
    fail(`Sector count mismatch for ${sector}: chip ${count} vs filter ${filtered.length}`);
  }
}
pass("Sector chip counts match filterVerifiedPublicVacanciesBySector");

console.log("\nSector counts (live verified):");
for (const [k, v] of Object.entries(sectorCounts).sort()) {
  console.log(`  ${k}: ${v}`);
}

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
