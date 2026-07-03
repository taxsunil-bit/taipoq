#!/usr/bin/env node
/**
 * Roll back TAIPOQ vacancy files to a previous verified backup (Part I).
 *
 *   npm run vacancies:rollback                                  (list backups)
 *   npm run vacancies:rollback -- --backup=YYYYMMDD_HHMMSS      (verify + diff)
 *   npm run vacancies:rollback -- --backup=YYYYMMDD_HHMMSS --confirm
 *
 * Before restoring it displays and verifies: backup ID, timestamp, content
 * version, vacancy count, checksums, backed-up file list, current live version,
 * current-vs-backup semantic difference, and the files that will be
 * overwritten. Checksums are verified BEFORE any restore.
 *
 * After restoring it runs, and reports separately as PASS/FAIL: the vacancy
 * validator, the baseline-aware TypeScript gate, the live smoke test, the
 * production build, and a content/source registry consistency check.
 *
 * The backup is NEVER deleted after a successful rollback. No Git action.
 */

import { existsSync, readdirSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  ROOT,
  BACKUP_DIR,
  REPORT_DIR,
  BACKED_UP_FILES,
  LIVE_PATH,
  REGISTRY_PATH,
  DATA_DIR,
  readJsonSafe,
  sha256,
  ensureDir,
  timestamp,
  istTimestampIso,
  semanticDiff,
} from "./vacancy-update-lib.mjs";

const args = process.argv.slice(2);
const CONFIRM = args.includes("--confirm");
const backupArg = args.find((a) => a.startsWith("--backup="));
const backupId = backupArg ? backupArg.split("=")[1] : null;

function log(...a) {
  console.log(...a);
}

log("TAIPOQ Vacancy Rollback");
log("=".repeat(48));

