#!/usr/bin/env node
/**
 * Unit tests for public vacancy summary, IST deadlines, and sector counts.
 * Run via: npm run vacancies:test
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  computePublicVacancySummary,
  computeVacancyApplicationState,
  filterVerifiedPublicVacanciesBySector,
  formatVacancyApplicationStateLabel,
  getApplicationDeadlineMs,
  getVerifiedPublicVacancies,
  getVerifiedVacancySector,
  isVacancyApplicationWindowOpen,
  resolveVacancyDataUpdatedIso,
  resolveVacancyPublicStatusLabel,
  VACANCY_DATE_ONLY_CLOSING_TIME,
} from "../../src/lib/vacancyPublicCore.mjs";
import { classifyVacancyTrust } from "../../src/lib/vacanciesSource.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

function formatDateDDMMYYYY(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function clockAt(isoLocal) {
  return { now: () => new Date(isoLocal) };
}

const base = {
  active: true,
  status: "active",
  isPreparationOnly: false,
  sourceType: "official",
  applicationStartDate: "2026-06-01",
  applicationEndDate: "2026-07-10",
  sourceUrl: "https://example.gov.in/notice.pdf",
  officialNoticeUrl: "https://example.gov.in/notice.pdf",
  applyUrl: "https://example.gov.in/apply",
  title: "Sample",
  organisation: "Sample Org",
  category: "Banking / PO / All India",
  statusLabel: "Open",
  isAllIndia: true,
  isDepartmental: false,
  vacanciesText: "100",
  qualificationShort: "Graduate",
  ageLimitShort: "18-30",
  feeShort: "Rs 100",
  selectionProcessShort: "Written",
  notificationWindowText: "Open",
  examWindowText: "TBD",
  sourceLabel: "Official",
  sourceCheckedDate: "2026-06-20",
  trustNote: "Test",
  preparationLinks: [],
  id: "sample-open",
  lifecycleStatus: "published",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-06-20",
  officialNotificationUrl: "https://example.gov.in/notice.pdf",
  officialApplicationUrl: "https://example.gov.in/apply",
  sourceIds: ["src-sample-open"],
};

test("date-only deadline closes at 23:59:59 IST", () => {
  const before = new Date("2026-07-05T18:29:59.000Z");
  const after = new Date("2026-07-05T18:30:01.000Z");
  assert.equal(isVacancyApplicationWindowOpen({ ...base, applicationEndDate: "2026-07-05" }, before), true);
  assert.equal(isVacancyApplicationWindowOpen({ ...base, applicationEndDate: "2026-07-05" }, after), false);
});

test("exact 17:00 IST deadline is respected", () => {
  const item = { ...base, id: "aiims-sample", applicationEndDate: "2026-07-03", applicationEndTime: "17:00" };
  const at1645 = new Date("2026-07-03T11:14:59.000Z");
  const at1700 = new Date("2026-07-03T11:30:00.000Z");
  const at1701 = new Date("2026-07-03T11:30:01.000Z");
  assert.equal(isVacancyApplicationWindowOpen(item, at1645), true);
  assert.equal(isVacancyApplicationWindowOpen(item, at1700), true);
  assert.equal(isVacancyApplicationWindowOpen(item, at1701), false);
});

test("expired record excluded from open listings", () => {
  const items = [
    { ...base, id: "open-1" },
    { ...base, id: "expired-1", applicationEndDate: "2026-07-03", applicationEndTime: "17:00" },
  ];
  const summary = computePublicVacancySummary(items, clockAt("2026-07-05T04:00:00.000Z"));
  assert.equal(summary.openListings, 1);
  assert.equal(summary.displayed.length, 1);
});

test("verification_pending excluded from displayed cards", () => {
  const items = [
    { ...base, id: "verified-open" },
    { ...base, id: "pending-open", status: "verification_pending" },
  ];
  const summary = computePublicVacancySummary(items, clockAt("2026-07-05T04:00:00.000Z"));
  assert.equal(summary.displayed.length, 1);
  assert.ok(summary.reviewPending >= 1);
});

test("all open count equals rendered cards without filter", () => {
  const items = [
    { ...base, id: "a", category: "Railway / RRB" },
    { ...base, id: "b", category: "Banking / PO / All India" },
    { ...base, id: "c", applicationEndDate: "2026-07-01", applicationEndTime: "17:00" },
  ];
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const all = filterVerifiedPublicVacanciesBySector(items, "all", at);
  const summary = computePublicVacancySummary(items, at);
  assert.equal(all.length, summary.displayed.length);
  assert.equal(getVerifiedPublicVacancies(items, at).length, all.length);
});

test("resolveVacancyDataUpdatedIso prefers dataset lastUpdated", () => {
  const iso = resolveVacancyDataUpdatedIso({
    lastUpdated: "2026-07-01",
    source: "test",
    items: [{ ...base, sourceCheckedDate: "2026-06-15" }],
  });
  assert.equal(iso, "2026-07-01");
  assert.equal(formatDateDDMMYYYY(iso), "01/07/2026");
});

test("sector filter count matches rendered list", () => {
  const items = [
    { ...base, id: "rail-1", category: "Railway / RRB", title: "RRB Technician" },
    { ...base, id: "bank-1", category: "Banking / PO / All India", title: "SBI PO" },
  ];
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const railway = filterVerifiedPublicVacanciesBySector(items, "railway", at);
  assert.equal(railway.length, 1);
  assert.equal(railway[0].id, "rail-1");
});

test("pla records map to contract_local not judicial", () => {
  const item = {
    ...base,
    id: "pla-1",
    category: "Judiciary Local / PLA / Contract",
    title: "PLA Member",
  };
  assert.equal(getVerifiedVacancySector(item), "contract_local");
});

test("gujarat legal assistant maps to law_legal", () => {
  const item = {
    ...base,
    id: "guj-1",
    category: "Judicial Jobs",
    title: "Gujarat High Court Legal Assistant",
  };
  assert.equal(getVerifiedVacancySector(item), "law_legal");
});

test("live dataset all-open equals displayed cards on fixed audit date", () => {
  const dataPath = path.join(ROOT, "public", "data", "vacancies.json");
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const summary = computePublicVacancySummary(data.items, at);
  const all = filterVerifiedPublicVacanciesBySector(data.items, "all", at);
  assert.equal(summary.displayed.length, all.length);
  assert.ok(summary.openListings >= summary.displayed.length);
});

test("documents date-only closing time constant", () => {
  assert.equal(VACANCY_DATE_ONLY_CLOSING_TIME, "23:59:59");
});

test("getApplicationDeadlineMs returns numeric instant", () => {
  const ms = getApplicationDeadlineMs("2026-07-03", "17:00");
  assert.equal(typeof ms, "number");
  assert.ok(ms > 0);
});

test("future opening date → Upcoming", () => {
  const item = { ...base, applicationStartDate: "2026-08-01", applicationEndDate: "2026-08-31" };
  const at = new Date("2026-07-15T04:00:00.000Z");
  assert.equal(computeVacancyApplicationState(item, at), "UPCOMING");
  assert.equal(formatVacancyApplicationStateLabel("UPCOMING"), "Upcoming");
  assert.equal(resolveVacancyPublicStatusLabel(item, at), "Upcoming");
});

test("current time inside application window → Open", () => {
  const at = new Date("2026-07-05T04:00:00.000Z");
  assert.equal(computeVacancyApplicationState(base, at), "OPEN");
  assert.equal(resolveVacancyPublicStatusLabel(base, at), "Applications Open");
});

test("exact closing-day inclusive end of day IST still Open", () => {
  const item = { ...base, applicationEndDate: "2026-07-05" };
  const atInclusive = new Date("2026-07-05T18:29:59.000Z"); // 23:59:59 IST
  assert.equal(computeVacancyApplicationState(item, atInclusive), "OPEN");
});

test("one instant after deadline → Closed", () => {
  const item = { ...base, applicationEndDate: "2026-07-05" };
  const atClosed = new Date("2026-07-05T18:30:00.001Z");
  assert.equal(computeVacancyApplicationState(item, atClosed), "CLOSED");
  assert.equal(resolveVacancyPublicStatusLabel(item, atClosed), "Applications Closed");
});

test("date-only deadline uses Asia/Kolkata end of day", () => {
  const item = { ...base, applicationEndDate: "2026-07-10", applicationEndTime: undefined };
  // 2026-07-10 23:59:59 IST = 2026-07-10T18:29:59Z still open
  assert.equal(computeVacancyApplicationState(item, new Date("2026-07-10T18:29:59.000Z")), "OPEN");
  assert.equal(computeVacancyApplicationState(item, new Date("2026-07-10T18:30:00.001Z")), "CLOSED");
});

test("invalid or missing start date → UNKNOWN (not Open)", () => {
  assert.equal(
    computeVacancyApplicationState({ ...base, applicationStartDate: undefined }, new Date("2026-07-05T04:00:00.000Z")),
    "UNKNOWN",
  );
  assert.equal(
    computeVacancyApplicationState({ ...base, applicationStartDate: "not-a-date" }, new Date("2026-07-05T04:00:00.000Z")),
    "UNKNOWN",
  );
  assert.equal(
    resolveVacancyPublicStatusLabel({ ...base, applicationStartDate: undefined }, new Date("2026-07-05T04:00:00.000Z")),
    "Date Unverified",
  );
});

test("invalid or missing closing date → UNKNOWN (not Open)", () => {
  assert.equal(
    computeVacancyApplicationState({ ...base, applicationEndDate: undefined }, new Date("2026-07-05T04:00:00.000Z")),
    "UNKNOWN",
  );
  assert.equal(
    computeVacancyApplicationState({ ...base, applicationEndDate: "32/13/2026" }, new Date("2026-07-05T04:00:00.000Z")),
    "UNKNOWN",
  );
});

test("pending-verification listing excluded from verified homepage section", () => {
  const pending = { ...base, id: "pending-1", status: "verification_pending" };
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const displayed = getVerifiedPublicVacancies([base, pending], at);
  assert.equal(displayed.length, 1);
  assert.equal(displayed[0].id, "sample-open");
});

test("legacy unverified open listing excluded from verified section", () => {
  const legacy = {
    ...base,
    id: "legacy-open",
    lifecycleStatus: undefined,
    verificationStatus: undefined,
    lastVerifiedAt: undefined,
    sourceIds: undefined,
    officialNotificationUrl: undefined,
    officialApplicationUrl: undefined,
  };
  assert.equal(classifyVacancyTrust(legacy), "LEGACY_PUBLIC_UNVERIFIED");
  const at = clockAt("2026-07-05T04:00:00.000Z");
  assert.equal(getVerifiedPublicVacancies([legacy], at).length, 0);
});

test("expired vacancy excluded from open verified section even when status=active", () => {
  const expired = {
    ...base,
    id: "expired-active",
    status: "active",
    applicationEndDate: "2026-07-01",
    applicationEndTime: "17:00",
  };
  const at = clockAt("2026-07-05T04:00:00.000Z");
  assert.equal(computeVacancyApplicationState(expired, at.now()), "CLOSED");
  assert.equal(resolveVacancyPublicStatusLabel(expired, at.now()), "Applications Closed");
  assert.equal(getVerifiedPublicVacancies([expired], at).length, 0);
});

test("valid open verified vacancy included", () => {
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const displayed = getVerifiedPublicVacancies([base], at);
  assert.equal(displayed.length, 1);
  assert.equal(classifyVacancyTrust(displayed[0]), "VERIFIED_PUBLISHED");
});

test("sorting of open vacancies follows DISPLAY_ORDER then id", () => {
  const items = [
    { ...base, id: "isro-istrac-02-2026", sourceIds: ["a"] },
    { ...base, id: "ibps-po-mt-xvi-2026", sourceIds: ["b"] },
    { ...base, id: "zzz-unknown-order", sourceIds: ["c"] },
  ];
  const at = clockAt("2026-07-05T04:00:00.000Z");
  const ids = getVerifiedPublicVacancies(items, at).map((i) => i.id);
  assert.deepEqual(ids, ["ibps-po-mt-xvi-2026", "isro-istrac-02-2026", "zzz-unknown-order"]);
});

test("static status=active never bypasses canonical closed state", () => {
  const stale = {
    ...base,
    status: "active",
    statusLabel: "Applications Open; Last Date 01/07/2026",
    applicationEndDate: "2026-07-01",
  };
  const at = new Date("2026-07-18T04:00:00.000Z");
  assert.equal(isVacancyApplicationWindowOpen(stale, at), false);
  assert.notEqual(resolveVacancyPublicStatusLabel(stale, at), "Applications Open");
  assert.equal(resolveVacancyPublicStatusLabel(stale, at), "Applications Closed");
});
