#!/usr/bin/env node
/**
 * Phase B1 — apply partial strict verification to the priority batch.
 * Only records marked READY_FOR_STRICT_VERIFICATION are migrated.
 *
 * Usage: node tools/apply-partial-vacancy-verification.mjs [--report-dir <path>]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  LIVE_PATH,
  PREVIEW_PATH,
  SOURCES_PATH,
  readJson,
  writeJson,
  istDateOnly,
  semanticDiff,
} from "./vacancy-update-lib.mjs";
import { strictPublicationContractPasses } from "../src/lib/vacanciesSource.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = istDateOnly(new Date("2026-07-05T00:00:00+05:30"));

const DEFAULT_REPORT =
  process.env.PARTIAL_VERIFICATION_REPORT_DIR ||
  "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_partial_verification_20260705_053458";

const args = process.argv.slice(2);
const reportArgIdx = args.indexOf("--report-dir");
const REPORT_DIR = reportArgIdx >= 0 ? args[reportArgIdx + 1] : DEFAULT_REPORT;

/** @type {Record<string, string>} */
const PRIORITY_DECISIONS = {
  "sbi-po-2026": "READY_FOR_STRICT_VERIFICATION",
  "rrb-technician-cen-02-2026": "KEEP_REVIEW_PENDING",
  "isro-istrac-02-2026": "KEEP_REVIEW_PENDING",
  "gujarat-hc-legal-assistant-2026": "KEEP_REVIEW_PENDING",
  "new-india-assurance-apprentice-2026-27": "READY_FOR_STRICT_VERIFICATION",
  "drdo-deal-apprentice-2026-27": "KEEP_REVIEW_PENDING",
  "indian-navy-agniveer-apprentice-0127-0227-2026": "CORRIGENDUM_REVIEW_REQUIRED",
  "delhi-hjs-examination-2026": "SOURCE_REPAIR_REQUIRED",
};

const STRICT_READY_IDS = Object.entries(PRIORITY_DECISIONS)
  .filter(([, d]) => d === "READY_FOR_STRICT_VERIFICATION")
  .map(([id]) => id);

function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

function fact(key, value, sourceId) {
  return `fact:${key}|value:${value}|source:${sourceId}|verifiedAt:${VERIFIED_AT}`;
}

/** @type {Record<string, object>} */
const STRICT_PATCHES = {
  "sbi-po-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: ["sbi-po-2026--notification", "sbi-po-2026--application", "sbi-po-2026--website"],
    advertisementNumber: "CRPD/PO/2026-27/09",
    notificationDate: "2026-06-23",
    totalVacancies: 1500,
    officialNotificationUrl:
      "https://bank.sbi/documents/77530/57941334/23062026_SBI+_+Detailed+Advt.+PO+26-27_09+-+Hindi.pdf/0f0ff4e1-2ef6-1e3f-719f-bb95ec1a2e13?t=1782216346313",
    officialApplicationUrl: "https://ibpsreg.ibps.in/sbipojun26/",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from SBI detailed advertisement CRPD/PO/2026-27/09 (official PDF). No corrigendum located. Apply only via official IBPS registration portal.",
  },
  "new-india-assurance-apprentice-2026-27": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      "new-india-assurance-apprentice-2026-27--notification",
      "new-india-assurance-apprentice-2026-27--application",
      "new-india-assurance-apprentice-2026-27--website",
    ],
    advertisementNumber: "Apprentice Advertisement 2026-27",
    notificationDate: "2026-06-23",
    totalVacancies: 550,
    officialNotificationUrl:
      "https://www.newindia.co.in/assets/docs/engagement-of-apprentices/Apprentice%20Advertisement%202026-27.pdf",
    officialApplicationUrl: "https://nats.education.gov.in/",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official Apprentice Advertisement 2026-27 PDF. Apprenticeship engagement — not a regular job. Register on NATS first, then complete BFSI SSC application and fee on beep.bfsissc.com.",
    examWindowText:
      "Online examination 12.07.2026 (BFSI SSC). Stipend Rs 12,300/month for 12-month apprenticeship.",
  },
};

