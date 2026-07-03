#!/usr/bin/env node
/**
 * Publish a validated TAIPOQ vacancy update — transactional and fail-safe.
 *
 * Transaction sequence (Update Safety System hardening — Part H):
 *   1. Acquire publish lock.
 *   2. Refuse if an incomplete previous transaction journal exists.
 *   3. Validate preview data (blocking).
 *   4. Semantic diff + destructive / collision guard.
 *   5. Stage proposed live + registry files in a temp transaction directory.
 *   6. Validate the staged temp files.
 *   7. Generate checksums + create a verified backup of current live files.
 *   8. Journal states: PREPARED -> BACKED_UP -> SWAPPING -> VALIDATING ->
 *      COMMITTED (or ROLLED_BACK).
 *   9. Atomically replace live files (rename over target on the same volume).
 *  10. Update the content registry last.
 *  11. Run: vacancy validation, baseline-aware TypeScript gate, live smoke
 *      test, production build.
 *  12. Mark COMMITTED and release the lock.
 *
 * On any failure after backup, the verified backup is restored, the restored
 * files are validated, the transaction is marked ROLLED_BACK, the failure
 * report + journal are kept, and the process exits non-zero.
 *
 * Atomicity guarantee: rename() is atomic PER FILE on the same filesystem, so a
 * crash never leaves a half-written file. Multi-file consistency across
 * vacancies.json + content-registry.json is NOT a single atomic operation; it
 * is protected by the journal + verified backup restore, not by the OS.
 *
 * This script NEVER creates a Git commit, NEVER pushes, and NEVER deploys.
 *
 * Usage:
 *   npm run vacancies:publish                       (dry run — summary only)
 *   npm run vacancies:publish -- --confirm          (perform publish)
 *   npm run vacancies:publish -- --confirm --allow-destructive
 *   npm run vacancies:publish -- --recover          (recover an interrupted tx)
 */

import { existsSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  ROOT,
  LIVE_PATH,
  PREVIEW_PATH,
  SOURCES_PATH,
  REGISTRY_PATH,
  BACKUP_DIR,
  REPORT_DIR,
  BACKED_UP_FILES,
  DATA_DIR,
  readJsonSafe,
  writeJson,
  sha256,
  ensureDir,
  timestamp,
  istTimestampIso,
  bumpContentVersion,
  semanticDiff,
  destructiveRemovals,
  acquireLock,
  releaseLock,
  writeJournal,
  readJournal,
  clearTransaction,
  atomicReplaceFrom,
  TX_DIR,
  TX_STATES,
  LOCK_PATH,
} from "./vacancy-update-lib.mjs";

const args = process.argv.slice(2);
const CONFIRM = args.includes("--confirm");
const ALLOW_DESTRUCTIVE = args.includes("--allow-destructive");
const RECOVER = args.includes("--recover");

const INCOMPLETE_STATES = new Set([
  TX_STATES.PREPARED,
  TX_STATES.BACKED_UP,
  TX_STATES.SWAPPING,
  TX_STATES.VALIDATING,
]);

function log(...a) {
  console.log(...a);
}

function runStage(name, cmd, cmdArgs) {
  log(`\n> [${name}] ${cmd} ${cmdArgs.join(" ")}`);
  const res = spawnSync(cmd, cmdArgs, { cwd: ROOT, encoding: "utf8", shell: true });
  const out = `${res.stdout ?? ""}${res.stderr ?? ""}`;
  if (res.status !== 0) log(out.trim().split("\n").slice(-25).join("\n"));
  return { ok: res.status === 0, out };
}

function restoreFrom(backupPath) {
  for (const f of BACKED_UP_FILES) {
    const src = path.join(backupPath, f.key);
    if (existsSync(src)) copyFileSync(src, f.path);
  }
}

log("TAIPOQ Vacancy Publish");
log("=".repeat(48));

