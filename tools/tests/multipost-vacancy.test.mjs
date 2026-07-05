// Batch B3 — multi-post vacancy schema tests (15 scenarios).

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateMultipostRecord,
  multipostStrictContractPasses,
  isMultipostPlaceholderText,
  diffPostGroups,
  MULTIPOST_ERROR_CODES,
} from "../../src/lib/vacancyMultipost.mjs";
import { strictPublicationContractPasses } from "../../src/lib/vacanciesSource.mjs";
import { semanticDiff } from "../vacancy-update-lib.mjs";
import { VERIFIED_PUBLISHED, baseItem, payload } from "./_fixtures.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const REAL_DATA = path.join(ROOT, "public", "data");

function fact(key, value) {
  return `fact:${key}|value:${value}|source:src-1|verifiedAt:2026-07-05`;
}

function validPostGroup(overrides = {}) {
  return {
    id: "group-a",
    title: "Group A",
    postCodes: ["001"],
    vacancies: { total: 5 },
    qualification: "First Class B.Sc. in Physics from recognised university",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 7 — Rs 44,900/month",
    sourceIds: ["src-1"],
    verifiedFacts: [fact("vacancies", "5")],
    ...overrides,
  };
}

function verifiedMultipost(overrides = {}) {
  return {
    ...VERIFIED_PUBLISHED,
    id: "multi-1",
    slug: "multi-1",
    advertisementNumber: "ADV/01/2026",
    totalVacancies: 5,
    sourceIds: ["src-1"],
    postGroups: [validPostGroup()],
    ...overrides,
  };
}

function validate(item, knownSourceIds = new Set(["src-1"])) {
  const errors = [];
  const warnings = [];
  validateMultipostRecord(item, { errors, warnings, rowLabel: "test", knownSourceIds });
  return errors;
}

test("1: valid single-post verified record passes without postGroups", () => {
  assert.equal(strictPublicationContractPasses(VERIFIED_PUBLISHED), true);
  assert.equal(validate(VERIFIED_PUBLISHED).length, 0);
});

test("2: valid multi-post verified record passes strict contract", () => {
  const item = verifiedMultipost();
  assert.equal(multipostStrictContractPasses(item), true);
  assert.equal(strictPublicationContractPasses(item), true);
  assert.equal(validate(item).length, 0);
});

test("3: multi-post total mismatch is rejected", () => {
  const item = verifiedMultipost({ totalVacancies: 99 });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.TOTAL_MISMATCH)));
  assert.equal(multipostStrictContractPasses(item), false);
});

test("4: duplicate post group ID is rejected", () => {
  const item = verifiedMultipost({
    totalVacancies: 10,
    postGroups: [validPostGroup({ vacancies: { total: 5 } }), validPostGroup({ vacancies: { total: 5 } })],
  });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.DUPLICATE_ID)));
});

test("5: duplicate post code is rejected", () => {
  const item = verifiedMultipost({
    totalVacancies: 10,
    postGroups: [
      validPostGroup({ id: "g1", postCodes: ["001"], vacancies: { total: 5 } }),
      validPostGroup({ id: "g2", postCodes: ["001"], vacancies: { total: 5 } }),
    ],
  });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.DUPLICATE_CODE)));
});

test("6: missing qualification is rejected", () => {
  const item = verifiedMultipost({ postGroups: [validPostGroup({ qualification: "" })] });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.PLACEHOLDER)));
});

test("7: placeholder qualification is rejected", () => {
  assert.equal(isMultipostPlaceholderText("Post-wise; View official notice"), true);
  const item = verifiedMultipost({
    postGroups: [validPostGroup({ qualification: "Post-wise; View official notice" })],
  });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.PLACEHOLDER)));
});

test("8: missing nested source is rejected", () => {
  const item = verifiedMultipost({
    postGroups: [validPostGroup({ sourceIds: ["missing-src"] })],
  });
  const errors = validate(item, new Set(["src-1"]));
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.SOURCE_UNRESOLVED)));
});

