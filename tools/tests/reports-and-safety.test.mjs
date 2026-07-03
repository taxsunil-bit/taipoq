// Part D report generation + data-safety guards (tests 34, 35, 36).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

test("34: warning reconciliation report is generated with category counts", () => {
  const reportDir = mkdtempSync(path.join(os.tmpdir(), "vac-rep-"));
  const res = spawnSync("node", ["tools/vacancy-warning-reconciliation.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, VACANCY_REPORT_DIR: reportDir },
  });
  assert.equal(res.status, 0, res.stdout + res.stderr);
  const jsonPath = path.join(reportDir, "vacancy-warning-reconciliation.json");
  const mdPath = path.join(reportDir, "vacancy-warning-reconciliation.md");
  assert.ok(existsSync(jsonPath), "JSON report exists");
  assert.ok(existsSync(mdPath), "Markdown report exists");
  const data = JSON.parse(readFileSync(jsonPath, "utf8"));
  assert.ok(typeof data.currentTotal === "number" && data.currentTotal > 0);
  assert.ok(Array.isArray(data.rows) && data.rows.length > 0);
  assert.ok(data.rows.every((r) => typeof r.current === "number" && typeof r.category === "string"));
  assert.equal(data.uncategorized, 0, "every warning is categorized");
  rmSync(reportDir, { recursive: true, force: true });
});

test("35: no real vacancy data file is modified by the test suite", () => {
  // Working tree must match the git index for the data files (no test mutated them).
  for (const f of [
    "public/data/vacancies.json",
    "public/data/vacancies.preview.json",
    "public/data/vacancy-sources.json",
    "public/data/content-registry.json",
  ]) {
    const res = spawnSync("git", ["diff", "--quiet", "--", f], { cwd: ROOT, encoding: "utf8" });
    assert.equal(res.status, 0, `${f} has unstaged modifications (a test mutated real data)`);
  }
});

test("36: the restore-on-failure pattern restores globals even when a test throws", () => {
  const original = globalThis.fetch;
  let restored = false;
  try {
    globalThis.fetch = () => {
      throw new Error("stub");
    };
    try {
      throw new Error("simulated test failure");
    } finally {
      globalThis.fetch = original;
      restored = true;
    }
  } catch {
    // swallow the simulated failure
  }
  assert.equal(restored, true);
  assert.equal(globalThis.fetch, original, "global fetch restored after failure");
});
