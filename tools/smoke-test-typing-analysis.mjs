#!/usr/bin/env node
/**
 * Smoke test for typing result intelligence integration.
 * Run: npm run smoke:typing-analysis
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

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

function mustExist(file) {
  if (!existsSync(path.join(ROOT, file))) fail(`Missing file: ${file}`);
  else pass(`File exists: ${file}`);
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

console.log("TAIPOQ — Typing Analysis Smoke Test");
console.log("=".repeat(48));

mustExist("src/lib/typingAnalysis.ts");
mustExist("src/components/TypingImprovementAnalysis.tsx");
mustExist("tools/validate-typing-analysis.ts");

mustInclude("src/lib/typingAnalysis.ts", "analyzeTypingText", "analysis entry");
mustInclude("src/lib/storage.ts", "targetText?:", "optional targetText");
mustInclude("src/lib/storage.ts", "typedText?:", "optional typedText");
mustInclude("src/routes/test.tsx", "targetText: r.target", "test saves target text");
mustInclude("src/routes/test.tsx", 'markDailyMissionTaskComplete("typing"', "daily mission hook preserved");
mustInclude("src/routes/result.tsx", "TypingImprovementAnalysis", "result page section");
mustInclude("src/routes/result.tsx", 'createFileRoute("/result")', "result route");
mustInclude("src/components/TypingImprovementAnalysis.tsx", "Typing Improvement Analysis", "section title");
mustInclude("src/routes/test.tsx", 'createFileRoute("/test")', "typing test route");

const logic = spawnSync("npx", ["tsx", "tools/validate-typing-analysis.ts"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (logic.status !== 0) {
  fail("validate-typing-analysis.ts failed");
  if (logic.stdout) console.log(logic.stdout);
  if (logic.stderr) console.log(logic.stderr);
} else {
  pass("validate-typing-analysis.ts PASS");
}

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
