#!/usr/bin/env node
/**
 * Browser QA for PYQ Guide content release readiness.
 * Requires: npm run build && npm run preview (port 4174)
 * Usage: node tools/release-qa-pyq-guide-content.mjs [baseUrl]
 */

import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:4174";

const CORRECT_ANSWERS = [
  "The conducting examination body's official website",
  "The final answer key",
  "A provisional key may remain open to challenges, while a final key follows the authority's review process",
  "Submit the challenge through the prescribed official process before the deadline",
  "The response recorded for the candidate during the examination",
  "Unverified or memory-based material",
  "Examination body, examination name, year, session or shift, paper or set, and official source",
  "Clearly distinguish the official question source from the independently prepared answer or explanation",
  "The revised or final official answer, with the change recorded",
  "A question accompanied by clear examination details, source status, answer-key status, and explanation provenance",
];

const WRONG_ANSWERS = [
  "A coaching institute blog",
  "A candidate's handwritten notes",
  "A provisional key is always prepared by candidates",
  "Post the objection on social media after the deadline",
  "The candidate's final rank",
  "Officially verified PYQ",
  "Subject name only",
  "Invent an official answer",
  "The earlier provisional answer permanently",
  "A question with no examination identity or source",
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
    const optionBtn = page.getByRole("button", { name: new RegExp(answerText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
    if ((await optionBtn.count()) === 0) {
      fail(`${label}: Q${q + 1} option not found for "${answerText.slice(0, 40)}..."`);
      return null;
    }
    await optionBtn.first().click();
    await page.waitForTimeout(150);
  }

  await page.getByRole("button", { name: "Submit — परिणाम देखें" }).click();
  await page.waitForTimeout(1200);

  const body = await page.locator("body").innerText();
  note(`${label}: submitted`);
  return body;
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
if (!body.includes("PYQ Guide")) fail("/tests missing PYQ Guide subject label");
else note("/tests: PYQ Guide label present");
if (body.includes("PYQ Source and Practice Guide")) fail("/tests still shows old title");
if (body.includes("PYQ Verification and Official Sources Guide")) {
  note("/tests: new paper title visible on listing");
}
await checkOverflow(page, "/tests desktop");

await page.setViewportSize({ width: 390, height: 844 });
await checkOverflow(page, "/tests mobile");

await page.goto(`${BASE}/tests/pyq-practice/`, { waitUntil: "networkidle" });
body = await page.locator("body").innerText();
if (!body.includes("PYQ Verification and Official Sources Guide")) {
  fail("/tests/pyq-practice missing new title");
} else note("/tests/pyq-practice: title present");
if (!body.includes("TAIPOQ Original Guide")) fail("subject page missing TAIPOQ Original Guide badge");
else note("/tests/pyq-practice: TAIPOQ Original Guide badge");

await page.goto(`${BASE}/tests/pyq-practice/pyq-practice-test-paper`, { waitUntil: "networkidle" });
await page.setViewportSize({ width: 1440, height: 900 });
body = await page.locator("body").innerText();
if (!body.includes("10 मिनट") && !body.includes("10 min")) fail("paper page missing 10-minute duration");
else note("paper page: 10-minute duration visible");
if (!body.includes("आरम्भिक")) fail("paper page missing basic level label आरम्भिक");
else note("paper page: basic level आरम्भिक visible");
if (
  !body.includes("does not reproduce or claim") &&
  !body.includes("not copied or officially verified")
) {
  fail("paper page missing PYQ disclaimer in intro");
} else note("paper page: intro disclaimer present");
if (body.includes("15 मिनट")) fail("paper page still shows 15 minutes");
if (body.includes("मध्यम")) fail("paper page still shows moderate मध्यम");
if (body.includes("tagging")) fail("paper page still mentions old tagging framing");
await checkOverflow(page, "paper intro desktop");

await page.setViewportSize({ width: 390, height: 844 });
await checkOverflow(page, "paper intro mobile");

const perfectBody = await selectAnswersByText(page, CORRECT_ANSWERS, "perfect run");
if (perfectBody && !/10\/10|10\s*\/\s*10/.test(perfectBody)) {
  fail(`perfect run score not 10/10`);
} else if (perfectBody) note("perfect run: 10/10 confirmed");

const partialBody = await selectAnswersByText(page, WRONG_ANSWERS, "partial run");
if (partialBody) {
  const scoreMatch = partialBody.match(/(\d+)\/10/);
  const displayed = scoreMatch ? Number(scoreMatch[1]) : null;
  note(`partial run: expected=0 displayed=${displayed}`);
  if (displayed !== 0) fail(`partial run score ${displayed} !== expected 0`);
  else note("partial run: score math verified (0/10)");
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
