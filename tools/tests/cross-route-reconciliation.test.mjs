import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (rel) => readFileSync(path.join(ROOT, rel), "utf8");

const NAV = read("src/components/NavBar.tsx");
const BOTTOM = read("src/components/MobileBottomNav.tsx");
const ABOUT = read("src/routes/about.tsx");
const TERMS = read("src/routes/terms.tsx");
const DISCLAIMER = read("src/routes/disclaimer.tsx");
const CONTACT = read("src/routes/contact.tsx");
const ENGLISH = read("src/routes/english.index.tsx");
const HINDI = read("src/routes/hindi.index.tsx");
const PAPER = read("src/routes/tests.$subject.$paperId.tsx");
const MSL_LESSON = read("src/components/math-speed-lab/MslLessonView.tsx");
const MSL_PRACTICE = read("src/components/math-speed-lab/MslDirectPracticeRunner.tsx");
const T01 = read("src/content/math-speed-lab/techniques/t01-square-ending-5.ts");
const T02 = read("src/content/math-speed-lab/techniques/t02-complements-10n.ts");
const T03 = read("src/content/math-speed-lab/techniques/t03-nearbase-100.ts");
const HOME = read("src/routes/index.tsx");
const PROGRESS_LABELS = read("src/lib/math-speed-lab/progressLabels.ts");

test("desktop nav: no Find Tests duplicate; Local Profile label matches /login", () => {
  assert.doesNotMatch(NAV, /Find Tests/);
  assert.match(NAV, /label: "Local Profile"/);
  assert.match(NAV, /to: "\/login"/);
  assert.doesNotMatch(NAV, /label: "My Progress"/);
  assert.match(NAV, /label: "Library"/);
});

test("five-item mobile bottom nav preserved", () => {
  const labels = [...BOTTOM.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Home", "Tests", "Mission", "Jobs", "Profile"]);
});

test("public legal pages reflect current platform scope", () => {
  assert.match(ABOUT, /government-exam preparation platform/i);
  assert.match(ABOUT, /Verified Opportunities/i);
  assert.match(ABOUT, /Trustworthy Practice/i);
  assert.match(ABOUT, /Guided Daily Preparation/i);
  assert.match(ABOUT, /Math Speed Lab/);
  assert.match(ABOUT, /Daily\s+Mission/);
  assert.match(ABOUT, /Typing practice and Math Speed Lab are preparation tools/i);
  assert.doesNotMatch(ABOUT, /public demo\/prototype/i);
  assert.doesNotMatch(ABOUT, /TAIPOQ v1 is a public demo/i);
  assert.doesNotMatch(ABOUT, /typing practice platform/i);
  assert.doesNotMatch(TERMS, /prototype\/demo/i);
  assert.doesNotMatch(TERMS, /typing practice and learning tool/);
  assert.match(TERMS, /verified vacancy discovery/i);
  assert.match(TERMS, /browser-local profile/i);
  assert.match(DISCLAIMER, /Vacancy information may change/);
  assert.match(DISCLAIMER, /Math Speed Lab methods are educational/);
  assert.match(DISCLAIMER, /Local browser-stored progress/);
  assert.match(CONTACT, /Vacancy correction/);
  assert.match(CONTACT, /Math Speed Lab issue/);
});

test("footer Privacy link targets /privacy", () => {
  assert.match(NAV, /to: "\/privacy"/);
  assert.match(NAV, /label: "Privacy"/);
  assert.doesNotMatch(NAV, /to: "\/privacy-policy", label: "Privacy"/);
});

test("homepage local-profile CTA does not imply cloud account signup", () => {
  assert.match(HOME, /Set up your profile on this device/);
  assert.match(HOME, /save progress in this browser/i);
  assert.doesNotMatch(HOME, /Create a free profile/);
});

test("English and Hindi hubs expose exactly one PageHeader H1 each", () => {
  assert.equal([...ENGLISH.matchAll(/<PageHeader[\s\S]*?\/>/g)].length, 1);
  assert.equal([...ENGLISH.matchAll(/<h1[\s>]/g)].length, 0);
  assert.equal([...HINDI.matchAll(/<PageHeader[\s\S]*?\/>/g)].length, 1);
  assert.equal([...HINDI.matchAll(/<h1[\s>]/g)].length, 0);
  assert.doesNotMatch(ENGLISH, /Typing start karne se pahle/);
});

test("Hindi Coming Soon modes are disabled buttons, not active links", () => {
  assert.match(
    HINDI,
    /m\.active \? \([\s\S]*?<Link to="\/hindi\/practice"[\s\S]*?\) : \(\s*<Button type="button"[^>]*disabled aria-disabled/,
  );
});

test("test paper pages never render raw paper.access enum", () => {
  assert.doesNotMatch(PAPER, /\{paper\.access\}/);
  assert.match(PAPER, /getAccessRequirementLabelHi\(paper\.access\)/);
});

test("MSL public surfaces format progress and hide engineering tokens", () => {
  assert.match(PROGRESS_LABELS, /not_started[\s\S]*Not started/);
  assert.match(MSL_LESSON, /formatMslProgressLabel\(progress\.state\)/);
  assert.match(MSL_LESSON, /sr-only/);
  assert.doesNotMatch(MSL_LESSON, /font-mono[^>]*>\{err\.code\}/);
  assert.match(MSL_PRACTICE, /formatMslProgressLabel\(progress\.state\)/);
  assert.doesNotMatch(MSL_PRACTICE, /later pilot work/);
  assert.doesNotMatch(MSL_PRACTICE, /\{progress\.state\}/);
  assert.doesNotMatch(T01, /locked canary set/i);
  assert.doesNotMatch(T02, /outside this pilot/i);
  assert.doesNotMatch(T02, /locked pilot bases/i);
  assert.doesNotMatch(T03, /in this pilot/i);
});

test("homepage uses truthful Recommended Preparation empty-progress copy", () => {
  assert.match(HOME, /Recommended Preparation/);
  assert.match(HOME, /No saved results yet\. Complete a test to see progress here\./);
  assert.doesNotMatch(HOME, /Continue Preparation/);
});

test("no public V1.0 / typing-first global tagline in shared shell", () => {
  assert.doesNotMatch(NAV, /V1\.0/);
  assert.doesNotMatch(NAV, /Govt Job Computer/);
  assert.doesNotMatch(NAV, /English & Hindi Typing Practice for Job Preparation/);
});

test("scroll-lock ownership remains shared and reconciles on overlay close", () => {
  const lock = read("src/lib/body-scroll-lock.ts");
  const tough = read("src/components/ToughMockChallengePopup.tsx");
  assert.match(lock, /lockCount/);
  assert.match(lock, /reconcileBodyScrollLock/);
  assert.match(lock, /forceReleaseAllBodyScrollLocks/);
  assert.match(tough, /lockBodyScroll/);
  assert.match(tough, /reconcileBodyScrollLock/);
});

test("route shells import PageShell or InfoPage for audited public info routes", () => {
  for (const rel of [
    "src/routes/about.tsx",
    "src/routes/contact.tsx",
    "src/routes/disclaimer.tsx",
    "src/routes/terms.tsx",
    "src/routes/english.index.tsx",
    "src/routes/hindi.index.tsx",
  ]) {
    const src = read(rel);
    assert.ok(
      src.includes("PageShell") || src.includes("InfoPage"),
      `${rel} should use shared shell`,
    );
  }
});
