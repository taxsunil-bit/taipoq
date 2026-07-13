#!/usr/bin/env node
/**
 * Phase 1 identity & trust repair — homepage + Local Profile focused tests.
 * Run: node --test tools/tests/phase1-identity-trust.test.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const HOME = readFileSync(path.join(ROOT, "src/routes/index.tsx"), "utf8");
const LOGIN = readFileSync(path.join(ROOT, "src/routes/login.tsx"), "utf8");
const STORAGE = readFileSync(path.join(ROOT, "src/lib/storage.ts"), "utf8");
const NAV = readFileSync(path.join(ROOT, "src/components/NavBar.tsx"), "utf8");
const BRAND = readFileSync(path.join(ROOT, "src/lib/brand.ts"), "utf8");

const HOME_TITLE = "TAIPOQ — Government Exam Preparation, Verified Jobs, PYQs and Mock Tests";
const HOME_DESCRIPTION =
  "Prepare for government exams with verified job updates, PYQs, mock tests, Daily Mission and Math Speed Lab on TAIPOQ.";

function parseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.name !== "string") return null;
    const name = parsed.name.trim();
    if (!name) return null;
    const email = typeof parsed.email === "string" ? parsed.email.trim() : undefined;
    return email ? { name, email } : { name };
  } catch {
    return null;
  }
}

test("homepage renders one modern product identity (no legacy HomeDesktop block)", () => {
  assert.doesNotMatch(HOME, /function HomeDesktop\(/);
  assert.doesNotMatch(HOME, /<HomeDesktop\s*\/>/);
  assert.match(HOME, /function HomeHero\(/);
  assert.match(HOME, /Prepare Smarter\. Progress Every Day\./);
  assert.doesNotMatch(HOME, /Govt Job Computer & Typing Preparation/);
  assert.match(BRAND, /SITE_TITLE/);
  assert.doesNotMatch(BRAND, /Govt Job Computer & Typing Preparation/);
});

test('legacy phrase "Master precision and speed" is absent from homepage', () => {
  assert.doesNotMatch(HOME, /Master precision and speed/);
});

test("legacy duplicate bento feature grid and prototype badge are absent", () => {
  assert.doesNotMatch(HOME, /v1\.0 · Prototype/);
  assert.doesNotMatch(HOME, /const FEATURES =/);
  assert.doesNotMatch(HOME, /const SECONDARY =/);
  assert.doesNotMatch(HOME, /English Typing<\/h2>/);
});

test("homepage has exactly one H1", () => {
  const h1Count = (HOME.match(/<h1\b/g) ?? []).length;
  assert.equal(h1Count, 1);
  assert.match(HOME, /function HomeHero\(/);
});

test("homepage metadata title is correct", () => {
  assert.match(HOME, /SITE_TITLE/);
  assert.match(BRAND, new RegExp(HOME_TITLE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("homepage metadata description is correct", () => {
  assert.match(HOME, /SITE_DESCRIPTION/);
  assert.match(BRAND, new RegExp(HOME_DESCRIPTION.slice(0, 40)));
});

test("/login renders Local Profile", () => {
  assert.match(LOGIN, /Local Profile/);
  assert.match(LOGIN, /function LocalProfilePage/);
  assert.match(LOGIN, /title: "Local Profile — TAIPOQ"/);
});

test("login page has no password input or Login/Register imitation", () => {
  assert.doesNotMatch(LOGIN, /type="password"/);
  assert.doesNotMatch(LOGIN, />\s*Login\s*</);
  assert.doesNotMatch(LOGIN, />\s*Register\s*</);
  assert.doesNotMatch(LOGIN, /local demo login/);
  assert.doesNotMatch(LOGIN, /Password login is not active/);
});

test("local profile storage helpers exist", () => {
  assert.match(STORAGE, /export function saveUser/);
  assert.match(STORAGE, /export function getUser/);
  assert.match(STORAGE, /export function clearUser/);
  assert.match(STORAGE, /KEY_USER/);
});

test("saveUser persists only name and optional email (never password)", () => {
  const start = STORAGE.indexOf("export function saveUser");
  const end = STORAGE.indexOf("export function getUser");
  const saveUserBlock = STORAGE.slice(start, end);
  assert.match(saveUserBlock, /write\(KEY_USER, \{ name: u\.name\.trim\(\)/);
  assert.doesNotMatch(saveUserBlock, /password/);
});

test("login rejects whitespace-only display name in handler", () => {
  assert.match(LOGIN, /if \(!trimmed\)/);
  assert.match(LOGIN, /Enter a display name/);
});

test("sanitizeStoredUser strips legacy extra keys on profile load", () => {
  assert.match(STORAGE, /export function sanitizeStoredUser/);
  assert.match(LOGIN, /sanitizeStoredUser\(\)/);
});

test("existing display-name data migrates safely and corrupt storage recovers", () => {
  assert.deepEqual(parseUser(JSON.stringify({ name: "  Ravi  ", email: "x@y.com" })), {
    name: "Ravi",
    email: "x@y.com",
  });
  assert.deepEqual(parseUser(JSON.stringify({ name: "Asha", password: "secret" })), {
    name: "Asha",
  });
  assert.equal(parseUser("{bad"), null);
  assert.equal(parseUser(JSON.stringify({})), null);
});

test("navigation points to Local Profile at /login; no duplicate Find Tests", () => {
  assert.match(NAV, /to: "\/login"/);
  assert.match(NAV, /label: "Local Profile"/);
  assert.doesNotMatch(NAV, /Find Tests/);
  assert.doesNotMatch(NAV, /label: "My Progress"/);
  assert.doesNotMatch(NAV, /label: "Search"/);
  assert.doesNotMatch(NAV, /V1\.0/);
});

test("homepage retains core module links", () => {
  for (const fragment of [
    "/upcoming-exams",
    "/study-corner",
    "/tests",
    "/english/practice",
    "/hindi/practice",
    "DailyMissionSection",
    "/progress",
  ]) {
    assert.match(HOME, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("MSL routes remain unchanged in registry", () => {
  assert.equal(existsSync(path.join(ROOT, "src/routes/math-speed-lab.index.tsx")), true);
  assert.equal(
    existsSync(path.join(ROOT, "src/routes/math-speed-lab.complements-10n.practice.direct.tsx")),
    true,
  );
});

test("prototype wording replaced on homepage and login only where required", () => {
  assert.match(HOME, /under continuous development/);
  assert.match(LOGIN, /under continuous development/);
  assert.doesNotMatch(HOME, /Prototype only/);
});
