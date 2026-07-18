#!/usr/bin/env node
/**
 * Mobile vacancy card readability / hierarchy regression tests (source-level).
 * Run: node --test tools/tests/mobile-vacancy-card-readability.test.mjs
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CARD = readFileSync(path.join(ROOT, "src/components/VerifiedVacancyCard.tsx"), "utf8");
const SHELL = readFileSync(path.join(ROOT, "src/components/PageShell.tsx"), "utf8");
const NAV = readFileSync(path.join(ROOT, "src/components/NavBar.tsx"), "utf8");

test("Apply Window uses high-contrast Calm Spatial success styling", () => {
  assert.match(CARD, /status-success-container/);
  assert.match(CARD, /status-success/);
  assert.doesNotMatch(CARD, /text-emerald-100/);
  assert.doesNotMatch(CARD, /bg-emerald-500\/10/);
});

test("Verified badge uses readable semantic styling", () => {
  assert.match(CARD, /BADGE_VERIFIED/);
  assert.match(CARD, /status-success/);
  assert.doesNotMatch(CARD, /text-emerald-300/);
});

test("Applications Open / status badges are distinguishable from Verified", () => {
  assert.match(CARD, /statusBadgeClass/);
  assert.match(CARD, /status-info/);
  assert.match(CARD, /closing_soon/);
  assert.match(CARD, /status-warning/);
});

test("pending/legacy listings are excluded from VerifiedVacancyCard", () => {
  assert.match(CARD, /isFullyVerified/);
  assert.match(CARD, /if \(!isFullyVerified\)/);
  assert.doesNotMatch(CARD, /Open listing — verification review pending/);
  assert.doesNotMatch(CARD, /text-slate-200/);
  assert.doesNotMatch(CARD, /bg-slate-500\/15/);
});

test("status pill uses derived application state (not static Applications Open)", () => {
  assert.match(CARD, /resolveVacancyPublicStatusLabel/);
  assert.match(CARD, /computeVacancyApplicationState/);
  assert.doesNotMatch(CARD, /formatVacancyStatusLabel\(item\.status\)/);
});

test("no animate-pulse skeleton in VerifiedVacancyCard", () => {
  assert.doesNotMatch(CARD, /animate-pulse/);
  assert.doesNotMatch(CARD, /Skeleton/);
});

test("mobile collapsed card hides long notice/exam until expanded", () => {
  assert.match(CARD, /!expanded && "hidden md:block"/);
  assert.match(CARD, /Show Details/);
  assert.match(CARD, /aria-expanded=\{expanded\}/);
  assert.match(CARD, /aria-controls=\{detailsId\}/);
  assert.match(CARD, /Mobile actions early/);
});

test("mobile collapsed card has at most two dominant actions", () => {
  const mobileBlockStart = CARD.indexOf("Mobile actions early");
  assert.ok(mobileBlockStart > -1, "mobile action block present");
  const afterActions = CARD.indexOf('{cn("space-y-1", !expanded', mobileBlockStart);
  assert.ok(afterActions > mobileBlockStart, "mobile actions followed by deferred details");
  const mobileBlock = CARD.slice(mobileBlockStart, afterActions);
  const dominantButtons = (
    mobileBlock.match(/buttonVariants\(\{ variant: "(default|outline)"/g) || []
  ).length;
  assert.ok(dominantButtons <= 2, `expected ≤2 dominant mobile actions, found ${dominantButtons}`);
  assert.match(mobileBlock, /Show Details/);
  assert.match(mobileBlock, /Official Notice/);
  assert.match(mobileBlock, /Official Source/);
  assert.match(mobileBlock, /underline-offset-4/);
  assert.doesNotMatch(mobileBlock, /PreparationLinkButton/);
});

test("Official Notice and Official Source URLs remain wired", () => {
  assert.match(CARD, /item\.officialNoticeUrl/);
  assert.match(CARD, /item\.sourceUrl/);
  assert.match(CARD, /vacancy-official-notice/);
  assert.match(CARD, /vacancy-official-source/);
});

test("preparation links move to expanded details on mobile", () => {
  assert.match(CARD, /item\.preparationLinks\.map/);
  const expandedIdx = CARD.indexOf("id={detailsId}");
  const prepInExpanded = CARD.indexOf("item.preparationLinks.map", expandedIdx);
  assert.ok(prepInExpanded > expandedIdx, "prep links remain available in expanded details");
});

test("bottom padding clears fixed mobile navigation with safe-area", () => {
  const styles = readFileSync(path.join(ROOT, "src/styles.css"), "utf8");
  assert.match(SHELL, /safe-area-inset-bottom/);
  assert.match(SHELL, /5\.75rem/);
  assert.match(NAV, /safe-area-inset-bottom/);
  assert.match(styles, /scroll-padding-bottom:\s*calc\(5\.75rem/);
});

test("touch targets remain at least 44px (min-h-11)", () => {
  assert.match(CARD, /min-h-11/);
  assert.match(CARD, /touchBtn/);
});

test("trust gating for Verified Open Job is preserved", () => {
  assert.match(CARD, /classifyVacancyTrust/);
  assert.match(CARD, /isFullyVerified/);
  const idx = CARD.indexOf("isFullyVerified");
  const verifiedIdx = CARD.indexOf("Verified Open Job");
  assert.ok(idx >= 0 && verifiedIdx > idx);
});
