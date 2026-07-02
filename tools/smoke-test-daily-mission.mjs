#!/usr/bin/env node
/**
 * Smoke test for TAIPOQ Daily Mission integration.
 * Run: npm run smoke:daily-mission
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
  const full = path.join(ROOT, file);
  if (!existsSync(full)) fail(`Missing file: ${file}`);
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

console.log("TAIPOQ — Daily Mission Smoke Test");
console.log("=".repeat(48));

mustExist("src/lib/dailyMission.ts");
mustExist("src/hooks/useDailyMission.ts");
mustExist("src/components/DailyMissionSection.tsx");
mustExist("src/routes/daily-mission.tsx");
mustExist("tools/validate-daily-mission-logic.ts");

mustInclude("src/lib/dailyMission.ts", "taipoq.dailyMission.v1", "storage key");
mustInclude("src/lib/dailyMission.ts", "markDailyMissionTaskComplete", "mark helper");
mustInclude("src/lib/dailyMission.ts", "taipoq:daily-mission-updated", "update event");
mustInclude("src/routes/index.tsx", "DailyMissionSection", "homepage section");
mustInclude("src/components/DailyMissionSection.tsx", "TAIPOQ Mission", "homepage heading");
mustInclude("src/routes/test.tsx", 'markDailyMissionTaskComplete("typing"', "typing hook");
mustInclude(
  "src/routes/tests.$subject.$paperId.tsx",
  "isDailyMissionCurrentAffairsPaper",
  "CA hook guard",
);
mustInclude(
  "src/routes/tests.$subject.$paperId.tsx",
  "isDailyMissionMiniMockPaper",
  "mini mock hook guard",
);
mustInclude(
  "src/components/VerifiedVacancyCard.tsx",
  'markDailyMissionTaskComplete("jobUpdate"',
  "vacancy hook",
);
mustInclude("src/routes/daily-mission.tsx", 'createFileRoute("/daily-mission")', "daily route");

mustInclude("src/routes/test.tsx", 'createFileRoute("/test")', "typing route reachable");
mustInclude(
  "src/lib/dailyMission.ts",
  "current-affairs-test-paper",
  "CA paper id",
);
mustInclude("src/lib/dailyMission.ts", "model-paper-01", "mini mock paper id");
mustInclude("src/routes/upcoming-exams.tsx", "VerifiedVacancyCard", "upcoming exams vacancies");
mustInclude("src/components/VerifiedVacancyCard.tsx", "Verified Open Job", "vacancy card render");

const logic = spawnSync("npx", ["tsx", "tools/validate-daily-mission-logic.ts"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (logic.status !== 0) {
  fail("validate-daily-mission-logic.ts failed");
  if (logic.stdout) console.log(logic.stdout);
  if (logic.stderr) console.log(logic.stderr);
} else {
  pass("validate-daily-mission-logic.ts PASS");
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
