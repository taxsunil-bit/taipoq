#!/usr/bin/env node
/**
 * Prepare a TAIPOQ vacancy update.
 *
 * Read-only with respect to live data and Git. It:
 *   1. Confirms required files exist.
 *   2. Validates the preview data (delegates to the vacancy validator).
 *   3. Compares preview vs live and classifies changes.
 *   4. Detects accidental deletion of live records.
 *   5. Writes a Markdown comparison report to reports/vacancy-updates/.
 *
 * It NEVER modifies live vacancy data and NEVER changes Git state.
 *
 * Run: npm run vacancies:prepare
 */

import { existsSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  ROOT,
  LIVE_PATH,
  PREVIEW_PATH,
  SOURCES_PATH,
  REGISTRY_PATH,
  REPORT_DIR,
  readJsonSafe,
  semanticDiff,
  destructiveRemovals,
  ensureDir,
  timestamp,
  istTimestampIso,
  formatDDMMYYYY,
} from "./vacancy-update-lib.mjs";

function line(...args) {
  console.log(...args);
}

line("TAIPOQ Vacancy Prepare");
line("=".repeat(48));

// 1. Required files
const requiredMissing = [];
for (const [label, p] of [
  ["vacancies.preview.json", PREVIEW_PATH],
  ["vacancies.json", LIVE_PATH],
  ["vacancy-sources.json", SOURCES_PATH],
  ["content-registry.json", REGISTRY_PATH],
]) {
  if (!existsSync(p)) requiredMissing.push(label);
}
if (requiredMissing.length) {
  line(`Missing required files: ${requiredMissing.join(", ")}`);
  process.exit(1);
}

// 2. Validate preview data
const validation = spawnSync("node", [path.join(ROOT, "tools", "validate-vacancies-json.mjs")], {
  cwd: ROOT,
  encoding: "utf8",
});
const validationOut = `${validation.stdout ?? ""}${validation.stderr ?? ""}`;
const validationPassed = validation.status === 0 && /RESULT: PASS/.test(validationOut);
line(`Validation: ${validationPassed ? "PASS" : "FAIL"}`);

// 3 + 4. Semantic compare (identity-aware, beyond byte comparison)
const live = readJsonSafe(LIVE_PATH, { items: [] });
const preview = readJsonSafe(PREVIEW_PATH, { items: [] });
const diff = semanticDiff(live, preview);
const destructive = destructiveRemovals(diff.removed);

const collisions =
  diff.duplicateIdentities.length +
  diff.slugCollisions.length +
  diff.notificationNumberCollisions.length +
  diff.applicationUrlCollisions.length;

const publicationReady = validationPassed && destructive.length === 0 && collisions === 0;

line("");
line(`Identity strategy: ${diff.identityStrategyUsed}`);
line(`Live records:    ${diff.liveCount}`);
line(`Preview records: ${diff.previewCount}`);
line(`Added:     ${diff.semantic.added.length}`);
line(`Modified:  ${diff.semantic.modified.length}`);
line(`Unchanged: ${diff.semantic.unchanged.length}`);
line(`Removed:   ${diff.semantic.removed.length} (destructive: ${destructive.length})`);
line("");
line(`Duplicate identities: ${diff.duplicateIdentities.length}`);
line(`Slug collisions:      ${diff.slugCollisions.length}`);
line(`Notification-number collisions: ${diff.notificationNumberCollisions.length}`);
line(`Application-URL collisions:     ${diff.applicationUrlCollisions.length}`);
line(`Ambiguous identities: ${diff.ambiguousIdentities.length}`);
line(`Trust-classification changes:   ${diff.trustChanges.length}`);
line(`Strict-eligibility changes:     ${diff.eligibilityChanges.length}`);
line(`Publicly-visible delta: ${diff.publicVisibleBefore} → ${diff.publicVisibleAfter} (${diff.publicVisibleDelta >= 0 ? "+" : ""}${diff.publicVisibleDelta})`);
line("");
line(`Publication readiness: ${publicationReady ? "READY" : "BLOCKED"}`);

// 5. Markdown report
function mdList(items, render) {
  if (!items.length) return "_None_\n";
  return items.map((x) => `- ${render(x)}`).join("\n") + "\n";
}

const ts = timestamp();
ensureDir(REPORT_DIR);
const reportPath = path.join(REPORT_DIR, `TAIPOQ_VACANCY_PREPARE_${ts}.md`);

