#!/usr/bin/env node
/**
 * Baseline-aware TypeScript regression gate (Update Safety System — Part C).
 *
 *   node tools/typecheck-baseline.mjs            compare against the baseline
 *   node tools/typecheck-baseline.mjs --update   regenerate the baseline
 *
 * Runs `tsc --noEmit`, parses diagnostics into normalized signatures (relative
 * path + TS code + normalized message; line/column excluded so signatures are
 * stable across edits), and compares them to the approved baseline in
 * tools/baselines/typescript-errors-baseline.json.
 *
 * PASS : no NEW error signature appeared (unchanged baseline errors are OK).
 * FAIL : the error set grew, OR any NEW error appears in a vacancy-system file.
 * Resolved baseline errors are reported separately and never cause failure.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseErrors, signature, compare, isVacancySystemFile } from "./typecheck-baseline-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASELINE_DIR = path.join(ROOT, "tools", "baselines");
const BASELINE_PATH = path.join(BASELINE_DIR, "typescript-errors-baseline.json");
const UPDATE = process.argv.includes("--update");

function runTsc() {
  const res = spawnSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, encoding: "utf8", shell: true });
  return `${res.stdout ?? ""}${res.stderr ?? ""}`;
}

console.log("TAIPOQ TypeScript Baseline Gate");
console.log("=".repeat(48));

const current = parseErrors(runTsc(), ROOT);

if (UPDATE) {
  mkdirSync(BASELINE_DIR, { recursive: true });
  const payload = {
    description:
      "Approved pre-existing tsc --noEmit errors. Regenerate with `npm run typecheck:baseline -- --update`. New signatures fail the gate.",
    generatedAt: new Date().toISOString(),
    totalErrors: current.length,
    errors: current.sort((a, b) => signature(a).localeCompare(signature(b))),
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Baseline updated: ${path.relative(ROOT, BASELINE_PATH)}`);
  console.log(`Recorded ${current.length} baseline error signature(s).`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  console.log("No baseline file found. Create one with: npm run typecheck:baseline -- --update");
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
const { newErrors, resolved, vacancyNewErrors, pass } = compare(baseline.errors ?? [], current);

console.log(`Baseline errors: ${baseline.errors?.length ?? 0}`);
console.log(`Current errors:  ${current.length}`);
console.log(`New errors:      ${newErrors.length}`);
console.log(`Resolved errors: ${resolved.length}`);
console.log(`New errors in vacancy-system files: ${vacancyNewErrors.length}`);
console.log("");

if (resolved.length) {
  console.log(`Resolved baseline errors (${resolved.length}) — consider updating the baseline:`);
  resolved.forEach((e, i) => console.log(`  ${i + 1}. ${e.file} ${e.code}`));
  console.log("");
}

if (newErrors.length) {
  console.log(`NEW errors (${newErrors.length}) — these fail the gate:`);
  newErrors.forEach((e, i) => {
    const flag = isVacancySystemFile(e.file) ? " [VACANCY-SYSTEM]" : "";
    console.log(`  ${i + 1}. ${e.file} ${e.code}: ${e.message}${flag}`);
  });
  console.log("");
}

if (!pass) {
  console.log("RESULT: FAIL");
  process.exit(1);
}
console.log("RESULT: PASS (no new TypeScript errors; baseline unchanged)");
process.exit(0);
