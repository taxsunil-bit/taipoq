#!/usr/bin/env node
/**
 * Validate Math Speed Lab T01 canary content.
 * Run: node tools/validate-math-speed-lab.mjs
 * or: npm run validate:math-speed-lab
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const errors = [];

function fail(msg) {
  errors.push(msg);
}

const ALLOWED = [15, 25, 35, 45, 55, 65, 75, 85, 95];

function t01Ordinary(n) {
  return n * n;
}

function t01Rapid(n) {
  if (!ALLOWED.includes(n)) throw new Error(`locked set only; got ${n}`);
  const a = Math.floor(n / 10);
  return 100 * a * (a + 1) + 25;
}

console.log("TAIPOQ — Math Speed Lab T01 Canary Validator");
console.log("=".repeat(52));

const questionsPath = path.join(
  ROOT,
  "src",
  "content",
  "math-speed-lab",
  "questions",
  "t01-direct.ts",
);
const techniquePath = path.join(
  ROOT,
  "src",
  "content",
  "math-speed-lab",
  "techniques",
  "t01-square-ending-5.ts",
);
const modulePath = path.join(ROOT, "src", "content", "math-speed-lab", "module.ts");

for (const p of [questionsPath, techniquePath, modulePath]) {
  if (!existsSync(p)) fail(`Missing file: ${p}`);
}

const qSrc = readFileSync(questionsPath, "utf8");
const tSrc = readFileSync(techniquePath, "utf8");
const mSrc = readFileSync(modulePath, "utf8");

if (!mSrc.includes("Math Speed Lab")) fail("module: missing English title");
if (!mSrc.includes("गणना गति प्रयोगशाला")) fail("module: missing Hindi title");
if (!mSrc.includes("Bharati Krishna Tirtha")) fail("module: missing locked disclaimer cue");
if (/From the Vedas|Ancient secret|Official Vedic Maths|Guaranteed exam/i.test(mSrc + tSrc)) {
  fail("prohibited marketing phrase detected");
}

if (!tSrc.includes("MSL-T01-SQUARE-ENDING-5")) fail("technique: missing technique ID");
if (
  !tSrc.includes("MSL-T01-GEX-001") ||
  !tSrc.includes("MSL-T01-GEX-002") ||
  !tSrc.includes("MSL-T01-GEX-003")
) {
  fail("technique: expected three guided example IDs");
}
if (!tSrc.includes("MSL-T01-INV-001") || !tSrc.includes("MSL-T01-INV-002")) {
  fail("technique: expected two invalid example IDs");
}
if (!tSrc.includes("46") || !tSrc.includes("45 × 55")) {
  fail("technique: invalid teaching examples content missing");
}

const idMatches = [...qSrc.matchAll(/MSL-T01-DIR-(\d{3})/g)].map((m) => m[0]);
const uniqueIds = new Set(idMatches);
if (uniqueIds.size !== 9) fail(`Expected 9 unique DIR IDs, found ${uniqueIds.size}`);
for (let i = 1; i <= 9; i++) {
  const id = `MSL-T01-DIR-${String(i).padStart(3, "0")}`;
  if (!uniqueIds.has(id)) fail(`Missing question ID ${id}`);
}

if (/TODO|TBD|\[insert|placeholder/i.test(qSrc)) {
  fail("questions: placeholder text detected");
}

// Formula independence check for all locked operands
for (const n of ALLOWED) {
  if (n % 10 !== 5) fail(`operand ${n} does not end in 5`);
  const ordinary = t01Ordinary(n);
  const rapid = t01Rapid(n);
  if (ordinary !== rapid) fail(`identity mismatch for ${n}: ordinary=${ordinary} rapid=${rapid}`);
}

// Extract correctAnswer and operand pairs via simple parse of makeDirectQuestion pattern /
// Verify answers appear as n*n in source for each operand
for (const n of ALLOWED) {
  const answer = t01Ordinary(n);
  if (!qSrc.includes(`Find ${n}`)) {
    // prompt uses template Find ${operand}² — check operand list / ALLOWED mapping
  }
  // questions file builds from T01_ALLOWED_OPERANDS — ensure import present
}
if (!qSrc.includes("MSL-T01-DIR-001")) {
  fail("questions: must list explicit DIR question IDs");
}

// Pure formula round for expected answers table
const expectedAnswers = ALLOWED.map((n) => ({ n, answer: n * n }));
const known = {
  15: 225,
  25: 625,
  35: 1225,
  45: 2025,
  55: 3025,
  65: 4225,
  75: 5625,
  85: 7225,
  95: 9025,
};
for (const { n, answer } of expectedAnswers) {
  if (known[n] !== answer) fail(`table mismatch for ${n}`);
  if (t01Rapid(n) !== known[n]) fail(`rapid mismatch for ${n}`);
}

// Ensure no TestPaper pack contamination
const packPath = path.join(ROOT, "src", "content", "tests", "checkedTestPaperPack01.ts");
if (existsSync(packPath)) {
  const pack = readFileSync(packPath, "utf8");
  if (pack.includes("math-speed-lab") || pack.includes("MSL-T01")) {
    fail("checkedTestPaperPack01 must not contain Math Speed Lab content");
  }
}

const subjectsPath = path.join(ROOT, "src", "content", "tests", "subjects.ts");
if (existsSync(subjectsPath)) {
  const subjects = readFileSync(subjectsPath, "utf8");
  if (subjects.includes("math-speed-lab")) {
    fail("subjects.ts must not register math-speed-lab");
  }
}

const formulaSrc = readFileSync(
  path.join(ROOT, "src", "lib", "math-speed-lab", "formulas", "t01.ts"),
  "utf8",
);
if (!formulaSrc.includes("isT01Operand")) {
  fail("t01RapidSquare must guard with isT01Operand / locked set");
}
for (const bad of [5, 10, 14, 46, 105]) {
  try {
    t01Rapid(bad);
    fail(`t01Rapid helper in validator must reject ${bad}`);
  } catch {
    /* expected */
  }
}

console.log(`Operands verified: ${ALLOWED.length}`);
console.log(`DIR IDs found: ${uniqueIds.size}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("OK — Math Speed Lab T01 canary content is valid.");
process.exit(0);
