#!/usr/bin/env node
/**
 * UI regression guard for /upcoming-exams open jobs page.
 * Run: npm run validate:upcoming-exams-ui
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ROUTE_PATH = path.join(ROOT, "src", "routes", "upcoming-exams.tsx");

const errors = [];

function fail(msg) {
  errors.push(msg);
}

console.log("TAIPOQ — Upcoming Exams UI Validator");
console.log("=".repeat(48));
console.log(`File: ${ROUTE_PATH}`);
console.log("");

if (!existsSync(ROUTE_PATH)) {
  fail("upcoming-exams.tsx not found");
} else {
  const src = readFileSync(ROUTE_PATH, "utf8");

  const forbiddenUiPatterns = [
    { label: "Exam Watch section", re: /ExamWatchSection|Exam Watch \/ आने वाली/ },
    { label: "loadUpcomingExams on page", re: /loadUpcomingExams/ },
    { label: "ExamCard component", re: /function ExamCard/ },
    { label: "Apply button label", re: />\s*Apply\s*</ },
    { label: "Official calendar watchlist hint", re: /Official calendar देखें/ },
    { label: "Verified vacancies feature flag gate", re: /isVerifiedVacanciesEnabled|VITE_SHOW_VERIFIED_VACANCIES/ },
    {
      label: "Verified jobs disabled warning",
      re: /Verified open jobs are not enabled in this build/,
    },
    { label: "Sector jump scroll chips", re: /function SectorJumpChipBar|scrollIntoView/ },
    { label: "Always-visible grouped sector sections", re: /function SectorJobSection|open-jobs-by-sector/ },
    { label: "Misleading Open verified summary", re: /Open verified:/ },
    { label: "Public preview loader (must load live only)", re: /loadVacanciesPreview/ },
    { label: "Public preview query switch", re: /useVacancyPreviewMode|[?&]preview=1|get\(["']preview["']\)/ },
  ];

  for (const { label, re } of forbiddenUiPatterns) {
    if (re.test(src)) fail(`Source regression: ${label}`);
  }

  const requiredPatterns = [
    { label: "Open Government Jobs heading", re: /Open Government Jobs/ },
    { label: "Sector filter bar", re: /function SectorFilterBar/ },
    { label: "Honest open listings summary", re: /Open listings:/ },
    { label: "Vacancy data updated label", re: /Vacancy data updated:/ },
    { label: "selectedSector state", re: /selectedSector/ },
    { label: "filteredJobs list", re: /filteredJobs/ },
    { label: "VerifiedVacancyCard list", re: /VerifiedVacancyCard/ },
    { label: "filterVerifiedPublicVacanciesBySector", re: /filterVerifiedPublicVacanciesBySector/ },
    { label: "computePublicVacancySummary", re: /computePublicVacancySummary/ },
    { label: "loadVacanciesLive (live-only public loader)", re: /loadVacanciesLive/ },
    { label: "Empty filter message", re: /No currently open listings match this filter/ },
    { label: "Judicial Exams chip", re: /Judicial Exams/ },
    { label: "Apprenticeships chip", re: /Apprenticeships/ },
    { label: "Law / Legal chip", re: /Law \/ Legal/ },
    { label: "Contract / Local chip", re: /Contract \/ Local/ },
    { label: "More filters control", re: /More filters/ },
    { label: "aria-pressed on filter chips", re: /aria-pressed/ },
  ];

  for (const { label, re } of requiredPatterns) {
    if (!re.test(src)) fail(`Missing required UI element: ${label}`);
  }
}

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  errors.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
  process.exit(1);
}

console.log("Open jobs page checks: PASS");
console.log("");
console.log("Result: PASS");
process.exit(0);