/** @type {Record<string, string[]>} */
const SOURCE_VERIFIED_FACTS = {
  "sbi-po-2026--notification": [
    fact("advertisementNumber", "CRPD/PO/2026-27/09", "sbi-po-2026--notification"),
    fact("totalVacancies", "1500", "sbi-po-2026--notification"),
    fact("applicationStartDate", "2026-06-18", "sbi-po-2026--notification"),
    fact("applicationEndDate", "2026-07-08", "sbi-po-2026--notification"),
    fact("ageLimit", "21-30 years as on 01.04.2026 (DOB 02.04.1996 to 01.04.2005)", "sbi-po-2026--notification"),
    fact("applicationFee", "Rs 750 for General/OBC/EWS; nil for SC/ST/PwBD", "sbi-po-2026--notification"),
    fact("employmentType", "regular probationary officer recruitment", "sbi-po-2026--notification"),
    fact("selectionProcess", "Phase I Preliminary; Phase II Main; Phase III Psychometric, Group Exercise and Interview", "sbi-po-2026--notification"),
  ],
  "sbi-po-2026--application": [
    fact("officialApplicationUrl", "https://ibpsreg.ibps.in/sbipojun26/", "sbi-po-2026--application"),
    fact("applicationMode", "online via IBPS registration portal", "sbi-po-2026--application"),
  ],
  "new-india-assurance-apprentice-2026-27--notification": [
    fact("totalVacancies", "550", "new-india-assurance-apprentice-2026-27--notification"),
    fact("applicationStartDate", "2026-06-23", "new-india-assurance-apprentice-2026-27--notification"),
    fact("applicationEndDate", "2026-07-06", "new-india-assurance-apprentice-2026-27--notification"),
    fact("examDate", "2026-07-12", "new-india-assurance-apprentice-2026-27--notification"),
    fact("ageLimit", "21-30 years as on 01.06.2026 (DOB 02.06.1996 to 01.06.2005)", "new-india-assurance-apprentice-2026-27--notification"),
    fact("applicationFee", "Gen/EWS/OBC Male Rs 944; Female Rs 708; SC/ST/PwBD Rs 236 (incl. GST)", "new-india-assurance-apprentice-2026-27--notification"),
    fact("stipend", "Rs 12300 per month", "new-india-assurance-apprentice-2026-27--notification"),
    fact("employmentType", "apprenticeship under Apprentices Act 1961", "new-india-assurance-apprentice-2026-27--notification"),
    fact("qualification", "Graduation with passing certificate dated 01.01.2022 to 01.06.2026 inclusive; NATS profile 100% complete", "new-india-assurance-apprentice-2026-27--notification"),
  ],
  "new-india-assurance-apprentice-2026-27--application": [
    fact("officialApplicationUrl", "https://nats.education.gov.in/", "new-india-assurance-apprentice-2026-27--application"),
    fact("applicationMode", "NATS registration first; then BFSI SSC on beep.bfsissc.com for exam fee and application", "new-india-assurance-apprentice-2026-27--application"),
  ],
};

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  writeFileSync(filePath, lines.join("\n") + "\n", "utf8");
}

function ensureReportDir() {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
}

function applySourcePatches(sources) {
  const byId = new Map(sources.map((s) => [s.id, s]));
  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    const rec = byId.get(sourceId);
    if (!rec) throw new Error(`Missing source registry entry: ${sourceId}`);
    rec.verifiedFacts = facts;
    rec.checkedAt = VERIFIED_AT;
    rec.corrigendumChecked = true;
    rec.notes = `${rec.notes ?? ""} Phase B1 strict verification ${VERIFIED_AT}; no corrigendum found.`.trim();
  }
  return sources;
}

function applyPreviewPatches(preview) {
  const items = preview.items.map((item) => {
    const patch = STRICT_PATCHES[item.id];
    if (!patch) return item;
    return { ...item, ...patch };
  });
  return { ...preview, lastUpdated: VERIFIED_AT, items };
}

