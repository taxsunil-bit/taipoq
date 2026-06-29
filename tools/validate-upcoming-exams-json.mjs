#!/usr/bin/env node
/**
 * Validate public/data/upcoming-exams.json before deploy.
 * Run: node tools/validate-upcoming-exams-json.mjs
 * Or:  npm run validate:upcoming-exams
 *
 * Policy: official government/commission sources only; unverified exams stay active=false.
 * No auto-scraping — manual JSON edits only.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "public", "data", "upcoming-exams.json");

const REQUIRED_FIELDS = [
  "id",
  "examName",
  "department",
  "qualification",
  "notificationWindow",
  "examWindow",
  "typingRequired",
  "status",
  "officialSourceLabel",
  "officialSourceUrl",
  "prepareLink",
  "preparationFocus",
  "lastChecked",
  "active",
];

const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "boolean") return false;
  return String(value).trim() === "";
}

function parseActive(value) {
  if (typeof value === "boolean") return value;
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "y";
}

function isValidPrepareLink(link) {
  const trimmed = String(link).trim();
  return trimmed.startsWith("/test") || trimmed.startsWith("/study-corner");
}

function isHttpsUrl(url) {
  try {
    const parsed = new URL(String(url).trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

console.log("TAIPOQ — Upcoming Exams JSON Validator");
console.log("=".repeat(48));
console.log(`File: ${DATA_PATH}`);
console.log("");

let rawText;
try {
  rawText = readFileSync(DATA_PATH, "utf8");
} catch (err) {
  error(`Cannot read file: ${err instanceof Error ? err.message : String(err)}`);
  printReport({ total: 0, active: 0, inactive: 0 });
  process.exit(1);
}

let data;
try {
  data = JSON.parse(rawText);
} catch (err) {
  error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  printReport({ total: 0, active: 0, inactive: 0 });
  process.exit(1);
}

if (!data || typeof data !== "object" || Array.isArray(data)) {
  error("Top-level JSON must be an object with lastUpdated and exams.");
}

if (isBlank(data?.lastUpdated)) {
  error("Missing or empty top-level field: lastUpdated");
}

if (!Array.isArray(data?.exams)) {
  error("Missing or invalid top-level field: exams (must be an array)");
}

const exams = Array.isArray(data?.exams) ? data.exams : [];
const seenIds = new Map();
let activeCount = 0;
let inactiveCount = 0;

exams.forEach((row, index) => {
  const rowLabel = `Row ${index + 1}`;

  if (!row || typeof row !== "object" || Array.isArray(row)) {
    error(`${rowLabel}: exam entry must be an object`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in row)) {
      error(`${rowLabel} (id=${row.id ?? "?"}): missing required field "${field}"`);
      continue;
    }
    if (field === "active") {
      if (typeof row.active !== "boolean" && isBlank(row.active)) {
        error(`${rowLabel} (id=${row.id ?? "?"}): missing required field "active"`);
      }
      continue;
    }
    if (isBlank(row[field])) {
      error(`${rowLabel} (id=${row.id ?? "?"}): missing or empty required field "${field}"`);
    }
  }

  const id = String(row.id ?? "").trim();
  if (id) {
    if (seenIds.has(id)) {
      error(`Duplicate id "${id}" (rows ${seenIds.get(id)} and ${index + 1})`);
    } else {
      seenIds.set(id, index + 1);
    }
  }

  const active = parseActive(row.active);
  if (active) activeCount += 1;
  else inactiveCount += 1;

  const officialSourceUrl = String(row.officialSourceUrl ?? "").trim();
  const status = String(row.status ?? "").trim();
  const lastChecked = String(row.lastChecked ?? "").trim();
  const prepareLink = String(row.prepareLink ?? "").trim();

  if (isBlank(lastChecked)) {
    warn(`${rowLabel} (id=${id || "?"}): lastChecked is blank`);
  }

  if (!isHttpsUrl(officialSourceUrl)) {
    warn(`${rowLabel} (id=${id || "?"}): officialSourceUrl is not https (${officialSourceUrl || "(blank)"})`);
  }

  if (!isValidPrepareLink(prepareLink)) {
    warn(
      `${rowLabel} (id=${id || "?"}): prepareLink should start with /test or /study-corner (${prepareLink || "(blank)"})`,
    );
  }

  if (active) {
    if (isBlank(officialSourceUrl)) {
      warn(`${rowLabel} (id=${id || "?"}): active=true but officialSourceUrl is blank`);
    }
    if (/verification pending/i.test(status)) {
      warn(`${rowLabel} (id=${id || "?"}): active=true but status contains "verification pending"`);
    }
    if (status === "Official website check करें") {
      warn(
        `${rowLabel} (id=${id || "?"}): active=true but status is generic "Official website check करें" — use a specific verified status`,
      );
    }
    const notificationWindow = String(row.notificationWindow ?? "").trim();
    if (notificationWindow === "Official notification देखें") {
      warn(
        `${rowLabel} (id=${id || "?"}): active=true but notificationWindow is vague "Official notification देखें" — add verified dates or घोषित नहीं`,
      );
    }
  }
});

printReport({
  lastUpdated: data?.lastUpdated,
  total: exams.length,
  active: activeCount,
  inactive: inactiveCount,
});

if (errors.length > 0) {
  process.exit(1);
}

console.log("");
console.log("Result: PASS (warnings only — safe to deploy after review)");
process.exit(0);

function printReport({ lastUpdated, total, active, inactive }) {
  console.log("Summary");
  console.log("-".repeat(48));
  if (lastUpdated) console.log(`lastUpdated: ${lastUpdated}`);
  console.log(`Total exams:    ${total}`);
  console.log(`Active (true):  ${active}`);
  console.log(`Inactive (false): ${inactive}`);
  console.log("");

  if (errors.length) {
    console.log(`ERRORS (${errors.length}) — fix before deploy:`);
    errors.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    console.log("");
  } else {
    console.log("ERRORS: none");
    console.log("");
  }

  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length}) — review recommended:`);
    warnings.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    console.log("");
  } else {
    console.log("WARNINGS: none");
    console.log("");
  }

  if (errors.length > 0) {
    console.log("Result: FAIL — validation blocked (exit code 1)");
  }
}