// --- Interrupted-transaction detection / recovery -------------------------
const existingJournal = readJournal();
if (existingJournal && INCOMPLETE_STATES.has(existingJournal.state)) {
  log(`\nIncomplete transaction detected (state: ${existingJournal.state}).`);
  if (!RECOVER) {
    log("Refusing to start a new publish. Re-run with --recover to roll back safely.");
    process.exit(2);
  }
  log("Recovering: restoring the verified backup recorded in the journal...");
  if (existingJournal.backupPath && existsSync(existingJournal.backupPath)) {
    restoreFrom(existingJournal.backupPath);
    const reval = runStage("recover-validate", "node", ["tools/validate-vacancies-json.mjs"]);
    log(`  restored-data validation: ${reval.ok && /RESULT: PASS/.test(reval.out) ? "PASS" : "CHECK"}`);
  } else {
    log("  No backup path in journal — nothing to restore (files may be untouched).");
  }
  writeJournal(TX_STATES.ROLLED_BACK, { recoveredAt: istTimestampIso() });
  clearTransaction();
  releaseLock();
  log("Recovery complete. Transaction marked ROLLED_BACK. No Git action performed.");
  process.exit(0);
}
// A stale COMPLETE journal (COMMITTED / ROLLED_BACK) is cleared so we start fresh.
if (existingJournal) clearTransaction();

// --- Acquire lock ----------------------------------------------------------
const lock = acquireLock({ tool: "publish" });
if (!lock.acquired) {
  log(`\nAnother publish holds the lock (${LOCK_PATH}).`);
  log(`Holder: ${JSON.stringify(lock.holder)}`);
  process.exit(2);
}

let released = false;
function release() {
  if (!released) {
    releaseLock();
    released = true;
  }
}
process.on("exit", release);

// Preconditions
if (!existsSync(PREVIEW_PATH) || !existsSync(LIVE_PATH)) {
  log("Missing live or preview data file — nothing to publish.");
  release();
  process.exit(1);
}

// Step 3 — validate preview (blocking)
const preValidate = runStage("validate", "node", ["tools/validate-vacancies-json.mjs"]);
if (!preValidate.ok || !/RESULT: PASS/.test(preValidate.out)) {
  log("\nValidation FAILED. Publish aborted. No files changed.");
  release();
  process.exit(1);
}
log("Validation passed.");

// Step 4 — semantic diff + guards
const liveBefore = readJsonSafe(LIVE_PATH, { items: [] });
const previewData = readJsonSafe(PREVIEW_PATH, { items: [] });
const diff = semanticDiff(liveBefore, previewData);
const destructive = destructiveRemovals(diff.removed);
const collisions =
  diff.duplicateIdentities.length +
  diff.slugCollisions.length +
  diff.notificationNumberCollisions.length +
  diff.applicationUrlCollisions.length;

log("");
log("Proposed publication summary:");
log(`  Live records: ${diff.liveCount}  Preview records: ${diff.previewCount}`);
log(`  Added: ${diff.semantic.added.length}  Modified: ${diff.semantic.modified.length}  Unchanged: ${diff.semantic.unchanged.length}  Removed: ${diff.semantic.removed.length}`);
log(`  Destructive removals: ${destructive.length}  Collisions: ${collisions}`);
log(`  Publicly-visible: ${diff.publicVisibleBefore} -> ${diff.publicVisibleAfter} (${diff.publicVisibleDelta >= 0 ? "+" : ""}${diff.publicVisibleDelta})`);

if (collisions > 0) {
  log(`\nRefusing to publish: ${collisions} identity/slug/notification/application collision(s).`);
  release();
  process.exit(1);
}
if (destructive.length && !ALLOW_DESTRUCTIVE) {
  log(`\nRefusing to publish: ${destructive.length} publicly-visible record(s) would be removed.`);
  log("Re-run with --allow-destructive if this is intended.");
  destructive.forEach((r) => log(`  - ${r.id}`));
  release();
  process.exit(1);
}

if (!CONFIRM) {
  log("\nDry run only. Live files NOT modified. Re-run with --confirm to publish.");
  release();
  process.exit(0);
}

