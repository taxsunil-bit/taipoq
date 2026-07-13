#!/usr/bin/env node
/**
 * Calm Spatial Learning OS theme token integrity (source-level).
 * Run: node --test tools/tests/calm-spatial-theme.test.mjs
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CSS = readFileSync(path.join(ROOT, "src/styles.css"), "utf8");
const TOKENS = readFileSync(path.join(ROOT, "src/lib/design-tokens.ts"), "utf8");
const BRAND = readFileSync(path.join(ROOT, "src/lib/brand.ts"), "utf8");
const HOME = readFileSync(path.join(ROOT, "src/routes/index.tsx"), "utf8");

test("primary brand token is Calm Spatial #2457D6", () => {
  assert.match(CSS, /--primary:\s*#2457d6/i);
  assert.match(TOKENS, /primary:\s*"#2457D6"/);
});

test("surface canvas and card tokens exist", () => {
  assert.match(CSS, /--surface-canvas:\s*#f7f9fc/i);
  assert.match(CSS, /--surface-card:\s*#ffffff/i);
  assert.match(CSS, /--background:\s*#f7f9fc/i);
});

test("spacing and radius scales are defined", () => {
  assert.match(CSS, /--space-4:\s*16px/);
  assert.match(CSS, /--radius-lg:\s*16px/);
  assert.match(CSS, /--radius-pill:\s*999px/);
});

test("lime micro-accent exists and is not used as homepage section background", () => {
  assert.match(CSS, /--cs-accent-intelligence:\s*#b7e34a/i);
  assert.doesNotMatch(HOME, /bg-\[#B7E34A\]/i);
  assert.doesNotMatch(HOME, /className="[^"]*bg-\[var\(--cs-accent-intelligence\)\][^"]*p-/);
  // Tiny indicator dots are allowed; full-section lime fills are not.
  assert.doesNotMatch(HOME, /bg-\[var\(--cs-accent-intelligence\)\][^\n]{0,40}rounded-\[20px\]/);
});

test("Level 1–3 surface recipes exist in brand.ts", () => {
  assert.match(BRAND, /FOCUS_CARD/);
  assert.match(BRAND, /PRODUCT_CARD/);
  assert.match(BRAND, /UTILITY_ROW/);
});

test("homepage removes duplicate SuggestedNextSteps and keeps one H1", () => {
  assert.doesNotMatch(HOME, /function SuggestedNextSteps/);
  assert.equal((HOME.match(/<h1\b/g) ?? []).length, 1);
  assert.match(HOME, /Prepare Smarter\. Progress Every Day\./);
});

test("secondary teal progress token exists", () => {
  assert.match(CSS, /--cs-secondary:\s*#087f78/i);
  assert.match(TOKENS, /secondary:\s*"#087F78"/);
});
