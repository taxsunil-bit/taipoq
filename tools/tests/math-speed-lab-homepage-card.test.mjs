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

function practiceActionsBlock() {
  const start = HOME.indexOf("const DESKTOP_PRACTICE_ACTIONS");
  const end = HOME.indexOf("] as const;", start);
  return HOME.slice(start, end);
}

function mathSpeedLabCardBlock() {
  const block = practiceActionsBlock();
  const start = block.indexOf('title: "Math Speed Lab"');
  const next = block.indexOf('title: "English Typing Practice"', start);
  return block.slice(start, next);
}

test("homepage contains exactly one Math Speed Lab practice card entry", () => {
  const mslCardTitles = (HOME.match(/title: "Math Speed Lab"/g) ?? []).length;
  assert.equal(mslCardTitles, 1);
  const mslRoutes = (HOME.match(/to: "\/math-speed-lab"/g) ?? []).length;
  assert.equal(mslRoutes, 1);
});

test("Math Speed Lab card links to /math-speed-lab", () => {
  assert.match(HOME, /to: "\/math-speed-lab" as const/);
});

test("primary practice card order: Tests, Math Speed Lab, English, Hindi, Library, Word Learning", () => {
  const block = practiceActionsBlock();
  const testsIdx = block.indexOf('title: "परीक्षा अभ्यास / Tests"');
  const mslIdx = block.indexOf('title: "Math Speed Lab"');
  const engIdx = block.indexOf('title: "English Typing Practice"');
  const hinIdx = block.indexOf('title: "Hindi Typing Practice"');
  const libIdx = block.indexOf("STUDY_CORNER_LANDING.homeCard.title");
  const wordIdx = block.indexOf('title: "शब्द अभ्यास / Word Learning"');
  assert.ok(
    testsIdx > -1 && mslIdx > -1 && engIdx > -1 && hinIdx > -1 && libIdx > -1 && wordIdx > -1,
  );
  assert.ok(testsIdx < mslIdx);
  assert.ok(mslIdx < engIdx);
  assert.ok(engIdx < hinIdx);
  assert.ok(hinIdx < libIdx);
  assert.ok(libIdx < wordIdx);
});

test("Math Speed Lab card copy and Pilot badge", () => {
  assert.match(HOME, /hindiTitle: "तीव्र गणना अभ्यास"/);
  assert.match(HOME, /वर्ग, पूरक और निकट-आधार गुणा की सरल तकनीकों से गणना गति बढ़ाएँ।/);
  assert.match(HOME, /supportingLabel: "3 Techniques · Lesson \+ Direct Practice"/);
  assert.match(HOME, /cta: "गणना अभ्यास आरम्भ करें"/);
  assert.match(HOME, /badge: "Pilot"/);
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

test("practice grid is visible on mobile and desktop", () => {
  assert.doesNotMatch(HOME, /hidden md:block[\s\S]*HomeDesktopPracticeSection/);
  assert.match(HOME, /<HomeDesktopPracticeSection \/>/);
});

test("Math Speed Lab routes remain in registry", () => {
  assert.equal(existsSync(path.join(ROOT, "src/routes/math-speed-lab.index.tsx")), true);
  assert.equal(
    existsSync(path.join(ROOT, "src/routes/math-speed-lab.complements-10n.practice.direct.tsx")),
    true,
  );
});

test("MSL module landing copy has no false direct-URL-only wording", () => {
  const mod = readFileSync(path.join(ROOT, "src/content/math-speed-lab/module.ts"), "utf8");
  assert.doesNotMatch(mod, /direct URL only/i);
  assert.match(mod, /Pilot learning module with lessons and direct practice for calculation speed/);
});

test("navbar does not add Math Speed Lab to site navigation", () => {
  assert.doesNotMatch(NAV, /math-speed-lab|Math Speed Lab/);
});
