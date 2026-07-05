// Phase B1 — partial strict verification release tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
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
import { computePublicVacancySummary } from "../../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const STRICT_READY_IDS = ["sbi-po-2026", "new-india-assurance-apprentice-2026-27"];
const REVIEW_PENDING_SAMPLE = ["dsssb-advt-03-2026"];
const AUDIT_CLOCK = { now: () => new Date("2026-07-05T04:00:00.000Z") };

const PLACEHOLDER_RE = /as per official advertisement|view official notice|details in pdf|post-wise; view official/i;

function loadLive() {
  assert.ok(existsSync(LIVE_PATH), "live vacancies.json must exist after publish");
  return readJson(LIVE_PATH);
}

function loadSources() {
  return readJson(SOURCES_PATH);
}

test("1: strict-ready records pass strictPublicationContractPasses()", () => {
  const live = loadLive();
  for (const id of STRICT_READY_IDS) {
    const item = live.items.find((i) => i.id === id);
    assert.ok(item, `missing ${id}`);
    assert.equal(strictPublicationContractPasses(item), true, id);
    assert.equal(classifyVacancyTrust(item), "VERIFIED_PUBLISHED", id);
  }
});

test("2-3: verified notification and application URLs are HTTPS", () => {
  const live = loadLive();
  for (const id of STRICT_READY_IDS) {
    const item = live.items.find((i) => i.id === id);
    for (const url of [item.officialNotificationUrl || item.officialNoticeUrl, item.officialApplicationUrl || item.applyUrl]) {
      assert.ok(/^https:\/\//i.test(String(url)), `${id} url must be https: ${url}`);
    }
  }
});

test("4-6: sourceIds resolve and verifiedFacts reference valid sources", () => {
  const live = loadLive();
  const sources = loadSources();
  const byId = new Map(sources.map((s) => [s.id, s]));
  const audit = auditSourceRegistry(live.items, sources);

  for (const id of STRICT_READY_IDS) {
    const item = live.items.find((i) => i.id === id);
    assert.ok(Array.isArray(item.sourceIds) && item.sourceIds.length > 0, `${id} sourceIds`);
    for (const sid of item.sourceIds) {
      assert.ok(byId.has(sid), `${id} missing source ${sid}`);
    }
    const linked = sources.filter((s) => s.vacancyId === id);
    const withFacts = linked.filter((s) => (s.verifiedFacts ?? []).length > 0);
    assert.ok(withFacts.length >= 2, `${id} needs notification/application verifiedFacts`);
    for (const src of withFacts) {
      for (const f of src.verifiedFacts ?? []) {
        const sourceRef = f.match(/source:([^|]+)/)?.[1];
        assert.ok(sourceRef && byId.has(sourceRef), `${id} fact references missing source ${sourceRef}`);
      }
    }
  }

  assert.equal(audit.unresolvedSourceIds.length, 0, "no unresolved sourceIds");
});

test("7: review-pending priority records remain non-verified", () => {
  const live = loadLive();
  for (const id of REVIEW_PENDING_SAMPLE) {
    const item = live.items.find((i) => i.id === id);
    assert.ok(item, id);
    assert.equal(strictPublicationContractPasses(item), false, id);
    assert.notEqual(classifyVacancyTrust(item), "VERIFIED_PUBLISHED", id);
  }
});

test("8: verified count equals strict-contract-passing open records on display", () => {
  const live = loadLive();
  const summary = computePublicVacancySummary(live.items, AUDIT_CLOCK);
  const strictOnDisplay = summary.displayed.filter((i) => strictPublicationContractPasses(i));
  assert.equal(summary.fullyVerified, 7);
  assert.equal(summary.fullyVerified, strictOnDisplay.length);
});

test("10-11: apprenticeship record is identifiable; SBI is regular recruitment", () => {
  const live = loadLive();
  const nia = live.items.find((i) => i.id === "new-india-assurance-apprentice-2026-27");
  const sbi = live.items.find((i) => i.id === "sbi-po-2026");
  assert.match(`${nia.title} ${nia.trustNote}`.toLowerCase(), /apprentice/);
  assert.match(`${sbi.title} ${sbi.vacanciesText}`.toLowerCase(), /probationary officer/);
});

test("12: no placeholder phrases in verified record text fields", () => {
  const live = loadLive();
  for (const id of STRICT_READY_IDS) {
    const item = live.items.find((i) => i.id === id);
    const blob = JSON.stringify(item);
    assert.ok(!PLACEHOLDER_RE.test(blob), `${id} contains placeholder phrase`);
  }
});

test("18: source-repaired strict-ready records do not use generic homepages as notice URL", () => {
  const live = loadLive();
  for (const id of STRICT_READY_IDS) {
    const item = live.items.find((i) => i.id === id);
    const notice = String(item.officialNotificationUrl || item.officialNoticeUrl || "");
    assert.ok(/\.pdf|documents\/|assets\/docs\//i.test(notice), `${id} notice should be direct document`);
  }
});

test("partial verification script exists in repo", () => {
  const script = path.join(ROOT, "tools", "apply-partial-vacancy-verification.mjs");
  assert.ok(existsSync(script));
});
