#!/usr/bin/env node
/**
 * Release-readiness smoke checks for CTET Verified PYQ paper content.
 * Run: node tools/smoke-test-pyq-naming-integrity.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PYQ_PAPER_ID = "pyq-practice-test-paper";
const PYQ_SLUG = "pyq-practice";
const EXPECTED_TITLE = "CTET January 2021 Paper I — Child Development and Pedagogy PYQs";
const EXPECTED_SUBJECT = "Verified PYQ";
const EXPECTED_BADGE = "Official-Source Verified PYQ";
const EXPECTED_IDS = Array.from(
  { length: 10 },
  (_, i) => `CTET-JAN2021-P1-I-Q${String(i + 1).padStart(3, "0")}`,
);
const EXPECTED_ANSWER_INDEXES = [0, 2, 1, 0, 2, 1, 0, 3, 1, 3];
const EXPECTED_ANSWER_LETTERS = ["A", "C", "B", "A", "C", "B", "A", "D", "B", "D"];
const OFFICIAL_LINK_HOSTS = ["ctet.nic.in"];

const WEAK_OLD_PATTERNS = [
  "PYQ-PATTERN-",
  "PYQ-VERIFY-",
  "PYQ Verification and Official Sources Guide",
  "PYQ Source and Practice Guide",
  "PYQ Guide",
  "TAIPOQ Original Guide",
  "Which tag should be used for a question copied from an official",
  "official_pyq",
  "provisional answer key and a final answer key",
  "recorded response",
  "memory-based material",
  "CBSE-approved",
  "official CTET partner",
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
  if (paper.title !== EXPECTED_TITLE) fail(`${label}: title mismatch`);
  else pass(`${label}: CTET title`);
  if (paper.subject !== EXPECTED_SUBJECT) fail(`${label}: subject not ${EXPECTED_SUBJECT}`);
  else pass(`${label}: subject ${EXPECTED_SUBJECT}`);
  if (paper.level !== "basic") fail(`${label}: level not basic`);
  else pass(`${label}: level basic`);
  if (paper.access !== "practice_pass") fail(`${label}: access not practice_pass`);
  else pass(`${label}: access practice_pass`);
  if (paper.durationMinutes !== 10) fail(`${label}: duration not 10`);
  else pass(`${label}: duration 10`);
  if (paper.questionCount !== 10) fail(`${label}: questionCount not 10`);
  else pass(`${label}: questionCount 10`);
  if (paper.paperId !== PYQ_PAPER_ID) fail(`${label}: paperId mismatch`);
  else pass(`${label}: paperId ${PYQ_PAPER_ID}`);
  if (!paper.intro.includes("not an official CBSE or CTET publication")) {
    fail(`${label}: disclaimer missing`);
  } else pass(`${label}: disclaimer present`);
}

function assertQuestions(questions, label) {
  if (questions.length !== 10) {
    fail(`${label}: ${questions.length} questions !== 10`);
    return;
  }
  pass(`${label}: 10 questions`);

  const ids = questions.map((q) => q.id);
  if (new Set(ids).size !== 10) fail(`${label}: duplicate ids`);
  else pass(`${label}: unique ids`);

  for (let i = 0; i < EXPECTED_IDS.length; i++) {
    if (ids[i] !== EXPECTED_IDS[i]) fail(`${label}: id[${i}] ${ids[i]} !== ${EXPECTED_IDS[i]}`);
  }
  if (!errors.some((e) => e.includes(`${label}: id[`))) {
    pass(`${label}: ids CTET-JAN2021-P1-I-Q001..010`);
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const prefix = `${label} ${q.id}`;

    if (q.answerIndex !== EXPECTED_ANSWER_INDEXES[i]) {
      fail(`${prefix}: answerIndex ${q.answerIndex} !== ${EXPECTED_ANSWER_INDEXES[i]}`);
    }
    const letter = String.fromCharCode(65 + q.answerIndex);
    if (letter !== EXPECTED_ANSWER_LETTERS[i]) {
      fail(`${prefix}: letter ${letter} !== ${EXPECTED_ANSWER_LETTERS[i]}`);
    }
    if (q.options[q.answerIndex] !== q.answer) {
      fail(`${prefix}: answer text mismatch`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => !String(o).trim())) {
      fail(`${prefix}: invalid options`);
    }
    if (!String(q.explanation || "").trim()) fail(`${prefix}: empty explanation`);
    if (!String(q.sourceCheck || "").includes("Official-source verified adapted PYQ")) {
      fail(`${prefix}: sourceCheck missing adapted PYQ marker`);
    }
    if (!String(q.sourceCheck || "").includes("CTET January 2021")) {
      fail(`${prefix}: sourceCheck missing CTET January 2021`);
    }
    if (!String(q.sourceCheck || "").includes("Main Set I")) {
      fail(`${prefix}: sourceCheck missing Main Set I`);
    }
    if (!String(q.sourceCheck || "").includes(`original Question ${i + 1}`)) {
      fail(`${prefix}: sourceCheck missing original question number`);
    }

    for (const weak of WEAK_OLD_PATTERNS) {
      if (q.question.includes(weak) || q.explanation.includes(weak)) {
        fail(`${prefix}: weak/old pattern in question/explanation: ${weak}`);
      }
    }
  }

  if (!errors.some((e) => e.startsWith(`${label} CTET-JAN2021`))) {
    pass(`${label}: answer indexes 0,2,1,0,2,1,0,3,1,3`);
    pass(`${label}: answer letters A,C,B,A,C,B,A,D,B,D`);
  }
}

console.log("TAIPOQ — CTET Verified PYQ Content Smoke Test");
console.log("=".repeat(52));

mustInclude("src/content/tests/subjects.ts", '"Verified PYQ": "pyq-practice"', "Verified PYQ subject slug");
mustNotInclude("src/content/tests/subjects.ts", '"PYQ Guide": "pyq-practice"', "old PYQ Guide subject key");
mustInclude("src/lib/tests/pyqGuide.ts", EXPECTED_BADGE, "content badge constant");
mustInclude("src/lib/tests/pyqGuide.ts", "ctet.nic.in/question-paper-january-2021", "official question archive link");
mustInclude("src/lib/tests/pyqGuide.ts", "ctet.nic.in/previous-year-final-answer-key", "official answer-key archive link");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "Official sources", "official sources section");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "noopener noreferrer", "safe external links");
mustInclude("src/components/tests/TestCard.tsx", "PYQ_GUIDE_CONTENT_LABEL", "badge on card");
mustInclude("src/content/sscCglPatternPracticeContent.ts", "not an official SSC previous-year", "SSC disclaimer preserved");

mustNotInclude("src/content/tests/checkedTestPaperPack01.ts", "PYQ-VERIFY-", "old guide ids in TS");
mustNotInclude("public/data/test-paper-pack-01.json", "PYQ-VERIFY-", "old guide ids in JSON");
mustNotInclude("src/content/tests/checkedTestPaperPack01.ts", "PYQ Verification and Official Sources Guide", "old guide title");

const routeSrc = readFileSync(path.join(ROOT, "src/routes/tests.$subject.$paperId.tsx"), "utf8");
if (routeSrc.includes("CBSE-approved") || routeSrc.includes("official CTET partner")) {
  fail("paper route: CBSE endorsement claim");
} else pass("paper route: no CBSE endorsement claim");

for (const host of OFFICIAL_LINK_HOSTS) {
  const guideSrc = readFileSync(path.join(ROOT, "src/lib/tests/pyqGuide.ts"), "utf8");
  if (!guideSrc.includes(host)) fail(`pyqGuide missing official host ${host}`);
  else pass(`pyqGuide: ${host} link present`);
}

const tsSrc = readFileSync(path.join(ROOT, "src/content/tests/checkedTestPaperPack01.ts"), "utf8");
const jsonPack = JSON.parse(readFileSync(path.join(ROOT, "public/data/test-paper-pack-01.json"), "utf8"));

let tsPaper;
try {
  tsPaper = extractTsPyqPaperBlock(tsSrc);
} catch (err) {
  fail(`TS paper parse: ${err.message}`);
}

const jsonPaper = jsonPack.papers.find((p) => p.paperId === PYQ_PAPER_ID);
if (!jsonPaper) fail("pyq paper missing from json pack");

if (tsPaper) {
  assertPaper(tsPaper, "TS");
  assertQuestions(tsPaper.questions, "TS");
}

if (jsonPaper) {
  assertPaper(jsonPaper, "JSON");
  assertQuestions(jsonPaper.questions, "JSON");
}

if (tsPaper && jsonPaper) {
  if (JSON.stringify(tsPaper) !== JSON.stringify(jsonPaper)) fail("TS/JSON mirror mismatch");
  else pass("TS/JSON canonical mirror match");
}

if (PYQ_SLUG !== "pyq-practice") fail("slug changed");
else pass("slug pyq-practice unchanged");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}
console.log("\nPASS");
process.exit(0);
