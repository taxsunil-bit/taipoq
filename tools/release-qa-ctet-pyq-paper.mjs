#!/usr/bin/env node
/**
 * Browser QA for CTET Verified PYQ paper release readiness.
 * Requires: npm run build && npx nitro preview --port 4174 --host 127.0.0.1
 * Usage: node tools/release-qa-ctet-pyq-paper.mjs [baseUrl]
 */

import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:4174";
const CTET_TITLE = "CTET January 2021 Paper I — Child Development and Pedagogy PYQs";

const CORRECT_ANSWERS = [
  "Reflects a gender stereotype",
  "Learners receive ample opportunities to construct knowledge",
  "Functions as scaffolding",
  "Family is a primary agent, while school is a secondary agent",
  "Intelligence has several distinct forms",
  "Conventional",
  "Cultural tools",
  "Schemas",
  "Centration of thought",
  "Development is multidimensional",
];

const PARTIAL_TWO_WRONG = [
  "Challenges a gender stereotype",
  "Competition among learners receives the greatest emphasis",
  ...CORRECT_ANSWERS.slice(2),
];

const EXPLANATION_SPOT_CHECKS = [
  { needle: "gender stereotype", label: "Q1 explanation" },
  { needle: "scaffolding", label: "Q3 explanation" },
  { needle: "conventional level", label: "Q6 explanation" },
  { needle: "Schemas are organised", label: "Q8 explanation" },
];

const results = [];
const consoleErrors = [];

function note(msg) {
  results.push(msg);
  console.log(msg);
}

function fail(msg) {
  results.push(`FAIL: ${msg}`);
  console.error("FAIL:", msg);
  process.exitCode = 1;
}

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  note(`${label}: horizontal overflow=${overflow}`);
  return overflow;
}

async function selectAnswersByText(page, answerTexts, label) {
  await page.goto(`${BASE}/tests/pyq-practice/pyq-practice-test-paper`, {
    waitUntil: "networkidle",
    timeout: 120000,
  });

  const openBtn = page.getByRole("button", { name: /Open Test|आरम्भ/i });
  if (await openBtn.count()) await openBtn.first().click();
  await page.waitForTimeout(800);

  for (let q = 0; q < answerTexts.length; q++) {
    const answerText = answerTexts[q];
    const escaped = answerText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const optionBtn = page.getByRole("button", { name: new RegExp(escaped) });
    if ((await optionBtn.count()) === 0) {
      fail(`${label}: Q${q + 1} option not found for "${answerText.slice(0, 40)}..."`);
      return null;
    }
    await optionBtn.first().click();
    await page.waitForTimeout(150);
  }

  await page.getByRole("button", { name: "Submit — परिणाम देखें" }).click();
  await page.waitForTimeout(1200);

  return page.locator("body").innerText();
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  sessionStorage.setItem("taipoq_welcome_motivation_seen", "1");
  localStorage.setItem(
    "taipoq_cookie_consent",
    JSON.stringify({ essential: true, analytics: false, updatedAt: new Date().toISOString() }),
  );
});
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

await page.goto(`${BASE}/tests`, { waitUntil: "networkidle", timeout: 120000 });
await page.setViewportSize({ width: 1440, height: 900 });
let body = await page.locator("body").innerText();
if (!body.includes("Verified PYQ")) fail("/tests missing Verified PYQ subject label");
else note("/tests: Verified PYQ label present");
if (body.includes("PYQ Verification and Official Sources Guide")) fail("/tests still shows old guide title");
if (body.includes(CTET_TITLE)) note("/tests: CTET title visible");
await checkOverflow(page, "/tests desktop");

await page.setViewportSize({ width: 390, height: 844 });
await checkOverflow(page, "/tests mobile");

await page.goto(`${BASE}/tests/pyq-practice/`, { waitUntil: "networkidle" });
body = await page.locator("body").innerText();
if (!body.includes(CTET_TITLE)) fail("/tests/pyq-practice missing CTET title");
else note("/tests/pyq-practice: CTET title present");
if (!body.includes("Official-Source Verified PYQ")) fail("subject page missing badge");
else note("/tests/pyq-practice: Official-Source Verified PYQ badge");

await page.goto(`${BASE}/tests/pyq-practice/pyq-practice-test-paper`, { waitUntil: "networkidle" });
await page.setViewportSize({ width: 1440, height: 900 });
body = await page.locator("body").innerText();
if (!body.includes("10 मिनट")) fail("paper page missing 10-minute duration");
else note("paper page: 10-minute duration visible");
if (!body.includes("आरम्भिक")) fail("paper page missing basic level");
else note("paper page: आरम्भिक visible");
if (!body.includes("Main Set I")) fail("paper page missing set provenance");
if (!body.includes("not an official CBSE or CTET publication")) fail("paper page missing disclaimer");
else note("paper page: disclaimer present");
if (!/official sources/i.test(body)) fail("paper page missing official sources section");
else note("paper page: official sources section present");
if (!body.includes("View official CTET January 2021 question-paper archive")) {
  fail("paper page missing official question-paper link label");
} else note("paper page: official source links present");
if (body.includes("PYQ Verification and Official Sources Guide")) fail("old guide title still visible");
if (body.includes("identify official websites")) fail("old guide framing still visible");
await checkOverflow(page, "paper intro desktop");

await page.setViewportSize({ width: 390, height: 844 });
await checkOverflow(page, "paper intro mobile");

const perfectBody = await selectAnswersByText(page, CORRECT_ANSWERS, "perfect run");
if (perfectBody && !/10\/10|10\s*\/\s*10/.test(perfectBody)) {
  fail("perfect run score not 10/10");
} else if (perfectBody) note("perfect run: 10/10 confirmed");

for (const check of EXPLANATION_SPOT_CHECKS) {
  if (!perfectBody || !perfectBody.toLowerCase().includes(check.needle.toLowerCase())) {
    fail(`${check.label} not found in review`);
  } else note(`${check.label}: present in review`);
}

const partialBody = await selectAnswersByText(page, PARTIAL_TWO_WRONG, "partial run");
if (partialBody) {
  const scoreMatch = partialBody.match(/(\d+)\/10/);
  const displayed = scoreMatch ? Number(scoreMatch[1]) : null;
  note(`partial run: expected=8 displayed=${displayed}`);
  if (displayed !== 8) fail(`partial run score ${displayed} !== expected 8`);
  else note("partial run: 8/10 score math verified");
}

for (const route of ["/daily-mission", "/study-corner/ssc-cgl-pattern-practice"]) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 120000 });
  await checkOverflow(page, `${route} desktop`);
  note(`${route}: loaded OK`);
}

await ctx.close();
await browser.close();

note(`console errors: ${consoleErrors.length}`);
if (consoleErrors.length) {
  for (const e of consoleErrors.slice(0, 10)) note(`console error: ${e}`);
}

if (process.exitCode) {
  console.log("\nBROWSER QA FAIL");
  process.exit(1);
}
console.log("\nBROWSER QA PASS");
process.exit(0);
