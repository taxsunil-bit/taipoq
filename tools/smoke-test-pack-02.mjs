#!/usr/bin/env node
/**
 * Smoke test for Current Affairs Tough Practice Pack 02.
 * Run: npm run smoke:pack-02
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors = [];
const checks = [];

function fail(msg) {
  errors.push(msg);
}

function pass(msg) {
  checks.push(msg);
}

function read(rel) {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

function mustExist(rel) {
  const full = path.join(ROOT, rel);
  if (!existsSync(full)) {
    fail(`Missing file: ${rel}`);
    return false;
  }
  pass(`File exists: ${rel}`);
  return true;
}

function mustInclude(rel, needle, label) {
  if (!mustExist(rel)) return;
  const content = read(rel);
  if (!content.includes(needle)) {
    fail(`${rel}: expected ${label ?? `"${needle}"`}`);
    return;
  }
  pass(`${rel}: contains ${label ?? needle}`);
}

console.log("TAIPOQ — Pack 02 Smoke Test");
console.log("=".repeat(48));

// 1. Required files
const requiredFiles = [
  "public/data/test-paper-pack-02.json",
  "src/content/tests/currentAffairsToughPack02.ts",
  "src/components/ToughMockChallengePopup.tsx",
  "src/routes/model-paper.current-affairs-pack-02.tsx",
  "src/routes/mock-test.current-affairs-pack-02.tsx",
  "src/routes/model-paper.index.tsx",
  "src/routes/mock-test.tsx",
  "src/routes/current-affairs.index.tsx",
  "src/routes/tests.index.tsx",
  "src/routes/index.tsx",
];

for (const f of requiredFiles) mustExist(f);

// 2. Route tree registration
mustInclude("src/routeTree.gen.ts", "/model-paper/current-affairs-pack-02", "model paper route");
mustInclude("src/routeTree.gen.ts", "/mock-test/current-affairs-pack-02", "mock test route");
mustInclude("src/routeTree.gen.ts", "/current-affairs", "current-affairs route");
mustInclude("src/routeTree.gen.ts", "/tests", "tests route");

// 3. Route file content
mustInclude(
  "src/routes/model-paper.current-affairs-pack-02.tsx",
  "CurrentAffairsPack02ModelPaperView",
  "model paper component import",
);
mustInclude(
  "src/routes/mock-test.current-affairs-pack-02.tsx",
  "CurrentAffairsPack02MockTestView",
  "mock test component import",
);
mustInclude(
  "src/routes/model-paper.current-affairs-pack-02.tsx",
  "/model-paper/current-affairs-pack-02",
  "model paper route path",
);
mustInclude(
  "src/routes/mock-test.current-affairs-pack-02.tsx",
  "/mock-test/current-affairs-pack-02",
  "mock test route path",
);

// 4. Listing pages reference Pack 02
mustInclude("src/routes/current-affairs.index.tsx", "CurrentAffairsToughPack02Card", "CA Pack 02 card");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsToughPack02Card.tsx", "/model-paper/current-affairs-pack-02", "CA model link");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsToughPack02Card.tsx", "/mock-test/current-affairs-pack-02", "CA mock link");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsToughPack02Card.tsx", "New Tough Challenge", "featured badge");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsToughPack02Card.tsx", "Start Mock Test", "primary CTA");
mustInclude("src/routes/tests.index.tsx", "CurrentAffairsToughPack02Card", "tests Pack 02 card");

// Pack 02 featured near top (before main content sections)
const caIndex = read("src/routes/current-affairs.index.tsx");
const caCardPos = caIndex.indexOf("CurrentAffairsToughPack02Card");
const caMixedPos = caIndex.indexOf("Mixed Practice");
const caPapersPos = caIndex.indexOf("ca-papers-heading");
if (caCardPos === -1 || caCardPos > caMixedPos || caCardPos > caPapersPos) {
  fail("current-affairs: Pack 02 card must appear near top, before mixed practice and paper list");
} else {
  pass("current-affairs: Pack 02 card is top-highlighted");
}

const testsIndex = read("src/routes/tests.index.tsx");
const testsCardPos = testsIndex.indexOf("CurrentAffairsToughPack02Card");
const testsSubjectsPos = testsIndex.indexOf("basic-subjects-heading");
const testsPapersPos = testsIndex.indexOf("all-papers-heading");
if (testsCardPos === -1 || testsCardPos > testsSubjectsPos || testsCardPos > testsPapersPos) {
  fail("tests: Pack 02 card must appear near top, before subject grid and paper list");
} else {
  pass("tests: Pack 02 card is top-highlighted");
}

// 5. Home popup mount
mustInclude("src/routes/index.tsx", "ToughMockChallengePopup", "home popup mount");

// 6. Popup component behavior markers
mustInclude("src/components/ToughMockChallengePopup.tsx", "taipoq_tough_mock_popup_dismissed_at", "storage key");
mustInclude("src/components/ToughMockChallengePopup.tsx", "/mock-test/current-affairs-pack-02", "mock test link");
mustInclude("src/components/ToughMockChallengePopup.tsx", "localStorage", "localStorage usage");
mustInclude("src/components/ToughMockChallengePopup.tsx", "Escape", "escape key handler");
mustInclude("src/components/ToughMockChallengePopup.tsx", "tough-popup-overlay", "overlay click target");
mustInclude("src/components/ToughMockChallengePopup.tsx", "1024px", "desktop lg breakpoint");

// 7. Pack 02 JSON validation
const pack02Path = path.join(ROOT, "public/data/test-paper-pack-02.json");
const pack01Path = path.join(ROOT, "public/data/test-paper-pack-01.json");

let pack02;
try {
  pack02 = JSON.parse(readFileSync(pack02Path, "utf8"));
} catch (e) {
  fail(`Invalid Pack 02 JSON: ${e.message}`);
  pack02 = null;
}

const pack01Ids = new Set();
if (existsSync(pack01Path)) {
  try {
    const pack01 = JSON.parse(readFileSync(pack01Path, "utf8"));
    for (const paper of pack01.papers ?? []) {
      for (const q of paper.questions ?? []) pack01Ids.add(q.id);
    }
  } catch {
    fail("Could not parse Pack 01 JSON for collision check");
  }
}

if (pack02) {
  const questions = pack02.questions ?? [];
  if (questions.length !== 30) fail(`Pack 02 must have 30 questions, got ${questions.length}`);
  else pass("Pack 02 has 30 questions");

  if (pack02.totalQuestions !== 30) fail(`totalQuestions must be 30, got ${pack02.totalQuestions}`);
  else pass("totalQuestions is 30");

  const ids = new Set();
  for (let i = 1; i <= 30; i += 1) {
    const expected = `ca-tough-2026-p02-q${String(i).padStart(3, "0")}`;
    if (!questions.some((q) => q.id === expected)) {
      fail(`Missing expected ID: ${expected}`);
    }
  }
  pass("All IDs ca-tough-2026-p02-q001..q030 present");

  for (const q of questions) {
    if (ids.has(q.id)) fail(`Duplicate ID: ${q.id}`);
    ids.add(q.id);
    if (pack01Ids.has(q.id)) fail(`${q.id} collides with Pack 01`);
    if (!Array.isArray(q.options) || q.options.length !== 4) fail(`${q.id}: needs 4 options`);
    if (q.answerIndex < 0 || q.answerIndex > 3) fail(`${q.id}: bad answerIndex`);
    if (q.options[q.answerIndex] !== q.answer) fail(`${q.id}: answer mismatch`);
    if (!String(q.explanation ?? "").trim()) fail(`${q.id}: missing explanation`);
  }
  if (ids.size === 30) pass("All 30 IDs unique with valid options/answers/explanations");
  if ([...ids].every((id) => !pack01Ids.has(id))) pass("No Pack 01 ID collisions");
}

// 8. Pack 01 data files untouched (mtime/content hash not checked — only ensure we didn't embed edits)
mustInclude("src/lib/tests/testGenerator.ts", "checkedTestPaperPack01", "Pack 01 still wired in generator");

// 9. Mock test view expectations
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx", "scoringContract.durationSeconds", "30-min timer");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx", "scorePack02MockTest", "shared scoring");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx", "handleRetake", "retake support");
mustInclude("src/components/current-affairs-pack-02/CurrentAffairsPack02ModelPaperView.tsx", "revealAnswer", "study mode answers");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
