#!/usr/bin/env node
/**
 * Source registry integrity audit (Update Safety System hardening — Part F).
 *
 * Validates only the EXISTING stored data — it never browses the internet and
 * never changes URLs. Reports orphans, duplicates (after safe normalization),
 * shared sources, vacancies without a source mapping, unresolved source IDs,
 * and official-typed sources on non-official-looking domains (for manual
 * review — never deleted).
 *
 * Run: npm run vacancies:sources
 */

import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  LIVE_PATH,
  PREVIEW_PATH,
  SOURCES_PATH,
  REPORT_DIR,
  readJsonSafe,
  auditSourceRegistry,
} from "./vacancy-update-lib.mjs";

console.log("TAIPOQ Vacancy Source Registry Audit");
console.log("=".repeat(48));

if (!existsSync(SOURCES_PATH)) {
  console.log("vacancy-sources.json not found.");
  process.exit(1);
}

const live = readJsonSafe(LIVE_PATH, { items: [] });
const preview = readJsonSafe(PREVIEW_PATH, { items: [] });
const sources = readJsonSafe(SOURCES_PATH, []);

// Audit against the union of live + preview vacancies (dedup by id).
const vacancyById = new Map();
for (const v of [...(live.items ?? []), ...(preview.items ?? [])]) {
  if (v?.id && !vacancyById.has(v.id)) vacancyById.set(v.id, v);
}
const vacancies = [...vacancyById.values()];

const audit = auditSourceRegistry(vacancies, sources);

const hardFailures =
  audit.duplicateSourceIds.length +
  audit.missingType.length +
  audit.orphanSources.length +
  audit.unresolvedSourceIds.length;

console.log(`Total sources:   ${audit.totalSources}`);
console.log(`Total vacancies: ${audit.totalVacancies}`);
console.log(`Duplicate source IDs:            ${audit.duplicateSourceIds.length}`);
console.log(`Missing id/sourceType:           ${audit.missingType.length}`);
console.log(`Duplicate normalized URLs:       ${audit.duplicateNormalizedUrls.length}`);
console.log(`Shared sources (multi-vacancy):  ${audit.sharedSources.length}`);
console.log(`Orphan sources (unresolved vac): ${audit.orphanSources.length}`);
console.log(`Vacancies without a source:      ${audit.vacanciesWithoutSource.length}`);
console.log(`Unresolved referenced sourceIds: ${audit.unresolvedSourceIds.length}`);
console.log(`Official-typed, non-official domain (manual review): ${audit.nonOfficialButOfficialTyped.length}`);
console.log(`Distinct domains:                ${audit.distinctDomains.length}`);

mkdirSync(REPORT_DIR, { recursive: true });
const jsonPath = path.join(REPORT_DIR, "vacancy-source-audit.json");
writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), ...audit }, null, 2) + "\n");
console.log(`\nReport written: ${path.relative(ROOT, jsonPath)}`);

// Only structural integrity problems are hard failures. Non-official-domain
// flags and vacancies-without-source are advisory (reported, not fatal).
if (hardFailures > 0) {
  console.log("\nRESULT: FAIL (structural integrity issues found)");
  process.exit(1);
}
console.log("\nRESULT: PASS (advisory findings are for manual review only)");
process.exit(0);
