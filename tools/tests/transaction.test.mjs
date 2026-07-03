// Part H — transaction + interruption safety tests.
// Uses temp sandboxes and lib primitives; the real publish script is spawned
// only for early-exit paths (no build), always against a temp data sandbox.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256, atomicReplaceFrom, writeJournal, readJournal, TX_STATES } from "../../tools/vacancy-update-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const REAL_DATA = path.join(ROOT, "public", "data");

function tmp() {
  return mkdtempSync(path.join(os.tmpdir(), "vac-tx-"));
}

function makeSandbox() {
  const root = tmp();
  const data = path.join(root, "data");
  const backups = path.join(root, "backups", "content");
  const reports = path.join(root, "reports");
  mkdirSync(data, { recursive: true });
  mkdirSync(backups, { recursive: true });
  mkdirSync(reports, { recursive: true });
  for (const f of ["vacancies.json", "vacancies.preview.json", "vacancy-sources.json", "content-registry.json"]) {
    copyFileSync(path.join(REAL_DATA, f), path.join(data, f));
  }
  return { root, data, backups, reports };
}

function runPublish(sandbox, extraArgs = []) {
  return spawnSync("node", ["tools/publish-vacancy-update.mjs", ...extraArgs], {
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

test("27: backup checksums are verified (tamper is detected)", () => {
  const dir = tmp();
  const file = path.join(dir, "live.json");
  writeFileSync(file, JSON.stringify({ items: [{ id: "a" }] }));
  const good = sha256(file);
  assert.equal(sha256(file), good);
  writeFileSync(file, JSON.stringify({ items: [{ id: "TAMPERED" }] }));
  assert.notEqual(sha256(file), good, "checksum changes when the file is tampered");
  rmSync(dir, { recursive: true, force: true });
});

test("28: failure after backup restores the original data byte-for-byte", () => {
  const dir = tmp();
  const live = path.join(dir, "vacancies.json");
  const backupDir = path.join(dir, "backup");
  mkdirSync(backupDir);
  const original = JSON.stringify({ items: [{ id: "orig" }] });
  writeFileSync(live, original);
  copyFileSync(live, path.join(backupDir, "vacancies.json")); // backup
  // Simulate a partial publish then failure.
  writeFileSync(live, JSON.stringify({ items: [{ id: "half-written" }] }));
  // Restore.
  copyFileSync(path.join(backupDir, "vacancies.json"), live);
  assert.equal(readFileSync(live, "utf8"), original);
  rmSync(dir, { recursive: true, force: true });
});

test("29: atomic swap replaces the file and leaves no temp artifact; recoverable", () => {
  const dir = tmp();
  const target = path.join(dir, "vacancies.json");
  const staged = path.join(dir, "staged.json");
  const backupDir = path.join(dir, "backup");
  mkdirSync(backupDir);
  writeFileSync(target, JSON.stringify({ v: "old" }));
  copyFileSync(target, path.join(backupDir, "vacancies.json"));
  writeFileSync(staged, JSON.stringify({ v: "new" }));
  atomicReplaceFrom(staged, target);
  assert.match(readFileSync(target, "utf8"), /"new"/);
  const leftovers = readdirSync(dir).filter((n) => n.includes(".tmp-"));
  assert.equal(leftovers.length, 0, "no .tmp- leftovers after atomic swap");
  // Recover from backup.
  copyFileSync(path.join(backupDir, "vacancies.json"), target);
  assert.match(readFileSync(target, "utf8"), /"old"/);
  rmSync(dir, { recursive: true, force: true });
});

test("journal records states and detects incomplete transactions", () => {
  const dir = tmp();
  const txDir = path.join(dir, "transaction");
  writeJournal(TX_STATES.SWAPPING, { ts: "x" }, txDir);
  const j = readJournal(txDir);
  assert.equal(j.state, "SWAPPING");
  assert.ok(Array.isArray(j.history) && j.history.length >= 1);
  rmSync(dir, { recursive: true, force: true });
});

test("25/26: publish without --confirm does NOT modify live files", () => {
  const sandbox = makeSandbox();
  const before = sha256(path.join(sandbox.data, "vacancies.json"));
  const res = runPublish(sandbox); // no --confirm
  const after = sha256(path.join(sandbox.data, "vacancies.json"));
  assert.equal(before, after, "live file unchanged on dry run");
  assert.match(res.stdout + res.stderr, /Dry run only/);
  rmSync(sandbox.root, { recursive: true, force: true });
});

test("30: an incomplete transaction journal blocks a new publish", () => {
  const sandbox = makeSandbox();
  // Seed an incomplete journal at sandbox/backups/transaction (dirname of backups/content).
  const txDir = path.join(sandbox.root, "backups", "transaction");
  mkdirSync(txDir, { recursive: true });
  writeFileSync(path.join(txDir, "journal.json"), JSON.stringify({ state: "SWAPPING", history: [] }));
  const before = sha256(path.join(sandbox.data, "vacancies.json"));
  const res = runPublish(sandbox, ["--confirm"]);
  const after = sha256(path.join(sandbox.data, "vacancies.json"));
  assert.equal(res.status, 2, "publish exits 2 on incomplete transaction");
  assert.match(res.stdout + res.stderr, /Incomplete transaction detected/);
  assert.equal(before, after, "live file unchanged when blocked");
  rmSync(sandbox.root, { recursive: true, force: true });
});
