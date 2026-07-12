#!/usr/bin/env node
/**
 * DOM/SSR/public-identity reconciliation regression tests (source-level + snapshot helpers).
 * Run: node --test tools/tests/dom-ssr-public-identity.test.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const HOME = readFileSync(path.join(ROOT, "src/routes/index.tsx"), "utf8");
const ROOT_ROUTE = readFileSync(path.join(ROOT, "src/routes/__root.tsx"), "utf8");
const NAV = readFileSync(path.join(ROOT, "src/components/NavBar.tsx"), "utf8");
const BOTTOM = readFileSync(path.join(ROOT, "src/components/MobileBottomNav.tsx"), "utf8");
const BRAND = readFileSync(path.join(ROOT, "src/lib/brand.ts"), "utf8");
const MSL_INDEX = readFileSync(path.join(ROOT, "src/routes/math-speed-lab.index.tsx"), "utf8");
const MSL_MODULE = readFileSync(path.join(ROOT, "src/content/math-speed-lab/module.ts"), "utf8");
const DM_LIB = readFileSync(path.join(ROOT, "src/lib/dailyMission.ts"), "utf8");
const DM_SECTION = readFileSync(path.join(ROOT, "src/components/DailyMissionSection.tsx"), "utf8");
const DM_PAGE = readFileSync(path.join(ROOT, "src/routes/daily-mission.tsx"), "utf8");
const TESTS = readFileSync(path.join(ROOT, "src/routes/tests.index.tsx"), "utf8");
const VAC = readFileSync(path.join(ROOT, "src/routes/upcoming-exams.tsx"), "utf8");
const SNAP = readFileSync(path.join(ROOT, "src/lib/vacanciesPublishedSnapshot.ts"), "utf8");

test("homepage source contains Calm Focus headline and single H1", () => {
  assert.match(HOME, /Prepare Smarter\. Progress Every Day\./);
  assert.equal((HOME.match(/<h1\b/g) ?? []).length, 1);
});

test("homepage source rejects typing-first hero residue", () => {
  assert.doesNotMatch(HOME, /Govt Job Computer/);
  assert.doesNotMatch(HOME, /Master precision and speed/);
  assert.doesNotMatch(HOME, /English & Hindi Typing Practice for Job Preparation/);
  assert.doesNotMatch(HOME, /Prototype/);
  assert.doesNotMatch(HOME, /Canary/);
  assert.doesNotMatch(HOME, /Local pilot/);
  assert.doesNotMatch(HOME, /V1\.0/);
});

test("homepage and root metadata use government-exam identity", () => {
  assert.match(BRAND, /Government Exam Preparation, Verified Jobs, PYQs and Mock Tests/);
  assert.match(BRAND, /Prepare for government exams with verified job updates/);
  assert.match(HOME, /SITE_TITLE/);
  assert.match(HOME, /og:title/);
  assert.match(HOME, /twitter:title/);
  assert.match(HOME, /canonical/);
  assert.match(ROOT_ROUTE, /SITE_TITLE/);
  assert.match(ROOT_ROUTE, /og:title/);
  assert.doesNotMatch(ROOT_ROUTE, /English & Hindi Typing Practice for Job Preparation/);
});

test("navigation uses Find Tests and My Progress, not Search/V1.0", () => {
  assert.match(NAV, /Find Tests/);
  assert.match(NAV, /My Progress/);
  assert.doesNotMatch(NAV, /label: "Search"/);
  assert.doesNotMatch(NAV, /V1\.0/);
});

test("mobile bottom navigation remains exactly five items", () => {
  const items = BOTTOM.match(/label: "/g) ?? [];
  assert.equal(items.length, 5);
});

test("Math Speed Lab public wording is student-facing", () => {
  assert.match(MSL_MODULE, /Learn reliable calculation techniques/);
  assert.match(MSL_INDEX, /Early Access/);
  assert.doesNotMatch(MSL_INDEX, /Canary \/ Pilot|Local pilot|not a full public release/);
  assert.doesNotMatch(MSL_MODULE, /Local pilot canary/);
});

test("homepage and Daily Mission share 3-core + optional job wording", () => {
  assert.match(DM_LIB, /preparation activities completed/);
  assert.match(DM_LIB, /Review one verified job update/);
  assert.match(DM_SECTION, /Daily Goal: 3 preparation activities/);
  assert.match(DM_PAGE, /Daily Goal: 3 preparation activities/);
  assert.match(DM_LIB, /DAILY_MISSION_CORE_TASK_ORDER/);
  assert.match(DM_LIB, /optional: true/);
});

test("verified CTET PYQ remains discoverable on tests landing", () => {
  assert.match(TESTS, /Official-Source Verified PYQ/);
  assert.match(TESTS, /PYQ_GUIDE_SUBJECT_SLUG/);
  assert.match(TESTS, /PYQ_GUIDE_PAPER_ID/);
  assert.match(TESTS, /not a verified PYQ/);
});

test("vacancy page uses published snapshot for initial SSR-readable state", () => {
  assert.match(VAC, /getPublishedVacanciesSnapshot/);
  assert.match(SNAP, /vacancies\.json/);
  assert.match(SNAP, /normalizeVacanciesPayload/);
  assert.equal(existsSync(path.join(ROOT, "public/data/vacancies.json")), true);
  assert.match(VAC, /TAIPOQ checks each listing against official sources/);
});

test("footer is grouped Explore / Resources / TAIPOQ", () => {
  assert.match(NAV, /heading: "Explore"/);
  assert.match(NAV, /heading: "Resources"/);
  assert.match(NAV, /heading: "TAIPOQ"/);
  assert.match(NAV, /Math Speed Lab/);
});
