#!/usr/bin/env node
/**
 * Smoke test for unified mock test foundation (Phase 3).
 * Run: npm run smoke:mock-foundation
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

function mustNotInclude(file, needle, label) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) return;
  const src = readFileSync(full, "utf8");
  if (src.includes(needle)) fail(`${file}: should not include ${label ?? needle}`);
  else pass(`${file}: unchanged ${label ?? needle}`);
}

console.log("TAIPOQ — Mock Test Foundation Smoke Test");
console.log("=".repeat(48));

mustExist("src/types/mockTest.ts");
mustExist("src/lib/mockTestValidation.ts");
mustExist("src/lib/mockTestAdapters.ts");
mustExist("src/lib/mockTestScoring.ts");
mustExist("src/lib/mockTestAnalysis.ts");
mustExist("src/components/mock-test/MockTestResultSummary.tsx");
mustExist("src/lib/mockTestFoundationRegistry.ts");
mustExist("src/lib/mockTestHubIntegration.ts");
mustExist("tools/validate-mock-test-foundation.ts");

mustInclude("src/lib/mockTestFoundationRegistry.ts", "SHARED_MOCK_FOUNDATION_PAPERS", "central registry");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "usesSharedMockFoundation", "shared foundation guard");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "MockTestResultSummary", "shared result UI");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "scoreHubPaperAttempt", "hub integration scorer");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "isDailyMissionMiniMockPaper", "mini mock hook");
mustInclude("src/routes/tests.$subject.$paperId.tsx", "isDailyMissionCurrentAffairsPaper", "CA hook");
mustInclude("src/lib/tests/testScoring.ts", "scoreTestAttempt", "legacy scorer preserved");

mustNotInclude(
  "src/content/tests/currentAffairsToughPack02.ts",
  "mockTestScoring",
  "pack 02 data untouched",
);

const logic = spawnSync("npx", ["tsx", "tools/validate-mock-test-foundation.ts"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (logic.status !== 0) {
  fail("validate-mock-test-foundation.ts failed");
  if (logic.stdout) console.log(logic.stdout);
  if (logic.stderr) console.log(logic.stderr);
} else {
  pass("validate-mock-test-foundation.ts PASS");
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
