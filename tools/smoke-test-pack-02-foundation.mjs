#!/usr/bin/env node
/**
 * Smoke test for Pack 02 shared-foundation integration (Phase 5).
 * Run: npm run smoke:pack-02-foundation
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

console.log("TAIPOQ — Pack 02 Foundation Smoke Test");
console.log("=".repeat(48));

mustExist("src/lib/currentAffairsPack02Adapter.ts");
mustExist("src/lib/currentAffairsPack02Scoring.ts");
mustExist("tools/validate-pack-02-foundation.ts");

mustInclude(
  "src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx",
  "scorePack02MockTest",
  "shared scoring integration",
);
mustInclude(
  "src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx",
  "createPack02SubmissionGuard",
  "submission guard",
);
mustInclude(
  "src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx",
  "scoreResult.incorrect",
  "incorrect count display",
);
mustInclude(
  "src/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView.tsx",
  "scoreResult.unanswered",
  "unanswered count display",
);
mustInclude(
  "src/lib/currentAffairsPack02Adapter.ts",
  "adaptPack02ToMockPaper",
  "Pack 02 adapter",
);
mustInclude(
  "src/lib/currentAffairsPack02Scoring.ts",
  "getPack02ScoringContract",
  "scoring contract",
);

mustNotInclude(
  "src/lib/mockTestFoundationRegistry.ts",
  "current-affairs-tough-pack-02",
  "Pack 02 not in hub registry",
);
mustNotInclude(
  "src/content/tests/currentAffairsToughPack02.ts",
  "mockTestScoring",
  "Pack 02 source data untouched",
);

const logic = spawnSync("npx", ["tsx", "tools/validate-pack-02-foundation.ts"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (logic.status !== 0) {
  fail("validate-pack-02-foundation.ts failed");
  if (logic.stdout) console.log(logic.stdout);
  if (logic.stderr) console.log(logic.stderr);
} else {
  pass("validate-pack-02-foundation.ts passed");
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