function listBackups() {
  if (!existsSync(BACKUP_DIR)) return [];
  return readdirSync(BACKUP_DIR)
    .filter((name) => {
      try {
        return statSync(path.join(BACKUP_DIR, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort()
    .reverse();
}

if (!backupId) {
  const backups = listBackups();
  if (!backups.length) {
    log("No backups found under backups/content/.");
    process.exit(1);
  }
  log("Available backups (newest first):");
  for (const id of backups) {
    const manifest = readJsonSafe(path.join(BACKUP_DIR, id, "manifest.json"), null);
    log(`  ${id}${manifest?.contentVersion ? `  (version ${manifest.contentVersion})` : ""}`);
  }
  log("\nRe-run with: npm run vacancies:rollback -- --backup=<ID> --confirm");
  process.exit(0);
}

const backupPath = path.join(BACKUP_DIR, backupId);
if (!existsSync(backupPath)) {
  log(`Backup not found: ${backupId}`);
  process.exit(1);
}

// Verify manifest + checksums BEFORE touching anything.
const manifest = readJsonSafe(path.join(backupPath, "manifest.json"), null);
const checksums = readJsonSafe(path.join(backupPath, "checksums.json"), null);
if (!manifest || !checksums) {
  log("Backup is missing manifest.json or checksums.json — refusing to restore.");
  process.exit(1);
}

let checksumOk = true;
const restorable = [];
for (const f of BACKED_UP_FILES) {
  const src = path.join(backupPath, f.key);
  if (!existsSync(src)) continue;
  const actual = sha256(src);
  const expected = checksums[f.key];
  if (expected && actual !== expected) {
    log(`  Checksum MISMATCH for ${f.key} — backup may be corrupted.`);
    checksumOk = false;
  } else {
    restorable.push(f);
  }
}
if (!checksumOk) {
  log("\nChecksum verification FAILED. Rollback aborted (no files changed).");
  process.exit(1);
}

// Pre-restore display.
const backupLive = readJsonSafe(path.join(backupPath, "vacancies.json"), { items: [] });
const currentLive = readJsonSafe(LIVE_PATH, { items: [] });
const currentRegistry = readJsonSafe(REGISTRY_PATH, null);
const diff = semanticDiff(currentLive, backupLive);

log("");
log("Backup verification (checksums OK):");
log(`  Backup ID:          ${backupId}`);
log(`  Backup timestamp:   ${manifest.timestamp ?? "—"}`);
log(`  Backup version:     ${manifest.contentVersion ?? "—"}`);
log(`  Backup vacancies:   ${backupLive.items?.length ?? 0}`);
log(`  Backed-up files:    ${manifest.files?.join(", ") ?? "—"}`);
log(`  Current live version: ${currentRegistry?.contentVersion ?? "—"}`);
log(`  Current vacancies:  ${currentLive.items?.length ?? 0}`);
log(`  Files to overwrite: ${restorable.map((f) => f.key).join(", ")}`);
log("");
log("Current-vs-backup semantic difference (what rollback will change):");
log(`  Added since backup:   ${diff.semantic.removed.length} (present now, absent in backup)`);
log(`  Removed since backup: ${diff.semantic.added.length} (absent now, present in backup)`);
log(`  Modified:             ${diff.semantic.modified.length}`);
log(`  Unchanged:            ${diff.semantic.unchanged.length}`);
log(`  Publicly-visible: current ${diff.publicVisibleBefore} -> after-rollback ${diff.publicVisibleAfter}`);

if (!CONFIRM) {
  log("\nDry run only. No files changed. Re-run with --confirm to restore.");
  process.exit(0);
}

// Restore.
for (const f of restorable) {
  copyFileSync(path.join(backupPath, f.key), f.path);
}
log("\nFiles restored from backup (backup preserved).");

// Post-restore staged verification.
function runStage(name, cmd, cmdArgs, mustMatch) {
  log(`\n> [${name}] ${cmd} ${cmdArgs.join(" ")}`);
  const res = spawnSync(cmd, cmdArgs, { cwd: ROOT, encoding: "utf8", shell: true });
  const out = `${res.stdout ?? ""}${res.stderr ?? ""}`;
  const ok = res.status === 0 && (!mustMatch || mustMatch.test(out));
  if (!ok) log(out.trim().split("\n").slice(-20).join("\n"));
  else log(`  [${name}] OK`);
  return ok;
}

function registryConsistencyOk() {
  const reg = readJsonSafe(REGISTRY_PATH, null);
  if (!reg) return false;
  if (!/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(String(reg.contentVersion ?? ""))) return false;
  const refs = [reg.vacancies?.liveSource, reg.vacancies?.previewSource, reg.vacancies?.sourceRegistry].filter(Boolean);
  for (const ref of refs) {
    const p = path.join(DATA_DIR, String(ref).replace(/^\/data\//, ""));
    if (!existsSync(p)) return false;
  }
  return true;
}

const stages = {
  validate: runStage("validate", "node", ["tools/validate-vacancies-json.mjs"], /RESULT: PASS/),
  typecheckBaseline: runStage("typecheck-baseline", "node", ["tools/typecheck-baseline.mjs"], /RESULT: PASS/),
  liveSmoke: runStage("live-smoke", "node", ["tools/smoke-test-vacancies-live.mjs"], /PASS/),
  build: runStage("build", "npm", ["run", "build"], null),
  registryConsistency: registryConsistencyOk(),
};
log(`\n> [registry-consistency] ${stages.registryConsistency ? "OK" : "FAIL"}`);

const allOk = Object.values(stages).every(Boolean);

const ts = timestamp();
ensureDir(REPORT_DIR);
const reportPath = path.join(REPORT_DIR, `TAIPOQ_VACANCY_ROLLBACK_${ts}.md`);
writeFileSync(
  reportPath,
  `# TAIPOQ Vacancy Rollback Report

- Generated: ${istTimestampIso()}
- Restored from backup: \`${backupId}\`
- Backup timestamp: ${manifest.timestamp ?? "—"}
- Backup content version: ${manifest.contentVersion ?? "—"}
- Backup vacancy count: ${backupLive.items?.length ?? 0}
- Files restored: ${restorable.map((f) => f.key).join(", ")}
- Backup preserved after rollback: YES

## Pre-restore semantic difference (current vs backup)

| Metric | Count |
|--------|-------|
| Present now, absent in backup | ${diff.semantic.removed.length} |
| Absent now, present in backup | ${diff.semantic.added.length} |
| Modified | ${diff.semantic.modified.length} |
| Unchanged | ${diff.semantic.unchanged.length} |

## Post-restore stages

| Stage | Result |
|-------|--------|
| Vacancy validator | ${stages.validate ? "PASS" : "FAIL"} |
| Baseline TypeScript gate | ${stages.typecheckBaseline ? "PASS" : "FAIL"} |
| Live smoke test | ${stages.liveSmoke ? "PASS" : "FAIL"} |
| Production build | ${stages.build ? "PASS" : "FAIL"} |
| Registry consistency | ${stages.registryConsistency ? "PASS" : "FAIL"} |

## Safety

- Git commit created: NO
- Git push performed: NO
- Vercel deployment performed: NO
`,
);
log(`\nRollback report: ${path.relative(ROOT, reportPath)}`);
log("");
log("Post-restore stage results:");
log(`  validate:             ${stages.validate ? "PASS" : "FAIL"}`);
log(`  typecheck-baseline:   ${stages.typecheckBaseline ? "PASS" : "FAIL"}`);
log(`  live-smoke:           ${stages.liveSmoke ? "PASS" : "FAIL"}`);
log(`  build:                ${stages.build ? "PASS" : "FAIL"}`);
log(`  registry-consistency: ${stages.registryConsistency ? "PASS" : "FAIL"}`);

if (!allOk) {
  log("\nRESULT: ROLLBACK COMPLETED WITH FAILURES — review the report.");
  process.exit(1);
}
log("\nRESULT: ROLLBACK SUCCESS (backup preserved)");
process.exit(0);
