// Phase B2 — batch verification release tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  strictPublicationContractPasses,
  classifyVacancyTrust,
} from "../../src/lib/vacanciesSource.mjs";
import {
  LIVE_PATH,
  SOURCES_PATH,
  readJson,
  auditSourceRegistry,
} from "../vacancy-update-lib.mjs";
import {
  computePublicVacancySummary,
  getVerifiedVacancySector,
} from "../../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUDIT_CLOCK = { now: () => new Date("2026-07-05T00:21:00.000Z") };

const B2_VERIFIED = [
  "rrb-technician-cen-02-2026",
  "gujarat-hc-legal-assistant-2026",
  "drdo-deal-apprentice-2026-27",
  "delhi-hjs-examination-2026",
];
const B1_VERIFIED = ["sbi-po-2026", "new-india-assurance-apprentice-2026-27"];
const ALL_VERIFIED = [...B1_VERIFIED, ...B2_VERIFIED];
const SCHEMA_BLOCKED = ["isro-istrac-02-2026"];
const PLACEHOLDER_RE =
  /as per official advertisement|view official notice|view official pdf|post-wise; view|see notification|as per cen|details in pdf/i;

function loadLive() {
  return readJson(LIVE_PATH);
}

test("B2 verified records pass strict contract", () => {
  const live = loadLive();
  for (const id of B2_VERIFIED) {
    const item = live.items.find((i) => i.id === id);
    assert.ok(item, id);
    assert.equal(strictPublicationContractPasses(item), true, id);
    assert.equal(classifyVacancyTrust(item), "VERIFIED_PUBLISHED", id);
  }
});

test("RRB qualification text is post-wise not flattened placeholder", () => {
  const item = loadLive().items.find((i) => i.id === "rrb-technician-cen-02-2026");
  assert.match(item.qualificationShort, /Grade-I Signal/i);
  assert.match(item.qualificationShort, /Grade-III/i);
  assert.ok(!PLACEHOLDER_RE.test(item.qualificationShort));
  assert.ok(!PLACEHOLDER_RE.test(item.feeShort));
});

test("Gujarat Legal Assistant is contractual and law_legal sector", () => {
  const item = loadLive().items.find((i) => i.id === "gujarat-hc-legal-assistant-2026");
  assert.match(`${item.trustNote} ${item.vacanciesText}`.toLowerCase(), /contractual/);
  assert.equal(getVerifiedVacancySector(item), "law_legal");
  assert.notEqual(getVerifiedVacancySector(item), "judicial");
});

test("ISRO remains schema-blocked (not verified)", () => {
  const live = loadLive();
  for (const id of SCHEMA_BLOCKED) {
    const item = live.items.find((i) => i.id === id);
    assert.equal(strictPublicationContractPasses(item), false, id);
    assert.match(item.qualificationShort, /post-wise|view official/i);
  }
});

test("DRDO apprenticeship uses NATS portal and states non-regular employment", () => {
  const item = loadLive().items.find((i) => i.id === "drdo-deal-apprentice-2026-27");
  assert.match(item.officialApplicationUrl || item.applyUrl, /^https:\/\/nats\.education\.gov\.in/);
  assert.match(item.trustNote.toLowerCase(), /apprenticeship/);
  assert.match(item.trustNote.toLowerCase(), /not regular permanent employment/);
});

test("Delhi HJS source repaired to direct PDF and dedicated apply portal", () => {
  const item = loadLive().items.find((i) => i.id === "delhi-hjs-examination-2026");
  assert.match(item.officialNotificationUrl || item.officialNoticeUrl, /\.pdf$/i);
  assert.match(item.officialApplicationUrl || item.applyUrl, /applycareer\.co\.in/);
  assert.ok(!String(item.officialNoticeUrl).includes("/recruitment"));
});

test("fully verified count equals 6 open strict-contract records", () => {
  const live = loadLive();
  const summary = computePublicVacancySummary(live.items, AUDIT_CLOCK);
  const strictOnDisplay = summary.displayed.filter((i) => strictPublicationContractPasses(i));
  assert.equal(summary.fullyVerified, 6);
  assert.equal(strictOnDisplay.length, 6);
  for (const id of ALL_VERIFIED) {
    assert.ok(strictOnDisplay.some((i) => i.id === id), `missing verified ${id}`);
  }
});

test("verifiedFacts sources resolve for B2 records", () => {
  const live = loadLive();
  const sources = readJson(SOURCES_PATH);
  const audit = auditSourceRegistry(live.items, sources);
  assert.equal(audit.unresolvedSourceIds.length, 0);
  for (const id of B2_VERIFIED) {
    const linked = sources.filter((s) => s.vacancyId === id && (s.verifiedFacts ?? []).length > 0);
    assert.ok(linked.length >= 2, `${id} needs verifiedFacts on notification/application sources`);
  }
});

test("batch B2 apply script exists", () => {
  assert.ok(existsSync(path.join(ROOT, "tools", "apply-batch-b2-vacancy-verification.mjs")));
});
