#!/usr/bin/env node
/**
 * Validate checked test paper pack.
 * Run: npm run validate:tests
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "public", "data", "test-paper-pack-01.json");
const FALLBACK = path.join(
  process.env.USERPROFILE ?? "",
  "Downloads",
  "TAIPOQ_CHECKED_TEST_PAPER_PACK_01.json",
);

const errors = [];

function fail(msg) {
  errors.push(msg);
}

console.log("TAIPOQ — Test Paper Pack Validator");
console.log("=".repeat(48));

const file = existsSync(DATA_PATH) ? DATA_PATH : FALLBACK;
console.log(`File: ${file}`);

let pack;
try {
  pack = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error("Failed to read pack:", e.message);
  process.exit(1);
}

const ids = new Set();

for (const paper of pack.papers) {
  if (paper.questionCount !== paper.questions.length) {
    fail(`${paper.title}: questionCount ${paper.questionCount} != ${paper.questions.length}`);
  }

  for (const q of paper.questions) {
    if (ids.has(q.id)) fail(`Duplicate ID: ${q.id}`);
    ids.add(q.id);

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

    if (q.reviewed !== true) {
      fail(`${q.id}: reviewed must be true`);
    }
  }
}

console.log(`Papers: ${pack.papers.length}`);
console.log(`Questions: ${ids.size}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
