#!/usr/bin/env node
/**
 * Sync the Verified PYQ paper block from checkedTestPaperPack01.ts into
 * public/data/test-paper-pack-01.json (single-paper mirror update only).
 *
 * Usage:
 *   node tools/sync-pyq-paper-json.mjs           # write JSON mirror
 *   node tools/sync-pyq-paper-json.mjs --dry-run # validate only, no write
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const TS_MARKER = '"file": "13_PYQ_PRACTICE_TEST_PAPER.md"';
const PAPER_ID = "pyq-practice-test-paper";
const EXPECTED_TITLE = "CTET January 2021 Paper I — Child Development and Pedagogy PYQs";
const EXPECTED_SUBJECT = "Verified PYQ";
const EXPECTED_FIRST_ID = "CTET-JAN2021-P1-I-Q001";
const EXPECTED_LAST_ID = "CTET-JAN2021-P1-I-Q010";

const tsPath = path.join(root, "src/content/tests/checkedTestPaperPack01.ts");
const jsonPath = path.join(root, "public/data/test-paper-pack-01.json");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

const ts = fs.readFileSync(tsPath, "utf8");
const start = ts.indexOf(TS_MARKER);
if (start < 0) fail(`TS marker not found: ${TS_MARKER}`);

const end =
  ts.indexOf(`"paperId": "${PAPER_ID}"`, start) + `"paperId": "${PAPER_ID}"`.length;
if (end <= start) fail(`paperId ${PAPER_ID} not found after TS marker`);

let paper;
try {
  paper = JSON.parse(`{${ts.slice(start, end)}}`);
} catch (err) {
  fail(`Failed to parse TS paper block: ${err.message}`);
}

if (paper.paperId !== PAPER_ID) fail(`Unexpected paperId: ${paper.paperId}`);
if (paper.title !== EXPECTED_TITLE) fail(`Unexpected title: ${paper.title}`);
if (paper.subject !== EXPECTED_SUBJECT) fail(`Unexpected subject: ${paper.subject}`);
if (paper.questions.length !== 10) fail(`Expected 10 questions, got ${paper.questions.length}`);

const ids = paper.questions.map((q) => q.id);
if (ids[0] !== EXPECTED_FIRST_ID || ids[9] !== EXPECTED_LAST_ID) {
  fail(`Unexpected question IDs: ${ids[0]} .. ${ids[9]}`);
}

for (let i = 0; i < 10; i++) {
  const expected = `CTET-JAN2021-P1-I-Q${String(i + 1).padStart(3, "0")}`;
  if (ids[i] !== expected) fail(`Question ${i + 1} id ${ids[i]} !== ${expected}`);
}

const pack = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (!Array.isArray(pack.papers)) fail("JSON pack missing papers array");

const idx = pack.papers.findIndex((p) => p.paperId === PAPER_ID);
if (idx < 0) fail(`${PAPER_ID} not found in JSON pack`);

const otherCount = pack.papers.filter((p) => p.paperId === PAPER_ID).length;
if (otherCount !== 1) fail(`Expected exactly one ${PAPER_ID} entry, found ${otherCount}`);

console.log("Validated TS block:", paper.title, `(${paper.questions.length} questions)`);
console.log("Target JSON index:", idx, "of", pack.papers.length, "papers");

if (dryRun) {
  console.log("DRY RUN: no files written.");
  process.exit(0);
}

pack.papers[idx] = paper;
fs.writeFileSync(jsonPath, `${JSON.stringify(pack, null, 2)}\n`);
console.log("Synced JSON mirror for", PAPER_ID);
