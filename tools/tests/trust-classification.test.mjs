// Part E — trust/publication classification tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyVacancyTrust,
  strictPublicationContractPasses,
  getVacancyTrustLabel,
} from "../../src/lib/vacanciesSource.mjs";
import {
  VERIFIED_PUBLISHED,
  LEGACY_PUBLIC,
  REVIEW_PENDING,
  REVIEW_PUBLISHED_INCOMPLETE,
  EXCLUDED_DRAFT,
  EXCLUDED_ARCHIVE,
} from "./_fixtures.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

test("7: fully verified new-model record is VERIFIED_PUBLISHED", () => {
  assert.equal(classifyVacancyTrust(VERIFIED_PUBLISHED), "VERIFIED_PUBLISHED");
  assert.equal(strictPublicationContractPasses(VERIFIED_PUBLISHED), true);
});

test("8: preserved legacy record is LEGACY_PUBLIC_UNVERIFIED (not verified)", () => {
  assert.equal(classifyVacancyTrust(LEGACY_PUBLIC), "LEGACY_PUBLIC_UNVERIFIED");
  assert.equal(strictPublicationContractPasses(LEGACY_PUBLIC), false);
});

test("9: verification_pending record is REVIEW_REQUIRED", () => {
  assert.equal(classifyVacancyTrust(REVIEW_PENDING), "REVIEW_REQUIRED");
});

test("10: draft/archive records are EXCLUDED_FROM_PUBLIC", () => {
  assert.equal(classifyVacancyTrust(EXCLUDED_DRAFT), "EXCLUDED_FROM_PUBLIC");
  assert.equal(classifyVacancyTrust(EXCLUDED_ARCHIVE), "EXCLUDED_FROM_PUBLIC");
});

test("12: incomplete opted-in published record is REVIEW_REQUIRED (blocked)", () => {
  assert.equal(strictPublicationContractPasses(REVIEW_PUBLISHED_INCOMPLETE), false);
  assert.equal(classifyVacancyTrust(REVIEW_PUBLISHED_INCOMPLETE), "REVIEW_REQUIRED");
});

test("11: public UI shows a verified marker only for VERIFIED_PUBLISHED", () => {
  const card = readFileSync(path.join(ROOT, "src", "components", "VerifiedVacancyCard.tsx"), "utf8");
  // The verified badge must be gated behind the classification, not hardcoded.
  assert.ok(/classifyVacancyTrust/.test(card), "card uses classifyVacancyTrust");
  assert.ok(/isFullyVerified/.test(card), "card computes fully-verified gate");
  // Legacy records get a truthful neutral marker, not "Verified".
  assert.ok(/verification review pending/i.test(card), "card shows neutral legacy marker");
  // Verified label must be inside the isFullyVerified branch.
  const idx = card.indexOf("isFullyVerified");
  const verifiedIdx = card.indexOf("Verified Open Job");
  assert.ok(idx >= 0 && verifiedIdx > idx, "Verified Open Job label is gated by isFullyVerified");
});

test("trust labels are concise and truthful", () => {
  assert.equal(getVacancyTrustLabel("VERIFIED_PUBLISHED"), "Verified Open Job");
  assert.match(getVacancyTrustLabel("LEGACY_PUBLIC_UNVERIFIED"), /verification review pending/i);
});
