// Batch B4 release integration tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  strictPublicationContractPasses,
  classifyVacancyTrust,
} from "../../src/lib/vacanciesSource.mjs";
import { sumPostGroupVacancies } from "../../src/lib/vacancyMultipost.mjs";
import { auditSourceRegistry } from "../vacancy-update-lib.mjs";
import {
  computePublicVacancySummary,
  isVacancyApplicationWindowOpen,
} from "../../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "public", "data");

const B3_VERIFIED = [
  "sbi-po-2026",
  "new-india-assurance-apprentice-2026-27",
  "rrb-technician-cen-02-2026",
  "gujarat-hc-legal-assistant-2026",
  "drdo-deal-apprentice-2026-27",
  "delhi-hjs-examination-2026",
  "isro-istrac-02-2026",
];

const B4_IDS = [
  "indian-navy-agniveer-apprentice-0127-0227-2026",
  "ibps-po-mt-xvi-2026",
  "uppsc-pcs-2026",
  "indian-navy-ssc-various-entries-jun-2027",
];

const AUDIT_CLOCK = { now: () => new Date("2026-07-05T06:35:00.000Z") };

function loadJson(name) {
  return JSON.parse(readFileSync(path.join(DATA, name), "utf8"));
}

test("B4: prior seven verified records still pass strict contract", () => {
  const { items } = loadJson("vacancies.preview.json");
  for (const id of B3_VERIFIED) {
    const item = items.find((i) => i.id === id);
    assert.ok(item, id);
    assert.equal(strictPublicationContractPasses(item), true, id);
  }
});

test("B4: newly verified records pass strict contract", () => {
  const { items } = loadJson("vacancies.preview.json");
  for (const id of B4_IDS) {
    const item = items.find((i) => i.id === id);
    assert.ok(item, id);
    assert.equal(strictPublicationContractPasses(item), true, id);
    assert.equal(classifyVacancyTrust(item), "VERIFIED_PUBLISHED", id);
  }
});

test("B4: ISRO postGroups still reconcile to 26", () => {
  const { items } = loadJson("vacancies.preview.json");
  const isro = items.find((i) => i.id === "isro-istrac-02-2026");
  const { sum } = sumPostGroupVacancies(isro);
  assert.equal(sum, 26);
  assert.equal(isro.totalVacancies, 26);
});

test("B4: Navy SSC post groups reconcile to 275 with unique IDs", () => {
  const { items } = loadJson("vacancies.preview.json");
  const ssc = items.find((i) => i.id === "indian-navy-ssc-various-entries-jun-2027");
  assert.equal(ssc.postGroups?.length, 12);
  const ids = ssc.postGroups.map((g) => g.id);
  assert.equal(new Set(ids).size, 12);
  const { sum } = sumPostGroupVacancies(ssc);
  assert.equal(sum, 275);
});

test("B4: Navy extension controls final deadline at 17:00 IST", () => {
  const { items } = loadJson("vacancies.preview.json");
  const navy = items.find((i) => i.id === "indian-navy-agniveer-apprentice-0127-0227-2026");
  assert.equal(navy.applicationEndDate, "2026-07-05");
  assert.equal(navy.applicationEndTime, "17:00");
  assert.equal(isVacancyApplicationWindowOpen(navy, AUDIT_CLOCK.now()), true);
});

test("B4: closed Navy record cannot re-enter open listings after deadline", () => {
  const { items } = loadJson("vacancies.preview.json");
  const navy = items.find((i) => i.id === "indian-navy-agniveer-apprentice-0127-0227-2026");
  const afterClose = new Date("2026-07-05T18:00:00+05:30");
  assert.equal(isVacancyApplicationWindowOpen(navy, afterClose), false);
  const summary = computePublicVacancySummary(items, { now: () => afterClose });
  assert.ok(!summary.displayed.some((i) => i.id === navy.id));
});

test("B4: IBPS notice URL is dedicated official PDF", () => {
  const { items } = loadJson("vacancies.preview.json");
  const ibps = items.find((i) => i.id === "ibps-po-mt-xvi-2026");
  assert.match(ibps.officialNotificationUrl, /Detailed-Notification_CRP-PO-XVI.*\.pdf$/i);
  assert.equal(ibps.totalVacancies, 6715);
});

test("B4: UPPSC has no placeholder vacancy text", () => {
  const { items } = loadJson("vacancies.preview.json");
  const uppsc = items.find((i) => i.id === "uppsc-pcs-2026");
  assert.doesNotMatch(uppsc.vacanciesText, /around|verify exact|as per official notification/i);
  assert.equal(uppsc.totalVacancies, 500);
});

test("B4: nested sourceIds and verifiedFacts resolve", () => {
  const { items } = loadJson("vacancies.preview.json");
  const sources = loadJson("vacancy-sources.json");
  const audit = auditSourceRegistry(items, sources);
  assert.equal(audit.unresolvedSourceIds.length, 0);
});

test("B4: public summary fully verified count is 11 at audit clock", () => {
  const { items } = loadJson("vacancies.preview.json");
  const summary = computePublicVacancySummary(items, AUDIT_CLOCK);
  const strictOnDisplay = summary.displayed.filter((i) => strictPublicationContractPasses(i));
  assert.equal(summary.fullyVerified, 11);
  assert.equal(summary.fullyVerified, strictOnDisplay.length);
});

test("B4: UPSC and DSSSB records unchanged (still review pending)", () => {
  const { items } = loadJson("vacancies.preview.json");
  for (const id of ["upsc-advt-07-2026", "dsssb-advt-03-2026"]) {
    const item = items.find((i) => i.id === id);
    assert.notEqual(item.verificationStatus, "verified", id);
    assert.equal(strictPublicationContractPasses(item), false, id);
  }
});
