#!/usr/bin/env node
/**
 * Vacancy warning reconciliation (Update Safety System hardening — Part D).
 *
 * Explains the difference between the previous validator's warning total
 * (baseline, HEAD version, preview-only) and the current validator's total
 * (live + preview + registries), category-by-category.
 *
 * Runs both validators, classifies every warning line into a stable category,
 * and writes machine-readable JSON + human-readable Markdown reports to
 * reports/vacancy-updates/ (git-ignored).
 *
 * Run: npm run vacancies:warnings
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CURRENT_VALIDATOR = path.join(ROOT, "tools", "validate-vacancies-json.mjs");
const REPORT_DIR = process.env.VACANCY_REPORT_DIR
  ? path.resolve(process.env.VACANCY_REPORT_DIR)
  : path.join(ROOT, "reports", "vacancy-updates");

/** Warning categories with metadata. `model` = legacy | new-model | structural. */
const CATEGORIES = [
  { id: "legacy_verification_pending", model: "legacy", test: /verification_pending/, explanation: "Legacy record still marked verification_pending; excluded from public feed." },
  { id: "generic_status_label", model: "legacy", test: /generic statusLabel|statusLabel is generic/, explanation: "statusLabel uses a generic placeholder." },
  { id: "vague_notification_window", model: "legacy", test: /vague notificationWindowText|notificationWindowText is vague|notificationWindow is vague/, explanation: "notificationWindowText is vague; needs verified dates." },
  { id: "undeclared_vacancy_count", model: "legacy", test: /घोषित नहीं/, explanation: "Vacancy count not declared; confirm before publishing." },
  { id: "duplicate_notification_url", model: "structural", test: /duplicate official notification URL/, explanation: "Two records share one official notification URL (often the same portal)." },
  { id: "preview_new_records", model: "structural", test: /preview introduces \d+ new record/, explanation: "Preview contains records not yet in live (informational)." },
  { id: "source_missing_checkedat", model: "new-model", test: /missing checkedAt/, explanation: "Source registry entry has no checkedAt date." },
  { id: "source_registry_missing", model: "structural", test: /vacancy-sources\.json not found/, explanation: "Source registry file missing." },
  { id: "registry_missing", model: "structural", test: /content-registry\.json not found/, explanation: "Content registry file missing." },
  { id: "registry_version_format", model: "structural", test: /contentVersion .* is not YYYY/, explanation: "contentVersion not in YYYY.MM.DD.REVISION form." },
  { id: "live_missing", model: "structural", test: /vacancies\.json not found/, explanation: "Live data file missing." },
  { id: "preview_missing", model: "structural", test: /vacancies\.preview\.json not found/, explanation: "Preview data file missing." },
];

/**
 * Categories that the spec asks about but the CURRENT validator does NOT emit
 * as warnings (they are enforced as blocking ERRORS, or simply not warned for
 * optional legacy fields). Reported honestly as newly-listed / zero.
 */
const NON_EMITTED_CATEGORIES = [
  { id: "missing_slug", model: "new-model", enforcement: "not warned (slug optional for legacy records)" },
  { id: "missing_lifecycleStatus", model: "new-model", enforcement: "not warned (optional; derived via compatibility layer)" },
  { id: "missing_verificationStatus", model: "new-model", enforcement: "not warned (optional; derived)" },
  { id: "missing_lastVerifiedAt", model: "new-model", enforcement: "ERROR only when lifecycleStatus=published" },
  { id: "missing_sourceIds", model: "new-model", enforcement: "ERROR only when lifecycleStatus=published" },
  { id: "unresolved_source_id", model: "new-model", enforcement: "ERROR (blocking) when a referenced sourceId is missing" },
  { id: "missing_official_notification_url", model: "new-model", enforcement: "ERROR (blocking) for published records" },
  { id: "missing_official_application_url", model: "new-model", enforcement: "ERROR (blocking) for published records" },
  { id: "invalid_or_non_https_url", model: "structural", enforcement: "ERROR (blocking) for malformed/non-https URLs" },
  { id: "duplicate_identity", model: "structural", enforcement: "ERROR (blocking) on duplicate id" },
  { id: "duplicate_slug", model: "structural", enforcement: "ERROR (blocking) on duplicate slug" },
  { id: "notification_number_collision", model: "structural", enforcement: "ERROR (blocking) on duplicate advertisementNumber per organisation" },
  { id: "application_url_collision", model: "structural", enforcement: "detected by prepare/semantic diff (informational)" },
  { id: "date_status_inconsistency", model: "structural", enforcement: "ERROR (blocking) on contradictory date sequences" },
];