test("9: missing nested verified facts is rejected for published record", () => {
  const item = verifiedMultipost({ postGroups: [validPostGroup({ verifiedFacts: [] })] });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.FACTS_MISSING)));
  assert.equal(multipostStrictContractPasses(item), false);
});

test("10: invalid age range is rejected", () => {
  const item = verifiedMultipost({
    postGroups: [validPostGroup({ ageMinimum: 40, ageMaximum: 30 })],
  });
  const errors = validate(item);
  assert.ok(errors.some((e) => e.includes(MULTIPOST_ERROR_CODES.AGE_INVALID)));
});

test("11: legacy record without postGroups remains valid", () => {
  const legacy = baseItem({ id: "legacy-mp", sourceUrl: "https://example.gov.in/n" });
  assert.equal(validate(legacy).length, 0);
  assert.equal(multipostStrictContractPasses(legacy), true);
});

test("12: review-pending multi-post record fails strict contract", () => {
  const item = verifiedMultipost({ verificationStatus: "pending", lifecycleStatus: "review" });
  assert.equal(strictPublicationContractPasses(item), false);
});

test("13: transaction rollback restores nested postGroups", () => {
  const sandbox = mkdtempSync(path.join(os.tmpdir(), "mp-rb-"));
  const data = path.join(sandbox, "data");
  const backups = path.join(sandbox, "backups", "content");
  mkdirSync(data, { recursive: true });
  mkdirSync(backups, { recursive: true });

  const basePayload = {
    lastUpdated: "2026-07-01",
    source: "fixture",
    items: [baseItem({ id: "nested-test", slug: "nested-test" })],
  };
  writeFileSync(path.join(data, "vacancies.json"), JSON.stringify(basePayload));
  writeFileSync(path.join(data, "vacancies.preview.json"), JSON.stringify(basePayload));
  for (const f of ["vacancy-sources.json", "content-registry.json"]) {
    copyFileSync(path.join(REAL_DATA, f), path.join(data, f));
  }

  const withNested = {
    ...basePayload,
    items: [
      {
        ...baseItem({ id: "nested-test", slug: "nested-test" }),
        postGroups: [validPostGroup({ id: "rollback-test" })],
      },
    ],
  };
  writeFileSync(path.join(data, "vacancies.json"), JSON.stringify(withNested));

  const backupId = "20260705_rb_test";
  const bdir = path.join(backups, backupId);
  mkdirSync(bdir, { recursive: true });
  writeFileSync(path.join(bdir, "vacancies.json"), JSON.stringify(basePayload));

  const restored = JSON.parse(readFileSync(path.join(bdir, "vacancies.json"), "utf8"));
  const item = restored.items.find((i) => i.id === "nested-test");
  assert.equal(item?.postGroups, undefined);
  rmSync(sandbox, { recursive: true, force: true });
});

test("14: semantic diff reports changed post vacancy count", () => {
  const before = verifiedMultipost();
  const after = verifiedMultipost({
    postGroups: [validPostGroup({ vacancies: { total: 8 } })],
    totalVacancies: 8,
  });
  const diff = diffPostGroups(before, after);
  assert.deepEqual(diff.modified, ["group-a"]);
  assert.equal(diff.vacancyCountChanges[0].from, 5);
  assert.equal(diff.vacancyCountChanges[0].to, 8);
});

test("15: semantic diff reports added and removed post groups", () => {
  const before = verifiedMultipost({ postGroups: [validPostGroup({ id: "keep" })] });
  const after = verifiedMultipost({
    totalVacancies: 5,
    postGroups: [validPostGroup({ id: "new-group" })],
  });
  const diff = diffPostGroups(before, after);
  assert.deepEqual(diff.added, ["new-group"]);
  assert.deepEqual(diff.removed, ["keep"]);

  const live = payload([before]);
  const preview = payload([after]);
  const sem = semanticDiff(live, preview);
  assert.equal(sem.postGroupChanges.length, 1);
  assert.equal(sem.postGroupChanges[0].id, "multi-1");
});