const report = `# TAIPOQ Vacancy Prepare Report

- Generated: ${istTimestampIso()}
- Live source: \`public/data/vacancies.json\`
- Preview source: \`public/data/vacancies.preview.json\`

## Summary

| Metric | Count |
|--------|-------|
| Live records | ${diff.liveCount} |
| Preview records | ${diff.previewCount} |
| Added | ${diff.semantic.added.length} |
| Modified | ${diff.semantic.modified.length} |
| Unchanged | ${diff.semantic.unchanged.length} |
| Removed | ${diff.semantic.removed.length} |
| Destructive removals | ${destructive.length} |
| Duplicate identities | ${diff.duplicateIdentities.length} |
| Slug collisions | ${diff.slugCollisions.length} |
| Notification-number collisions | ${diff.notificationNumberCollisions.length} |
| Application-URL collisions | ${diff.applicationUrlCollisions.length} |
| Ambiguous identities | ${diff.ambiguousIdentities.length} |
| Source mappings added | ${diff.sourceMappingsAdded.length} |
| Source mappings removed | ${diff.sourceMappingsRemoved.length} |
| Trust-classification changes | ${diff.trustChanges.length} |
| Strict-eligibility changes | ${diff.eligibilityChanges.length} |
| Publicly-visible before | ${diff.publicVisibleBefore} |
| Publicly-visible after | ${diff.publicVisibleAfter} |
| Publicly-visible delta | ${diff.publicVisibleDelta} |

- **Identity strategy:** ${diff.identityStrategyUsed}
- **Validation result:** ${validationPassed ? "PASS" : "FAIL"}
- **Publication readiness:** ${publicationReady ? "READY" : "BLOCKED"}

## Added records
${mdList(diff.semantic.added, (id) => `\`${id}\``)}

## Modified records
${mdList(diff.semantic.modified, (id) => `\`${id}\``)}

## Removed records
${mdList(diff.semantic.removed, (id) => `\`${id}\``)}

## Ambiguous identities (identity strategy used)
${mdList(diff.ambiguousIdentities, (x) => `\`${x.id}\`: ${x.strategy}`)}

## Duplicate identities
${mdList(diff.duplicateIdentities, (x) => `\`${x.value}\`: ${x.ids.join(", ")}`)}

## Slug collisions
${mdList(diff.slugCollisions, (x) => `\`${x.value}\`: ${x.ids.join(", ")}`)}

## Notification-number collisions
${mdList(diff.notificationNumberCollisions, (x) => `\`${x.value}\`: ${x.ids.join(", ")}`)}

## Application-URL collisions
${mdList(diff.applicationUrlCollisions, (x) => `\`${x.value}\`: ${x.ids.join(", ")}`)}

## Status changes
${mdList(diff.statusChanges, (x) => `\`${x.id}\`: ${x.from} → ${x.to}`)}

## Source changes
${mdList(diff.sourceChanges, (x) => `\`${x.id}\`: ${x.changes.map((c) => c.field).join(", ")}`)}

## Date changes
${mdList(diff.dateChanges, (x) =>
  `\`${x.id}\`: ` +
  x.changes
    .map((c) => `${c.field} ${formatDDMMYYYY(c.from) || c.from || "—"} → ${formatDDMMYYYY(c.to) || c.to || "—"}`)
    .join("; "),
)}

## Trust-classification changes
${mdList(diff.trustChanges, (x) => `\`${x.id}\`: ${x.from} → ${x.to}`)}

## Strict-publication-eligibility changes
${mdList(diff.eligibilityChanges, (x) => `\`${x.id}\`: ${x.from} → ${x.to}`)}

${destructive.length ? `> **WARNING:** ${destructive.length} removed record(s) were publicly visible. Removing them is a destructive change and must be approved with \`--allow-destructive\` before publishing.\n` : ""}${collisions ? `> **BLOCKED:** ${collisions} identity/slug/notification/application collision(s) detected. Resolve before publishing.\n` : ""}
## Validation output

\`\`\`
${validationOut.trim()}
\`\`\`
`;

writeFileSync(reportPath, report);
line("");
line(`Report written: ${path.relative(ROOT, reportPath)}`);
line("");
line("Live data was NOT modified. Git state was NOT changed.");

process.exit(publicationReady ? 0 : 1);
