// Part I — rollback hardening tests (early-exit paths only; no build).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../../tools/vacancy-update-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const REAL_DATA = path.join(ROOT, "public", "data");
const BACKUP_KEYS = ["vacancies.json", "vacancy-sources.json", "content-registry.json"];

function makeSandbox() {
  const root = mkdtempSync(path.join(os.tmpdir(), "vac-rb-"));
  const data = path.join(root, "data");
  const backups = path.join(root, "backups", "content");
  const reports = path.join(root, "reports");
  mkdirSync(data, { recursive: true });
  mkdirSync(backups, { recursive: true });
  mkdirSync(reports, { recursive: true });
  for (const f of [...BACKUP_KEYS, "vacancies.preview.json"]) {
    copyFileSync(path.join(REAL_DATA, f), path.join(data, f));
  }
  return { root, data, backups, reports };
}

function makeBackup(sandbox, id = "20260704_000000") {
  const bdir = path.join(sandbox.backups, id);
  mkdirSync(bdir, { recursive: true });
  const checksums = {};
  for (const k of BACKUP_KEYS) {
    copyFileSync(path.join(sandbox.data, k), path.join(bdir, k));
    checksums[k] = sha256(path.join(bdir, k));
  }
  writeFileSync(path.join(bdir, "checksums.json"), JSON.stringify(checksums));
  writeFileSync(
    path.join(bdir, "manifest.json"),
    JSON.stringify({ timestamp: "2026-07-04T00:00:00+05:30", contentVersion: "2026.07.04.1", files: BACKUP_KEYS, checksums }),
  );
  return { bdir, id };
}

function runRollback(sandbox, args) {
  return spawnSync("node", ["tools/rollback-vacancy-update.mjs", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    env: {
      ...process.env,
      VACANCY_DATA_DIR: sandbox.data,
      VACANCY_BACKUP_DIR: sandbox.backups,
      VACANCY_REPORT_DIR: sandbox.reports,
    },
  });
}

test("31: rollback without --confirm does nothing", () => {
  const sandbox = makeSandbox();
  const { id } = makeBackup(sandbox);
  const before = sha256(path.join(sandbox.data, "vacancies.json"));
  const res = runRollback(sandbox, [`--backup=${id}`]);
  const after = sha256(path.join(sandbox.data, "vacancies.json"));
  assert.equal(before, after, "live file unchanged without --confirm");
  assert.match(res.stdout + res.stderr, /Dry run only/);
  rmSync(sandbox.root, { recursive: true, force: true });
});

test("32: rollback verifies checksums BEFORE restoring", () => {
  const sandbox = makeSandbox();
  const { id, bdir } = makeBackup(sandbox);
  // Corrupt the backup file WITHOUT updating checksums.json.
  writeFileSync(path.join(bdir, "vacancies.json"), JSON.stringify({ items: [{ id: "corrupt" }] }));
  const before = sha256(path.join(sandbox.data, "vacancies.json"));
  const res = runRollback(sandbox, [`--backup=${id}`, "--confirm"]);
  const after = sha256(path.join(sandbox.data, "vacancies.json"));
  assert.notEqual(res.status, 0, "rollback fails on checksum mismatch");
  assert.match(res.stdout + res.stderr, /Checksum (MISMATCH|verification FAILED)/);
  assert.equal(before, after, "live file untouched when checksum fails");
  rmSync(sandbox.root, { recursive: true, force: true });
});

test("33: rollback shows semantic differences before overwriting", () => {
  const sandbox = makeSandbox();
  const { id } = makeBackup(sandbox);
  const res = runRollback(sandbox, [`--backup=${id}`]);
  const out = res.stdout + res.stderr;
  assert.match(out, /semantic difference/i);
  assert.match(out, /Files to overwrite/i);
  assert.match(out, /Backup verification/i);
  rmSync(sandbox.root, { recursive: true, force: true });
});
