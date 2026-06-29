#!/usr/bin/env node
/**
 * UI regression guard for /upcoming-exams watchlist rendering.
 * Run: npm run validate:upcoming-exams-ui
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ROUTE_PATH = path.join(ROOT, "src", "routes", "upcoming-exams.tsx");

const VAGUE_NOTIFICATION = "Official notification देखें";
const VAGUE_STATUS = "Official website check करें";
const OFFICIAL_CALENDAR_HINT = "Official calendar देखें";

const PLACEHOLDER_FRAGMENTS = [
  VAGUE_NOTIFICATION,
  VAGUE_STATUS,
  OFFICIAL_CALENDAR_HINT,
  "तिथि घोषित नहीं",
  "घोषित नहीं",
];

function isPlaceholderText(value, options = {}) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_FRAGMENTS.some((fragment) => trimmed === fragment || trimmed.includes(fragment))) {
    return true;
  }
  if (options.treatCalendarHintAsPlaceholder && trimmed === OFFICIAL_CALENDAR_HINT) {
    return true;
  }
  return false;
}

function hasExactDateDisplay(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return false;
  if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(trimmed)) return true;
  if (/\d{4}-\d{2}-\d{2}/.test(trimmed)) return true;
  return false;
}

function shouldRenderDetailValue(value, options = {}) {
  if (isPlaceholderText(value, { treatCalendarHintAsPlaceholder: options.requireExactDate })) {
    return false;
  }
  if (options.requireExactDate && !hasExactDateDisplay(value)) return false;
  return Boolean(String(value ?? "").trim());
}

const errors = [];

function fail(msg) {
  errors.push(msg);
}

function assertHelper(name, condition) {
  if (!condition) fail(`Helper regression: ${name}`);
}

console.log("TAIPOQ — Upcoming Exams UI Validator");
console.log("=".repeat(48));
console.log(`File: ${ROUTE_PATH}`);
console.log("");

assertHelper("placeholder notification", isPlaceholderText(VAGUE_NOTIFICATION));
assertHelper("placeholder status", isPlaceholderText(VAGUE_STATUS));
assertHelper("placeholder tithi", isPlaceholderText("तिथि घोषित नहीं"));
assertHelper("calendar hint as date row blocked", !shouldRenderDetailValue(OFFICIAL_CALENDAR_HINT, { requireExactDate: true }));
assertHelper("exact date allowed", shouldRenderDetailValue("21/05/2026 से 22/06/2026", { requireExactDate: true }));
assertHelper("vague notification not exact date", !hasExactDateDisplay(VAGUE_NOTIFICATION));
assertHelper("fake tithi not exact date", !hasExactDateDisplay("तिथि घोषित नहीं"));

if (!existsSync(ROUTE_PATH)) {
  fail("upcoming-exams.tsx not found");
} else {
  const src = readFileSync(ROUTE_PATH, "utf8");

  const forbiddenUiPatterns = [
    { label: "fake notificationLine assignment", re: /notificationLine:\s*vague\s*\?\s*["']तिथि घोषित नहीं/ },
    { label: "fake lastDateLine assignment", re: /lastDateLine:\s*vague\s*\?\s*["']तिथि घोषित नहीं/ },
    { label: "Apply button label in ExamCard", re: />\s*Apply\s*</ },
    { label: "Apply buttonVariants on upcoming-exams", re: /Apply[\s\S]{0,40}buttonVariants/ },
  ];

  for (const { label, re } of forbiddenUiPatterns) {
    if (re.test(src)) fail(`Source regression: ${label}`);
  }

  const requiredPatterns = [
    { label: "compactWatchlist flag", re: /compactWatchlist/ },
    { label: "DetailRow requireExactDate", re: /requireExactDate/ },
    { label: "watchlist regression comment", re: /Do not render placeholder date rows for vague watchlist cards/ },
    { label: "isPlaceholderText helper", re: /function isPlaceholderText/ },
  ];

  for (const { label, re } of requiredPatterns) {
    if (!re.test(src)) fail(`Missing required UI guard: ${label}`);
  }

  const tithiMatches = [...src.matchAll(/तिथि घोषित नहीं/g)];
  const allowedTithiContexts = src.match(/PLACEHOLDER_FRAGMENTS|isPlaceholderText/g)?.length ?? 0;
  if (tithiMatches.length > 1) {
    fail(`"तिथि घोषित नहीं" appears ${tithiMatches.length} times — should only exist in placeholder detection`);
  }
}

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  errors.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
  process.exit(1);
}

console.log("Helper checks: PASS");
console.log("Source grep checks: PASS");
console.log("");
console.log("Result: PASS");
process.exit(0);
