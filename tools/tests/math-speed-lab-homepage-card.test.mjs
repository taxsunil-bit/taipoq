#!/usr/bin/env node
/**
 * Math Speed Lab homepage practice card — focused regression tests.
 * Run: node --test tools/tests/math-speed-lab-homepage-card.test.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const HOME = readFileSync(path.join(ROOT, "src/routes/index.tsx"), "utf8");
const NAV = readFileSync(path.join(ROOT, "src/components/NavBar.tsx"), "utf8");
const BOTTOM = readFileSync(path.join(ROOT, "src/components/MobileBottomNav.tsx"), "utf8");
const DM = readFileSync(path.join(ROOT, "src/components/DailyMissionSection.tsx"), "utf8");

function preparationToolsBlock() {
  const start = HOME.indexOf("function PreparationTools");
  const end = HOME.indexOf("function ChooseYourExam");
  return HOME.slice(start, end);
}

function mathSpeedLabCardBlock() {
  const block = preparationToolsBlock();
  const start = block.indexOf('title="Math Speed Lab"');
  const next = block.indexOf('title="Daily Mission"', start);
  return block.slice(start, next > -1 ? next : undefined);
}

test("homepage contains exactly one Math Speed Lab preparation-tool card", () => {
  const titles = HOME.match(/title="Math Speed Lab"/g) ?? [];
  assert.equal(titles.length, 1);
});

test("Math Speed Lab card links to /math-speed-lab", () => {
  const block = mathSpeedLabCardBlock();
  assert.match(block, /to="\/math-speed-lab"/);
});

test("primary preparation tools order: Tests, PYQs, Math Speed Lab, Daily Mission", () => {
  const block = preparationToolsBlock();
  const testsIdx = block.indexOf('title="Mock Tests"');
  const pyqIdx = block.indexOf('title="Verified PYQs"');
  const mslIdx = block.indexOf('title="Math Speed Lab"');
  const missionIdx = block.indexOf('title="Daily Mission"');
  assert.ok(testsIdx > -1 && pyqIdx > -1 && mslIdx > -1 && missionIdx > -1);
  assert.ok(testsIdx < pyqIdx);
  assert.ok(pyqIdx < mslIdx);
  assert.ok(mslIdx < missionIdx);
});

test("Math Speed Lab appears after Tests and before English Typing links", () => {
  const mslIdx = HOME.indexOf('title="Math Speed Lab"');
  const engIdx = HOME.indexOf("English Typing Practice");
  const hinIdx = HOME.indexOf("Hindi Typing Practice");
  assert.ok(mslIdx > -1 && engIdx > -1 && hinIdx > -1);
  assert.ok(mslIdx < engIdx);
  assert.ok(engIdx < hinIdx);
});

test("Math Speed Lab card copy and Early Access badge", () => {
  const msl = mathSpeedLabCardBlock();
  assert.match(msl, /hindiTitle="तीव्र गणना अभ्यास"/);
  assert.match(msl, /वर्ग, पूरक और निकट-आधार गुणा की सरल तकनीकों से गणना गति बढ़ाएँ।/);
  assert.match(msl, /supportingLabel="3 Techniques · Lesson \+ Direct Practice"/);
  assert.match(msl, /cta="गणना अभ्यास आरम्भ करें"/);
  assert.match(msl, /badge="Early Access"/);
});

test("homepage does not use forbidden promotional claims on Math Speed Lab card", () => {
  const msl = mathSpeedLabCardBlock();
  for (const phrase of [
    "Vedic Maths",
    "Complete Course",
    "Official",
    "Public Release",
    "Full Course",
    "All Techniques",
  ]) {
    assert.doesNotMatch(msl, new RegExp(phrase));
  }
});

test("homepage still has one H1 and no legacy duplicate homepage", () => {
  assert.equal((HOME.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(HOME, /function HomeDesktop\(/);
  assert.doesNotMatch(HOME, /Master precision and speed/);
});

test("Math Speed Lab is not in Daily Mission or mobile bottom navigation", () => {
  assert.doesNotMatch(DM, /math-speed-lab|Math Speed Lab/i);
  assert.doesNotMatch(BOTTOM, /math-speed-lab|Math Speed Lab/i);
});

test("existing homepage module links remain", () => {
  for (const fragment of [
    "/tests",
    "/english/practice",
    "/hindi/practice",
    "/study-corner",
    "/word-learning",
    "/upcoming-exams",
    "/progress",
    "DailyMissionSection",
  ]) {
    assert.match(HOME, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("preparation tools section is present on homepage", () => {
  assert.match(HOME, /function PreparationTools/);
  assert.match(HOME, /<PreparationTools \/>/);
});

test("Math Speed Lab routes remain in registry", () => {
  assert.equal(existsSync(path.join(ROOT, "src/routes/math-speed-lab.index.tsx")), true);
  assert.equal(
    existsSync(path.join(ROOT, "src/routes/math-speed-lab.complements-10n.practice.direct.tsx")),
    true,
  );
});

test("navbar primary links do not add Math Speed Lab to top navigation", () => {
  const primaryStart = NAV.indexOf("const primaryLinks");
  const utilityStart = NAV.indexOf("const utilityLinks");
  const primary = NAV.slice(primaryStart, utilityStart);
  assert.doesNotMatch(primary, /math-speed-lab|Math Speed Lab/);
});

test("MSL module landing copy has approved student-facing wording", () => {
  const mod = readFileSync(path.join(ROOT, "src/content/math-speed-lab/module.ts"), "utf8");
  assert.doesNotMatch(mod, /direct URL only/i);
  assert.doesNotMatch(mod, /Local pilot canary/i);
  assert.match(
    mod,
    /Learn reliable calculation techniques through clear lessons, worked examples and direct practice/,
  );
});