function classify(message) {
  for (const c of CATEGORIES) if (c.test.test(message)) return c.id;
  return "uncategorized";
}

function scopeOf(message) {
  const m = /^\[(live|preview|sources|registry|compare)\]/.exec(message);
  if (m) return m[1];
  return "preview"; // baseline validator (HEAD) is preview-only with no prefix
}

function idOf(message) {
  const m = /\(id=([^)]+)\)/.exec(message);
  return m ? m[1] : null;
}

function parseWarnings(stdout) {
  const lines = stdout.split("\n");
  const warnings = [];
  let inWarnings = false;
  for (const line of lines) {
    if (/^WARNINGS?\s*\(\d+\)/.test(line.trim())) {
      inWarnings = true;
      continue;
    }
    if (inWarnings) {
      const m = /^\s*\d+\.\s+(.*)$/.exec(line);
      if (m) warnings.push(m[1].trim());
      else if (line.trim() === "" || /^RESULT|^Result/.test(line.trim())) inWarnings = false;
    }
  }
  return warnings;
}

function runValidator(scriptPath) {
  const res = spawnSync("node", [scriptPath], { cwd: ROOT, encoding: "utf8" });
  return `${res.stdout ?? ""}${res.stderr ?? ""}`;
}

function getBaselineOutput() {
  // Extract the HEAD (pre-hardening) validator and run it with correct ROOT.
  const tmp = path.join(ROOT, "tools", ".recon-head-validator.mjs");
  const show = spawnSync("git", ["show", "HEAD:tools/validate-vacancies-json.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (show.status !== 0 || !show.stdout) return null;
  try {
    writeFileSync(tmp, show.stdout);
    const out = runValidator(tmp);
    return out;
  } finally {
    if (existsSync(tmp)) rmSync(tmp, { force: true });
  }
}

function tally(warnings) {
  const byCategory = new Map();
  const idsByCategory = new Map();
  for (const w of warnings) {
    const cat = classify(w);
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
    const id = idOf(w);
    if (id) {
      const set = idsByCategory.get(cat) ?? new Set();
      set.add(`${scopeOf(w)}:${id}`);
      idsByCategory.set(cat, set);
    }
  }
  return { byCategory, idsByCategory };
}

console.log("TAIPOQ Vacancy Warning Reconciliation");
console.log("=".repeat(48));

const currentOut = runValidator(CURRENT_VALIDATOR);
const currentWarnings = parseWarnings(currentOut);
const current = tally(currentWarnings);

const baselineOut = getBaselineOutput();
const baselineWarnings = baselineOut ? parseWarnings(baselineOut) : [];
const baseline = tally(baselineWarnings);

// Overlap: records appearing in more than one current category.
const recordCategoryMap = new Map();
for (const w of currentWarnings) {
  const id = idOf(w);
  if (!id) continue;
  const key = `${scopeOf(w)}:${id}`;
  const set = recordCategoryMap.get(key) ?? new Set();
  set.add(classify(w));
  recordCategoryMap.set(key, set);
}
const overlappingRecords = [...recordCategoryMap.entries()]
  .filter(([, set]) => set.size > 1)
  .map(([rec, set]) => ({ record: rec, categories: [...set] }));

const allCatIds = new Set([...CATEGORIES.map((c) => c.id), ...current.byCategory.keys(), ...baseline.byCategory.keys()]);
const rows = [];
for (const catId of allCatIds) {
  const meta = CATEGORIES.find((c) => c.id === catId);
  const b = baseline.byCategory.get(catId) ?? 0;
  const c = current.byCategory.get(catId) ?? 0;
  rows.push({
    category: catId,
    model: meta?.model ?? "unknown",
    baseline: b,
    current: c,
    difference: c - b,
    affectedRecords: (current.idsByCategory.get(catId)?.size) ?? 0,
    blocking: false,
    explanation: meta?.explanation ?? "(uncategorized — investigate)",
  });
}
rows.sort((a, b) => b.current - a.current || a.category.localeCompare(b.category));

const legacyTotal = rows.filter((r) => r.model === "legacy").reduce((s, r) => s + r.current, 0);
const newModelTotal = rows.filter((r) => r.model === "new-model").reduce((s, r) => s + r.current, 0);
const structuralTotal = rows.filter((r) => r.model === "structural").reduce((s, r) => s + r.current, 0);

const uncategorized = current.byCategory.get("uncategorized") ?? 0;

const summary = {
  generatedAt: new Date().toISOString(),
  baselineTotal: baselineWarnings.length,
  currentTotal: currentWarnings.length,
  difference: currentWarnings.length - baselineWarnings.length,
  legacyTotal,
  newModelTotal,
  structuralTotal,
  uncategorized,
  blockingWarnings: 0,
  nonBlockingWarnings: currentWarnings.length,
  overlappingRecordCount: overlappingRecords.length,
  rows,
  nonEmittedCategories: NON_EMITTED_CATEGORIES,
  overlappingRecords,
  explanationOfDifference:
    "The baseline validator scanned only the preview file (78 records). The current validator scans live + preview (78 + 78, live is a byte-identical copy at migration time) plus the source and content registries, so the four legacy per-record categories roughly double, and structural registry/comparison warnings are added.",
};

// Write reports (git-ignored location).
import("node:fs").then(({ mkdirSync }) => {
  mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = path.join(REPORT_DIR, "vacancy-warning-reconciliation.json");
  const mdPath = path.join(REPORT_DIR, "vacancy-warning-reconciliation.md");
  writeFileSync(jsonPath, JSON.stringify(summary, null, 2) + "\n");

  const tableRows = rows
    .map((r) => `| ${r.category} | ${r.model} | ${r.baseline} | ${r.current} | ${r.difference >= 0 ? "+" : ""}${r.difference} | ${r.affectedRecords} | ${r.explanation} |`)
    .join("\n");
  const nonEmitted = NON_EMITTED_CATEGORIES.map((c) => `| ${c.id} | ${c.model} | ${c.enforcement} |`).join("\n");

  const md = `# TAIPOQ Vacancy Warning Reconciliation

- Generated: ${summary.generatedAt}
- Baseline (previous validator, preview-only) total: **${summary.baselineTotal}**
- Current validator total: **${summary.currentTotal}**
- Difference: **${summary.difference >= 0 ? "+" : ""}${summary.difference}**
- Legacy warnings: ${legacyTotal} · New-model warnings: ${newModelTotal} · Structural warnings: ${structuralTotal}
- Blocking warnings: 0 (all warnings are non-blocking; blocking issues are ERRORS)
- Records appearing in multiple categories: ${overlappingRecords.length}
- Uncategorized: ${uncategorized}

## Explanation of 164 vs 374

${summary.explanationOfDifference}

## Category reconciliation

| Warning category | Model | Baseline | Current | Difference | Affected records | Explanation |
|------------------|-------|----------|---------|------------|------------------|-------------|
${tableRows}

## Spec categories NOT emitted as warnings by the current validator

These are either enforced as blocking ERRORS or intentionally not warned for optional legacy fields (documented as newly-listed).

| Category | Model | Enforcement |
|----------|-------|-------------|
${nonEmitted}

## Records in multiple categories

${overlappingRecords.length ? overlappingRecords.map((o) => `- \`${o.record}\`: ${o.categories.join(", ")}`).join("\n") : "_None_"}
`;
  writeFileSync(mdPath, md);

  console.log(`Baseline total:  ${summary.baselineTotal}`);
  console.log(`Current total:   ${summary.currentTotal}`);
  console.log(`Difference:      ${summary.difference >= 0 ? "+" : ""}${summary.difference}`);
  console.log(`Legacy/New/Structural: ${legacyTotal}/${newModelTotal}/${structuralTotal}`);
  console.log(`Uncategorized:   ${uncategorized}`);
  console.log(`Overlapping records: ${overlappingRecords.length}`);
  console.log("");
  console.log("Category table:");
  for (const r of rows) {
    console.log(`  ${r.category.padEnd(28)} base=${String(r.baseline).padStart(3)} cur=${String(r.current).padStart(3)} diff=${r.difference >= 0 ? "+" : ""}${r.difference}`);
  }
  console.log("");
  console.log(`Reports written:`);
  console.log(`  ${path.relative(ROOT, jsonPath)}`);
  console.log(`  ${path.relative(ROOT, mdPath)}`);
  if (uncategorized > 0) {
    console.log(`\nWARNING: ${uncategorized} uncategorized warning(s) — classifier needs an update.`);
    process.exit(2);
  }
});
