#!/usr/bin/env node
/**
 * Migrate public/data/upcoming-exams.json -> public/data/vacancies.preview.json
 * Preview only — not wired to live /upcoming-exams UI.
 * Run: npm run migrate:vacancies
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "public", "data", "upcoming-exams.json");
const OUTPUT = path.join(ROOT, "public", "data", "vacancies.preview.json");

const STATE_MARKERS = [
  "Uttar Pradesh",
  "Bihar",
  "Jharkhand",
  "Madhya Pradesh",
  "Rajasthan",
  "Haryana",
  "Uttarakhand",
  "Delhi —",
  "Delhi —",
];

const DEFAULT_TRUST_NOTE =
  "पुराने upcoming-exams data से migrated preview; final vacancy publication से पहले official notice verification आवश्यक है.";

function isStateSpecific(department) {
  const d = String(department ?? "");
  if (/^Central\s*[—\-]/i.test(d)) return false;
  return STATE_MARKERS.some((m) => d.includes(m));
}

function parseIsoFromDdMmYyyy(text) {
  const m = String(text).match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return undefined;
  const [, dd, mm, yyyy] = m;
  if (yyyy === "1970") return undefined;
  return `${yyyy}-${mm}-${dd}`;
}

function extractCorrectionDates(notificationWindowText) {
  const range = String(notificationWindowText).match(
    /(\d{2}\/\d{2}\/\d{4})\s*(?:to|से)\s*(\d{2}\/\d{2}\/\d{4})/i,
  );
  if (!range) return {};
  const start = parseIsoFromDdMmYyyy(range[1]);
  const end = parseIsoFromDdMmYyyy(range[2]);
  return {
    ...(start ? { correctionStartDate: start } : {}),
    ...(end ? { correctionEndDate: end } : {}),
  };
}

function inferSourceType(sourceUrl) {
  const url = String(sourceUrl ?? "").toLowerCase();
  if (url.includes("taipoq.com")) return "internal_preparation";
  if (url.includes("employmentnews")) return "employment_news";
  if (url.endsWith(".pdf")) return "official_pdf";
  return "official";
}

function splitOrganisationCategory(department) {
  const d = String(department ?? "").trim();
  const parts = d.split(/\s*[—\-]\s*/);
  if (parts.length >= 2) {
    return {
      category: parts[0].trim(),
      organisation: parts.slice(1).join(" — ").trim() || d,
    };
  }
  return { category: "General", organisation: d || "घोषित नहीं" };
}

function migrateExam(exam) {
  const { category, organisation } = splitOrganisationCategory(exam.department);
  const sourceUrl = String(exam.officialSourceUrl ?? "").trim();
  const sourceType = inferSourceType(sourceUrl);
  const notificationWindowText = String(exam.notificationWindow ?? "घोषित नहीं").trim();
  const examWindowText = String(exam.examWindow ?? "घोषित नहीं").trim();
  const statusLabel = String(exam.status ?? "घोषित नहीं").trim();
  const prepareLink = String(exam.prepareLink ?? "").trim();
  const preparationLinks = prepareLink ? [prepareLink] : [];

  const base = {
    id: String(exam.id).trim(),
    title: String(exam.examName ?? "घोषित नहीं").trim(),
    organisation,
    category,
    status: "verification_pending",
    statusLabel,
    isAllIndia: !isStateSpecific(exam.department),
    isDepartmental: false,
    isPreparationOnly: false,
    vacanciesText: "घोषित नहीं",
    qualificationShort: String(exam.qualification ?? "Official notice देखें").trim(),
    ageLimitShort: "Official notice देखें",
    feeShort: "Official notice देखें",
    selectionProcessShort: "Official notice देखें",
    notificationWindowText,
    examWindowText,
    officialNoticeUrl: sourceType === "internal_preparation" ? undefined : sourceUrl || undefined,
    applyUrl: undefined,
    sourceType,
    sourceUrl: sourceUrl || "घोषित नहीं",
    sourceLabel: String(exam.officialSourceLabel ?? "Official source").trim(),
    sourceCheckedDate: String(exam.lastChecked ?? "2026-06-29").trim(),
    trustNote: DEFAULT_TRUST_NOTE,
    preparationLinks,
    active: Boolean(exam.active),
  };

  if (exam.id === "ssc-cgl-2026") {
    const correctionDates = extractCorrectionDates(notificationWindowText);
    return {
      ...base,
      status: "correction_window",
      statusLabel,
      isPreparationOnly: true,
      correctionStartDate: correctionDates.correctionStartDate ?? "2026-07-01",
      correctionEndDate: correctionDates.correctionEndDate ?? "2026-07-03",
      trustNote:
        "Application closed; correction/preparation tracking only. Not a live apply card.",
      preparationLinks: preparationLinks.length
        ? preparationLinks
        : ["/study-corner/ssc-cgl-pattern-practice"],
    };
  }

  if (!exam.active) {
    return {
      ...base,
      status: "archive",
      trustNote: `${DEFAULT_TRUST_NOTE} Row marked inactive in source upcoming-exams.json.`,
    };
  }

  return base;
}

console.log("TAIPOQ — Migrate upcoming-exams → vacancies.preview.json");
console.log("=".repeat(56));
console.log(`Input:  ${INPUT}`);
console.log(`Output: ${OUTPUT}`);

const raw = JSON.parse(readFileSync(INPUT, "utf8"));
const exams = Array.isArray(raw.exams) ? raw.exams : [];
const items = exams.map(migrateExam);

const payload = {
  lastUpdated: raw.lastUpdated ?? "2026-06-29",
  source: "Migrated preview from public/data/upcoming-exams.json",
  items,
};

writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const activeCount = items.filter((i) => i.active).length;
const sscCgl = items.find((i) => i.id === "ssc-cgl-2026");

console.log(`Migrated: ${items.length} items (${activeCount} active)`);
if (sscCgl) {
  console.log(`SSC CGL 2026: status=${sscCgl.status}, isPreparationOnly=${sscCgl.isPreparationOnly}`);
}
console.log("Done.");