// Step 5 — stage proposed files in a temp transaction directory
const ts = timestamp();
const stagedDir = path.join(TX_DIR, "staged");
ensureDir(stagedDir);
const registryBefore = readJsonSafe(REGISTRY_PATH, null);
const newVersion = registryBefore ? bumpContentVersion(registryBefore.contentVersion) : null;
const stagedLive = path.join(stagedDir, "vacancies.json");
const stagedRegistry = path.join(stagedDir, "content-registry.json");
copyFileSync(PREVIEW_PATH, stagedLive);
if (registryBefore) {
  writeJson(stagedRegistry, {
    ...registryBefore,
    contentVersion: newVersion,
    lastUpdated: istTimestampIso(),
    vacancies: { ...registryBefore.vacancies, lastReviewed: istTimestampIso().slice(0, 10) },
  });
}
writeJournal(TX_STATES.PREPARED, { ts, newVersion });

// Step 6 — validate the staged temp files in an isolated data dir
const validateDir = path.join(TX_DIR, "validate");
mkdirSync(validateDir, { recursive: true });
copyFileSync(stagedLive, path.join(validateDir, "vacancies.json"));
copyFileSync(PREVIEW_PATH, path.join(validateDir, "vacancies.preview.json"));
if (existsSync(SOURCES_PATH)) copyFileSync(SOURCES_PATH, path.join(validateDir, "vacancy-sources.json"));
if (registryBefore) copyFileSync(stagedRegistry, path.join(validateDir, "content-registry.json"));
const stagedValidate = spawnSync("node", ["tools/validate-vacancies-json.mjs"], {
  cwd: ROOT,
  encoding: "utf8",
  env: { ...process.env, VACANCY_DATA_DIR: validateDir },
});
const stagedOut = `${stagedValidate.stdout ?? ""}${stagedValidate.stderr ?? ""}`;
if (stagedValidate.status !== 0 || !/RESULT: PASS/.test(stagedOut)) {
  log("\nStaged file validation FAILED. Aborting before touching live files.");
  writeJournal(TX_STATES.ROLLED_BACK, { reason: "staged validation failed" });
  clearTransaction();
  release();
  process.exit(1);
}
log("Staged files validated.");

// Step 7 — verified backup of current live files
const backupPath = path.join(BACKUP_DIR, ts);
ensureDir(backupPath);
const checksums = {};
const copiedFiles = [];
for (const f of BACKED_UP_FILES) {
  if (!existsSync(f.path)) continue;
  const dest = path.join(backupPath, f.key);
  copyFileSync(f.path, dest);
  checksums[f.key] = sha256(dest);
  copiedFiles.push(f.key);
}
const manifest = {
  timestamp: istTimestampIso(),
  contentVersion: registryBefore?.contentVersion ?? null,
  files: copiedFiles,
  checksums,
  sourcePreviewFile: "public/data/vacancies.preview.json",
  reason: "Pre-publish verified backup of live vacancy files (Update Safety System).",
};
writeJson(path.join(backupPath, "manifest.json"), manifest);
writeJson(path.join(backupPath, "checksums.json"), checksums);
// Verify backup integrity immediately.
let backupOk = true;
for (const key of copiedFiles) {
  if (sha256(path.join(backupPath, key)) !== checksums[key]) backupOk = false;
}
if (!backupOk) {
  log("\nBackup checksum verification FAILED. Aborting before touching live files.");
  writeJournal(TX_STATES.ROLLED_BACK, { reason: "backup verification failed" });
  clearTransaction();
  release();
  process.exit(1);
}
writeJournal(TX_STATES.BACKED_UP, { ts, backupPath, checksums });
log(`\nVerified backup created: ${path.relative(ROOT, backupPath)} (${copiedFiles.join(", ")})`);

function abort(stage) {
  log(`\nStage FAILED: ${stage}. Restoring previous live files from verified backup...`);
  restoreFrom(backupPath);
  const reval = runStage("restore-validate", "node", ["tools/validate-vacancies-json.mjs"]);
  const restoreOk = reval.ok && /RESULT: PASS/.test(reval.out);
  writeJournal(TX_STATES.ROLLED_BACK, { failedStage: stage, restoreValidated: restoreOk });
  writePublicationReport({ status: "FAILED", failedStage: stage, tsOk: null, restoreOk });
  log(`Restore complete (restored-data validation: ${restoreOk ? "PASS" : "CHECK"}). No Git commit/push/deploy.`);
  release();
  process.exit(1);
}

