// Batch B3 release integration tests.

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
import { computePublicVacancySummary } from "../../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "public", "data");

const B2_VERIFIED = [
  "sbi-po-2026",
  "new-india-assurance-apprentice-2026-27",
  "rrb-technician-cen-02-2026",
  "gujarat-hc-legal-assistant-2026",
  "drdo-deal-apprentice-2026-27",
  "delhi-hjs-examination-2026",
];

const ISRO_ID = "isro-istrac-02-2026";

function loadJson(name) {
  return JSON.parse(readFileSync(path.join(DATA, name), "utf8"));
}

test("B3: ISRO passes strict contract with reconciled post groups", () => {
  const { items } = loadJson("vacancies.preview.json");
  const isro = items.find((i) => i.id === ISRO_ID);
  assert.ok(isro, "ISRO record present");
  assert.equal(strictPublicationContractPasses(isro), true);
  assert.equal(classifyVacancyTrust(isro), "VERIFIED_PUBLISHED");
  assert.equal(isro.postGroups?.length, 6);
  const { sum } = sumPostGroupVacancies(isro);
  assert.equal(sum, isro.totalVacancies);
  assert.equal(sum, 26);
});

test("B3: prior six verified records still pass strict contract", () => {
  const { items } = loadJson("vacancies.preview.json");
  for (const id of B2_VERIFIED) {
    const item = items.find((i) => i.id === id);
    assert.ok(item, id);
    assert.equal(strictPublicationContractPasses(item), true, id);
  }
});

test("B3: nested ISRO source IDs resolve in registry", () => {
  const { items } = loadJson("vacancies.preview.json");
  const sources = loadJson("vacancy-sources.json");
  const audit = auditSourceRegistry(items, sources);
  assert.equal(audit.unresolvedSourceIds.length, 0);
});

test("B3: public summary fully verified count includes ISRO", () => {
  const { items } = loadJson("vacancies.preview.json");
  const summary = computePublicVacancySummary(items, { now: () => new Date("2026-07-05T06:30:00.000Z") });
  const strictOnDisplay = summary.displayed.filter((i) => strictPublicationContractPasses(i));
  assert.equal(summary.fullyVerified, 11);
  assert.equal(summary.fullyVerified, strictOnDisplay.length);
});

test("B3: VerifiedVacancyCard renders post-wise expansion", () => {
  const card = readFileSync(path.join(ROOT, "src", "components", "VerifiedVacancyCard.tsx"), "utf8");
  assert.match(card, /View post-wise details/);
  assert.match(card, /postGroups/);
  assert.match(card, /aria-expanded/);
});
