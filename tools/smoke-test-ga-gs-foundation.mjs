#!/usr/bin/env node
/**
 * Smoke test for GA/GS shared-foundation pilot (Phase 6).
 * Run: npm run smoke:ga-gs-foundation
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
  else pass(`${file}: excludes ${label ?? needle}`);
}

console.log("TAIPOQ — GA/GS Foundation Smoke Test");
console.log("=".repeat(48));

mustExist("src/lib/gaGsMockTestAdapter.ts");
mustExist("src/lib/gaGsMockTestScoring.ts");
mustExist("src/lib/gaGsMockTestRegistry.ts");
mustExist("tools/validate-ga-gs-foundation.ts");
mustExist("public/data/general-awareness/model-test-01.json");
mustExist("public/data/general-science/model-test-01.json");

mustInclude("src/lib/gaGsMockTestAdapter.ts", "adaptGaGsJsonPaper", "adapter");
mustInclude("src/lib/gaGsMockTestScoring.ts", "scoreGaGsMockTest", "shared scoring");
mustInclude("src/lib/gaGsMockTestRegistry.ts", "isGaGsSharedFoundationPaper", "registry helper");
mustInclude("src/components/GeneralAwarenessTest.tsx", "isGaGsSharedFoundationPaper", "pilot branch");
mustInclude("src/components/GeneralAwarenessTest.tsx", "scoreGaGsMockTest", "shared scorer in component");
mustInclude("src/components/GeneralAwarenessTest.tsx", "createGaGsSubmissionGuard", "submission guard");
mustInclude("src/components/GeneralAwarenessTest.tsx", "calculateGAScore", "legacy fallback scorer");
mustInclude(
  "src/routes/study-corner.general-awareness.model-test-01.tsx",
  'subjectSlug="general-awareness"',
  "pilot route props",
);
mustInclude(
  "src/routes/study-corner.general-science.model-test-01.tsx",
  "GeneralAwarenessTest",
  "GS legacy route",
);
mustNotInclude(
  "src/routes/study-corner.general-science.model-test-01.tsx",
  "subjectSlug",
  "GS route not pilot",
);
mustInclude(
  "src/types/generalAwarenessTest.ts",
  "getTestProgressStorageKey",
  "progress key helper",
);
mustInclude(
  "src/types/generalAwarenessTest.ts",
  "GA_MODEL_TEST_STORAGE_KEY",
  "GA storage key constant",
);
mustInclude(
  "src/types/generalAwarenessTest.ts",
  "GS_MODEL_TEST_STORAGE_KEY",
  "GS storage key constant",
);

mustNotInclude("src/components/GeneralAwarenessTest.tsx", "dailyMission", "no Daily Mission hook");
mustNotInclude("src/lib/mockTestFoundationRegistry.ts", "ga-model-test-01", "GA not in hub registry");
mustNotInclude("src/lib/gaGsMockTestRegistry.ts", "current-affairs-tough-pack-02", "Pack 02 not in GA/GS registry");
mustNotInclude("src/lib/currentAffairsPack02Adapter.ts", "gaGsMockTest", "Pack 02 adapter untouched");

const logic = spawnSync("npx", ["tsx", "tools/validate-ga-gs-foundation.ts"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (logic.status !== 0) {
  fail("validate-ga-gs-foundation.ts failed");
  if (logic.stdout) console.log(logic.stdout);
  if (logic.stderr) console.log(logic.stderr);
} else {
  pass("validate-ga-gs-foundation.ts passed");
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