function buildCheckpointArtifacts(live, preview, sources) {
  ensureReportDir();

  const priorityIds = Object.keys(PRIORITY_DECISIONS);
  const selectedBefore = live.items.filter((i) => priorityIds.includes(i.id));
  writeJson(path.join(REPORT_DIR, "selected-records-before.json"), selectedBefore);

  const matrixRows = priorityIds.map((id) => {
    const item = live.items.find((i) => i.id === id);
    return {
      recordId: id,
      title: item?.title ?? "",
      decision: PRIORITY_DECISIONS[id],
      strictReady: PRIORITY_DECISIONS[id] === "READY_FOR_STRICT_VERIFICATION" ? "yes" : "no",
    };
  });
  writeCsv(path.join(REPORT_DIR, "priority-batch-verification-matrix.csv"), ["recordId", "title", "decision", "strictReady"], matrixRows);

  const factRows = [];
  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    for (const f of facts) {
      const m = Object.fromEntries(f.split("|").map((p) => p.split(":")));
      factRows.push({
        recordId: sourceId.replace(/--(notification|application|website)$/, ""),
        factKey: m.fact ?? "",
        verifiedValue: m.value ?? "",
        sourceId: m.source ?? sourceId,
        verifiedAt: m.verifiedAt ?? VERIFIED_AT,
      });
    }
  }
  writeCsv(
    path.join(REPORT_DIR, "verified-facts-proposed.csv"),
    ["recordId", "factKey", "verifiedValue", "sourceId", "verifiedAt"],
    factRows,
  );

  writeJson(
    path.join(REPORT_DIR, "strict-ready-records.json"),
    STRICT_READY_IDS.map((id) => preview.items.find((i) => i.id === id)),
  );
  writeJson(
    path.join(REPORT_DIR, "review-pending-records.json"),
    priorityIds
      .filter((id) => PRIORITY_DECISIONS[id] !== "READY_FOR_STRICT_VERIFICATION")
      .map((id) => ({ id, decision: PRIORITY_DECISIONS[id], record: live.items.find((i) => i.id === id) })),
  );

  writeCsv(
    path.join(REPORT_DIR, "source-repair-plan.csv"),
    ["recordId", "issue", "action"],
    [{ recordId: "delhi-hjs-examination-2026", issue: "recruitment URL 404", action: "locate direct official PDF before verification" }],
  );
  writeCsv(
    path.join(REPORT_DIR, "corrigendum-review.csv"),
    ["recordId", "issue", "action"],
    [
      {
        recordId: "indian-navy-agniveer-apprentice-0127-0227-2026",
        issue: "extension to 05/07/2026 17:00 not fully reconciled in registry",
        action: "reconcile corrigendum and dedicated apply URL",
      },
    ],
  );
  writeCsv(path.join(REPORT_DIR, "unresolved-fields.csv"), ["recordId", "field", "reason"], [
    { recordId: "rrb-technician-cen-02-2026", field: "qualificationShort,feeShort", reason: "placeholder text remains" },
    { recordId: "isro-istrac-02-2026", field: "post-wise fields", reason: "multi-post placeholders" },
    { recordId: "gujarat-hc-legal-assistant-2026", field: "ageLimitShort,feeShort", reason: "view official advertisement placeholders" },
    { recordId: "drdo-deal-apprentice-2026-27", field: "applyUrl,ageLimitShort", reason: "no dedicated application URL" },
  ]);

  const summary = [
    `Phase B1 checkpoint generated ${VERIFIED_AT}`,
    `Candidates reviewed: ${priorityIds.length}`,
    `Strict-ready: ${STRICT_READY_IDS.length} (${STRICT_READY_IDS.join(", ")})`,
    `Review-pending: ${matrixRows.filter((r) => r.decision === "KEEP_REVIEW_PENDING").length}`,
    `Source-repair: 1 (delhi-hjs-examination-2026)`,
    `Corrigendum-blocked: 1 (indian-navy-agniveer-apprentice-0127-0227-2026)`,
    `Schema-blocked: 0 in this batch`,
  ].join("\n");
  writeFileSync(path.join(REPORT_DIR, "evidence-summary.txt"), summary + "\n", "utf8");
}

function main() {
  if (STRICT_READY_IDS.length === 0) {
    console.error("STOP: zero strict-ready records — release blocked.");
    process.exit(2);
  }

  const live = readJson(LIVE_PATH);
  const preview = readJson(PREVIEW_PATH);
  const sources = readJson(SOURCES_PATH);

  buildCheckpointArtifacts(live, preview, sources);

  const nextPreview = applyPreviewPatches(preview);
  const nextSources = applySourcePatches([...sources]);

  for (const id of STRICT_READY_IDS) {
    const item = nextPreview.items.find((i) => i.id === id);
    if (!strictPublicationContractPasses(item)) {
      console.error(`Strict contract failed for ${id}`);
      process.exit(1);
    }
  }

  writeJson(PREVIEW_PATH, nextPreview);
  writeJson(SOURCES_PATH, nextSources);

  const diff = semanticDiff(live, nextPreview);
  console.log("Phase B1 partial verification applied to preview + sources.");
  console.log(`Strict-ready records: ${STRICT_READY_IDS.join(", ")}`);
  console.log(`Modified preview records: ${diff.semantic.modified.join(", ")}`);
  console.log(`Report dir: ${REPORT_DIR}`);
}

main();
