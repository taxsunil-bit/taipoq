#!/usr/bin/env node
/**
 * Validate Current Affairs Tough Practice Pack 02.
 * Run: npm run validate:pack-02
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PACK02_PATH = path.join(ROOT, "public", "data", "test-paper-pack-02.json");
const PACK01_PATH = path.join(ROOT, "public", "data", "test-paper-pack-01.json");

const errors = [];

function fail(msg) {
  errors.push(msg);
}

console.log("TAIPOQ — Pack 02 Validator");
console.log("=".repeat(48));

if (!existsSync(PACK02_PATH)) {
  console.error("Missing:", PACK02_PATH);
  process.exit(1);
}

let pack;
try {
  pack = JSON.parse(readFileSync(PACK02_PATH, "utf8"));
} catch (e) {
  console.error("Failed to read pack:", e.message);
  process.exit(1);
}

const pack01Ids = new Set();
if (existsSync(PACK01_PATH)) {
  try {
    const pack01 = JSON.parse(readFileSync(PACK01_PATH, "utf8"));
    for (const paper of pack01.papers ?? []) {
      for (const q of paper.questions ?? []) {
        pack01Ids.add(q.id);
      }
    }
  } catch {
    fail("Could not read Pack 01 for ID collision check");
  }
}

const ids = new Set();
const questions = pack.questions ?? [];

if (pack.totalQuestions !== 30) {
  fail(`totalQuestions must be 30, got ${pack.totalQuestions}`);
}

if (questions.length !== 30) {
  fail(`Expected 30 questions, got ${questions.length}`);
}

for (const q of questions) {
  if (ids.has(q.id)) fail(`Duplicate ID: ${q.id}`);
  ids.add(q.id);

  if (!/^ca-tough-2026-p02-q\d{3}$/.test(q.id)) {
    fail(`${q.id}: invalid ID pattern`);
  }

  if (pack01Ids.has(q.id)) {
    fail(`${q.id}: reuses Pack 01 question ID`);
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    fail(`${q.id}: must have 4 options`);
  }

  if (q.answerIndex < 0 || q.answerIndex > 3) {
    fail(`${q.id}: answerIndex out of range`);
  }

  if (q.options[q.answerIndex] !== q.answer) {
    fail(`${q.id}: options[answerIndex] !== answer`);
  }

  if (new Set(q.options).size !== q.options.length) {
    fail(`${q.id}: duplicate options`);
  }

  if (!String(q.explanation ?? "").trim()) {
    fail(`${q.id}: missing explanation`);
  }

  if (q.difficulty !== "tough") {
    fail(`${q.id}: difficulty must be tough`);
  }
}

if (pack.paperId !== "current-affairs-tough-pack-02") {
  fail(`paperId mismatch: ${pack.paperId}`);
}

console.log(`Questions: ${ids.size}`);
console.log(`Pack 01 ID collisions: ${[...ids].filter((id) => pack01Ids.has(id)).length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
