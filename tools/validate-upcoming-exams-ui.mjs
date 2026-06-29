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
  ];

  for (const { label, re } of forbiddenUiPatterns) {
    if (re.test(src)) fail(`Source regression: ${label}`);
  }

  const requiredPatterns = [
    { label: "Open Government Jobs heading", re: /Open Government Jobs/ },
    { label: "SectorChipBar", re: /function SectorChipBar/ },
    { label: "VerifiedVacancyCard list", re: /VerifiedVacancyCard/ },
    { label: "filterVerifiedPublicVacanciesBySector", re: /filterVerifiedPublicVacanciesBySector/ },
    { label: "DRDO sector chip", re: /DRDO \/ R&D/ },
    { label: "DSSSB sector chip", re: /DSSSB \/ Delhi Govt/ },
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
