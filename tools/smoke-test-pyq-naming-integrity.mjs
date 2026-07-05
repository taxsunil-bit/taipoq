#!/usr/bin/env node
/**
 * Release-readiness smoke checks for PYQ Guide content and public naming.
 * Run: node tools/smoke-test-pyq-naming-integrity.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PYQ_PAPER_ID = "pyq-practice-test-paper";
const PYQ_SLUG = "pyq-practice";
const EXPECTED_TITLE = "PYQ Verification and Official Sources Guide";
const EXPECTED_IDS = Array.from({ length: 10 }, (_, i) => `PYQ-VERIFY-${String(i + 1).padStart(3, "0")}`);
const EXPECTED_ANSWER_INDEXES = [2, 1, 1, 0, 0, 2, 1, 2, 1, 2];
const WEAK_OLD_PATTERNS = [
  "PYQ-PATTERN-",
  "PYQ Source and Practice Guide",
  "Which tag should be used for a question copied from an official",
  "official_pyq",
];

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

function extractTsPyqPaperBlock(tsSrc) {
  const marker = '"file": "13_PYQ_PRACTICE_TEST_PAPER.md"';
  const start = tsSrc.indexOf(marker);
  if (start < 0) throw new Error("TS PYQ paper marker missing");
  const end =
    tsSrc.indexOf(`"paperId": "${PYQ_PAPER_ID}"`, start) + `"paperId": "${PYQ_PAPER_ID}"`.length;
  return JSON.parse(`{${tsSrc.slice(start, end)}}`);
}

function assertPaper(paper, label) {
  if (paper.title !== EXPECTED_TITLE) fail(`${label}: title "${paper.title}" !== "${EXPECTED_TITLE}"`);
  else pass(`${label}: title`);
  if (paper.subject !== "PYQ Guide") fail(`${label}: subject not PYQ Guide`);
  else pass(`${label}: subject PYQ Guide`);
  if (paper.level !== "basic") fail(`${label}: level "${paper.level}" !== basic`);
  else pass(`${label}: level basic`);
  if (paper.access !== "practice_pass") fail(`${label}: access not practice_pass`);
  else pass(`${label}: access practice_pass`);
  if (paper.durationMinutes !== 10) fail(`${label}: duration ${paper.durationMinutes} !== 10`);
  else pass(`${label}: duration 10 minutes`);
  if (paper.questionCount !== 10) fail(`${label}: questionCount ${paper.questionCount} !== 10`);
  else pass(`${label}: questionCount 10`);
  if (paper.paperId !== PYQ_PAPER_ID) fail(`${label}: paperId mismatch`);
  else pass(`${label}: paperId ${PYQ_PAPER_ID}`);
}

function assertQuestions(questions, label) {
  if (questions.length !== 10) {
    fail(`${label}: ${questions.length} questions !== 10`);
    return;
  }
  pass(`${label}: 10 questions`);

  const ids = questions.map((q) => q.id);
  const unique = new Set(ids);
  if (unique.size !== 10) fail(`${label}: duplicate question ids`);
  else pass(`${label}: unique question ids`);

  for (let i = 0; i < EXPECTED_IDS.length; i++) {
    const expectedId = EXPECTED_IDS[i];
    if (ids[i] !== expectedId) fail(`${label}: id[${i}] ${ids[i]} !== ${expectedId}`);
  }
  if (!errors.some((e) => e.includes(`${label}: id[`))) pass(`${label}: ids PYQ-VERIFY-001..010 in order`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const prefix = `${label} ${q.id}`;

    if (q.level !== "basic") fail(`${prefix}: level "${q.level}" !== basic`);
    if (!Array.isArray(q.options) || q.options.length !== 4) fail(`${prefix}: options count !== 4`);
    else if (q.options.some((o) => !String(o).trim())) fail(`${prefix}: empty option`);
    if (q.answerIndex !== EXPECTED_ANSWER_INDEXES[i]) {
      fail(`${prefix}: answerIndex ${q.answerIndex} !== ${EXPECTED_ANSWER_INDEXES[i]}`);
    }
    const expectedAnswer = q.options[q.answerIndex];
    if (expectedAnswer && q.answer !== expectedAnswer) {
      fail(`${prefix}: answer text does not match answerIndex option`);
    }
    if (!String(q.explanation || "").trim()) fail(`${prefix}: empty explanation`);
    if (!String(q.sourceCheck || "").trim()) fail(`${prefix}: empty sourceCheck`);

    for (const weak of WEAK_OLD_PATTERNS) {
      if (JSON.stringify(q).includes(weak)) fail(`${prefix}: contains weak/old pattern "${weak}"`);
    }
    if (/copied from an official|official examination question paper/i.test(q.question)) {
      fail(`${prefix}: question implies copied official examination content`);
    }
  }

  if (!errors.some((e) => e.startsWith(`${label} PYQ-VERIFY`))) {
    pass(`${label}: answer indexes 2,1,1,0,0,2,1,2,1,2`);
    pass(`${label}: four non-empty options each`);
    pass(`${label}: non-empty explanation and sourceCheck each`);
  }
}

function papersEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

console.log("TAIPOQ — PYQ Guide Content & Naming Integrity Smoke Test");
console.log("=".repeat(56));

mustInclude("src/content/tests/subjects.ts", '"PYQ Guide": "pyq-practice"', "PYQ Guide subject slug");
mustNotInclude("src/content/tests/subjects.ts", '"PYQ Practice": "pyq-practice"', "old PYQ Practice subject key");
mustInclude("src/routes/tests.index.tsx", "original practice guides", "updated tests SEO");
mustNotInclude("src/routes/tests.index.tsx", "PYQ and Model Papers", "old tests SEO");
mustInclude("src/lib/tests/pyqGuide.ts", "TAIPOQ Original Guide", "content label constant");
mustInclude("src/components/tests/TestCard.tsx", "PYQ_GUIDE_CONTENT_LABEL", "guide badge on card");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "isPyqGuidePaper", "guide framing on paper page");
mustInclude("src/content/sscCglPatternPracticeContent.ts", "not an official SSC previous-year", "SSC disclaimer preserved");

const tsSrc = readFileSync(path.join(ROOT, "src/content/tests/checkedTestPaperPack01.ts"), "utf8");
const jsonPack = JSON.parse(readFileSync(path.join(ROOT, "public/data/test-paper-pack-01.json"), "utf8"));

let tsPaper;
try {
  tsPaper = extractTsPyqPaperBlock(tsSrc);
} catch (err) {
  fail(`TS PYQ paper parse: ${err.message}`);
}

const jsonPaper = jsonPack.papers.find((p) => p.paperId === PYQ_PAPER_ID);
if (!jsonPaper) fail("pyq paper missing from json pack");

if (tsPaper) {
  assertPaper(tsPaper, "TS");
  assertQuestions(tsPaper.questions, "TS");
  mustNotInclude("src/content/tests/checkedTestPaperPack01.ts", "PYQ Source and Practice Guide", "old title in TS");
  const pyqBlockStart = tsSrc.indexOf('"file": "13_PYQ_PRACTICE_TEST_PAPER.md"');
  const pyqBlockEnd = tsSrc.indexOf('"paperId": "pyq-practice-test-paper"', pyqBlockStart);
  const pyqBlock = tsSrc.slice(pyqBlockStart, pyqBlockEnd);
  if (pyqBlock.includes('"durationMinutes": 15')) fail("TS PYQ block still contains durationMinutes 15");
  else pass("TS PYQ block: no duration 15");
  if (pyqBlock.includes('"level": "moderate"')) fail("TS PYQ block still contains level moderate");
  else pass("TS PYQ block: no moderate level");
}

if (jsonPaper) {
  assertPaper(jsonPaper, "JSON");
  assertQuestions(jsonPaper.questions, "JSON");
  mustNotInclude("public/data/test-paper-pack-01.json", "PYQ Source and Practice Guide", "old title in JSON");
  if (JSON.stringify(jsonPaper).includes('"durationMinutes": 15')) {
    // only fail if PYQ paper has 15 — grep within paper object
    if (jsonPaper.durationMinutes === 15) fail("JSON PYQ paper duration still 15");
  }
  if (jsonPaper.durationMinutes === 10) pass("JSON PYQ paper: duration 10");
}

if (tsPaper && jsonPaper) {
  if (!papersEqual(tsPaper, jsonPaper)) fail("TS and JSON PYQ paper blocks differ");
  else pass("TS/JSON canonical mirror match");
}

if (PYQ_SLUG !== "pyq-practice") fail("slug changed unexpectedly");
else pass("slug pyq-practice unchanged");

mustInclude("src/content/tests/subjects.ts", `"PYQ Guide": "${PYQ_SLUG}"`, "slug mapping");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}
console.log("\nPASS");
process.exit(0);
