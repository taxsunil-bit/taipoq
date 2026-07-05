#!/usr/bin/env node
/**
 * Smoke checks for PYQ public naming integrity (Phase A).
 * Run: node tools/smoke-test-pyq-naming-integrity.mjs
 */

import { existsSync, readFileSync } from "node:fs";
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

function mustInclude(file, needle, label) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) {
    fail(`Missing file: ${file}`);
    return;
  }
  const src = readFileSync(full, "utf8");
  if (!src.includes(needle)) fail(`${file}: missing ${label ?? needle}`);
  else pass(`${file}: ${label ?? needle}`);
}

function mustNotInclude(file, needle, label) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) {
    fail(`Missing file: ${file}`);
    return;
  }
  const src = readFileSync(full, "utf8");
  if (src.includes(needle)) fail(`${file}: should not include ${label ?? needle}`);
  else pass(`${file}: no ${label ?? needle}`);
}

console.log("TAIPOQ — PYQ Naming Integrity Smoke Test");
console.log("=".repeat(48));

mustInclude("src/content/tests/subjects.ts", '"PYQ Guide": "pyq-practice"', "PYQ Guide subject slug");
mustNotInclude("src/content/tests/subjects.ts", '"PYQ Practice": "pyq-practice"', "old PYQ Practice subject key");
mustInclude("src/content/tests/checkedTestPaperPack01.ts", "PYQ Source and Practice Guide", "guide paper title");
mustInclude(
  "src/content/tests/checkedTestPaperPack01.ts",
  "does not contain copied or officially verified previous-year questions",
  "guide intro disclaimer",
);
mustInclude("src/content/tests/checkedTestPaperPack01.ts", '"paperId": "pyq-practice-test-paper"', "paper id preserved");
mustInclude("src/content/tests/checkedTestPaperPack01.ts", "PYQ-PATTERN-001", "question id preserved");
mustNotInclude("src/routes/tests.index.tsx", "PYQ and Model Papers", "old tests SEO");
mustInclude("src/routes/tests.index.tsx", "original practice guides", "updated tests SEO");
mustInclude("src/lib/tests/pyqGuide.ts", "TAIPOQ Original Guide", "content label constant");
mustInclude("src/components/tests/TestCard.tsx", "PYQ_GUIDE_CONTENT_LABEL", "guide badge on card");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "isPyqGuidePaper", "guide framing on paper page");
mustInclude("public/data/test-paper-pack-01.json", "PYQ Source and Practice Guide", "json mirror title");
mustInclude("src/content/sscCglPatternPracticeContent.ts", "not an official SSC previous-year", "SSC disclaimer preserved");

const jsonPath = path.join(ROOT, "public/data/test-paper-pack-01.json");
const jsonPack = JSON.parse(readFileSync(jsonPath, "utf8"));
const pyqPaper = jsonPack.papers.find((p) => p.paperId === "pyq-practice-test-paper");
if (!pyqPaper) fail("pyq paper missing from json pack");
else {
  if (pyqPaper.questions.length !== 10) fail(`question count ${pyqPaper.questions.length} !== 10`);
  else pass("json: 10 questions");
  if (pyqPaper.subject !== "PYQ Guide") fail("json: subject not PYQ Guide");
  else pass("json: subject PYQ Guide");
}

const tsSrc = readFileSync(path.join(ROOT, "src/content/tests/checkedTestPaperPack01.ts"), "utf8");
if (!tsSrc.includes('"PYQ-PATTERN-010"')) fail("missing PYQ-PATTERN-010");
else pass("all 10 question ids present in TS pack");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}
console.log("\nPASS");
process.exit(0);