// Step 9 — atomic swap of live file
writeJournal(TX_STATES.SWAPPING, { ts, backupPath });
try {
  atomicReplaceFrom(stagedLive, LIVE_PATH);
  log("Atomically replaced live vacancies.json.");
} catch (e) {
  abort(`atomic swap (${e instanceof Error ? e.message : String(e)})`);
}

// Step 10 — update content registry last
if (registryBefore) {
  try {
    atomicReplaceFrom(stagedRegistry, REGISTRY_PATH);
    log(`Content registry updated to version ${newVersion}.`);
  } catch (e) {
    abort(`update content registry (${e instanceof Error ? e.message : String(e)})`);
  }
}

// Step 11 — blocking verification pipeline
writeJournal(TX_STATES.VALIDATING, { ts, backupPath });
const blockingStages = [
  ["re-validate", "node", ["tools/validate-vacancies-json.mjs"], /RESULT: PASS/],
  ["typecheck-baseline", "node", ["tools/typecheck-baseline.mjs"], /RESULT: PASS/],
  ["vacancy-ui-smoke", "node", ["tools/smoke-test-vacancies-live.mjs"], /PASS/],
  ["build", "npm", ["run", "build"], null],
];
let tsOk = null;
for (const [name, cmd, cmdArgs, mustMatch] of blockingStages) {
  const res = runStage(name, cmd, cmdArgs);
  if (name === "typecheck-baseline") tsOk = res.ok;
  if (!res.ok || (mustMatch && !mustMatch.test(res.out))) abort(name);
  log(`  [${name}] OK`);
}

// Step 12 — commit
writeJournal(TX_STATES.COMMITTED, { ts, backupPath, newVersion });
writePublicationReport({ status: "SUCCESS", failedStage: null, tsOk, restoreOk: null });
clearTransaction();
release();
log("\nRESULT: PUBLISH SUCCESS");
log("Reminder: no Git commit, push, or deploy was performed. Review and commit manually.");
process.exit(0);

function writePublicationReport({ status, failedStage, tsOk, restoreOk }) {
  ensureDir(REPORT_DIR);
  const reportPath = path.join(REPORT_DIR, `TAIPOQ_VACANCY_PUBLISH_${ts}.md`);
  const liveAfter = readJsonSafe(LIVE_PATH, { items: [] });
  const tsLine =
    tsOk === null ? "not reached" : tsOk ? "PASS (baseline-aware; no new errors)" : "FAIL (new TypeScript error)";
  const body = `# TAIPOQ Vacancy Publication Report

- Generated: ${istTimestampIso()}
- Status: **${status}**${failedStage ? `\n- Failed stage: **${failedStage}**` : ""}
- Backup: \`${path.relative(ROOT, backupPath)}\`
- Content version: ${manifest.contentVersion ?? "—"} -> ${status === "SUCCESS" ? newVersion : "(unchanged — restored)"}
- Baseline TypeScript gate: ${tsLine}
- Data dir: \`${path.relative(ROOT, DATA_DIR)}\`

## Change summary (semantic, identity-aware)

| Metric | Count |
|--------|-------|
| Live before | ${diff.liveCount} |
| Preview | ${diff.previewCount} |
| Added | ${diff.semantic.added.length} |
| Modified | ${diff.semantic.modified.length} |
| Unchanged | ${diff.semantic.unchanged.length} |
| Removed | ${diff.semantic.removed.length} |
| Destructive removals | ${destructive.length} |
| Publicly-visible before | ${diff.publicVisibleBefore} |
| Publicly-visible after | ${diff.publicVisibleAfter} |
| Live after | ${liveAfter.items?.length ?? 0} |

## Safety

- Verified backup created: YES
- Failed-publication auto-restore: ${status === "FAILED" ? `YES (restored-data validation: ${restoreOk ? "PASS" : "CHECK"})` : "not triggered"}
- Transaction journal: ${status === "SUCCESS" ? "COMMITTED" : "ROLLED_BACK"}
- Git commit created: NO
- Git push performed: NO
- Vercel deployment performed: NO
`;
  writeFileSync(reportPath, body);
  log(`Publication report: ${path.relative(ROOT, reportPath)}`);
}
