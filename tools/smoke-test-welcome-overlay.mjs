#!/usr/bin/env node
/**
 * Smoke test for welcome motivation overlay.
 * Run: npm run smoke:welcome
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENT = path.join(ROOT, "src", "components", "WelcomeMotivationOverlay.tsx");
const ROOT_ROUTE = path.join(ROOT, "src", "routes", "__root.tsx");
const IMAGE = path.join(ROOT, "public", "images", "taipoq-welcome-motivation.png");

const errors = [];
const checks = [];

function fail(msg) {
  errors.push(msg);
}

function pass(msg) {
  checks.push(msg);
}

function mustExist(file) {
  if (!existsSync(file)) fail(`Missing file: ${file}`);
  else pass(`File exists: ${path.relative(ROOT, file)}`);
}

function mustInclude(file, needle, label) {
  if (!existsSync(file)) {
    fail(`Missing file: ${file}`);
    return;
  }
  const src = readFileSync(file, "utf8");
  if (!src.includes(needle)) fail(`${path.basename(file)}: missing ${label ?? needle}`);
  else pass(`${path.basename(file)}: ${label ?? needle}`);
}

console.log("TAIPOQ — Welcome Overlay Smoke Test");
console.log("=".repeat(48));

mustExist(COMPONENT);
mustInclude(COMPONENT, "taipoq_welcome_motivation_seen", "sessionStorage key");
mustInclude(COMPONENT, "sessionStorage", "sessionStorage usage");
mustInclude(COMPONENT, "/images/taipoq-welcome-motivation.png", "image path");
mustInclude(COMPONENT, "Opening TAIPOQ in", "countdown text");
mustInclude(COMPONENT, "Continue to TAIPOQ", "continue CTA");
mustInclude(COMPONENT, "Skip", "skip button");
mustInclude(COMPONENT, "Escape", "escape key handler");
mustInclude(COMPONENT, "prefers-reduced-motion", "reduced motion handling");
mustInclude(COMPONENT, "shouldSkipWelcomeRoute", "typing route skip");
mustInclude(COMPONENT, "role=\"dialog\"", "dialog role");
mustInclude(ROOT_ROUTE, "WelcomeMotivationOverlay", "root import");
mustInclude(ROOT_ROUTE, "<WelcomeMotivationOverlay />", "root mount");

if (existsSync(IMAGE)) pass("Welcome image file present at public/images/taipoq-welcome-motivation.png");
else fail("Missing destination image: public/images/taipoq-welcome-motivation.png");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  console.log("\nFAIL");
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
