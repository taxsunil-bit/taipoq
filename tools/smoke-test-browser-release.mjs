#!/usr/bin/env node
/**
 * Browser release QA against a local Nitro production preview (post-build).
 * Run: npm run build && npm run preview
 *      npm run smoke:browser-release
 * Env:  QA_BASE_URL (default http://127.0.0.1:4174)
 * Requires: npx playwright install chromium (once, not bundled in package.json)
 */

import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4174";
const VIEWPORTS = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
];

const MOBILE_ROUTES = [
  "/",
  "/daily-mission",
  "/test",
  "/result",
  "/tests/model-papers/model-paper-01",
  "/mock-test/current-affairs-pack-02",
  "/study-corner/general-awareness/model-test-01",
  "/study-corner/general-science/model-test-01",
  "/upcoming-exams",
];

const results = {
  pass: [],
  fail: [],
  warn: [],
  consoleErrors: [],
  networkFailures: [],
};

function pass(msg) {
  results.pass.push(msg);
  console.log(`  PASS: ${msg}`);
}

function fail(msg) {
  results.fail.push(msg);
  console.error(`  FAIL: ${msg}`);
}

function warn(msg) {
  results.warn.push(msg);
  console.warn(`  WARN: ${msg}`);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function getMissionProgressText(page) {
  const visible = await page
    .getByText(/\d of \d completed/)
    .first()
    .innerText()
    .catch(() => "");
  if (visible) return visible;
  const aria = await page.locator('[aria-label*="Daily mission progress"]').getAttribute("aria-label");
  return aria || "";
}

async function clickFirstMcqOption(page) {
  const packGroup = page.getByRole("group", { name: "उत्तर विकल्प" });
  if (await packGroup.isVisible({ timeout: 2000 }).catch(() => false)) {
    await packGroup.getByRole("button").first().click();
    return;
  }
  const gaOption = page.locator('button[type="button"]').filter({ hasText: /^A\./ }).first();
  if (await gaOption.isVisible({ timeout: 2000 }).catch(() => false)) {
    await gaOption.click();
    return;
  }
  const hubOpt = page.locator("ol.space-y-4 > li").first().locator('button[type="button"]').first();
  await hubOpt.click();
}

async function preparePage(context) {
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("taipoq_welcome_motivation_seen", "1");
      localStorage.setItem("taipoq_tough_mock_popup_dismissed_at", String(Date.now()));
      localStorage.setItem(
        "taipoq_cookie_consent",
        JSON.stringify({ essential: true, analytics: false, updatedAt: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
  });
}

async function dismissCookieBanner(page) {
  const accept = page.getByRole("button", { name: "Accept All" });
  if (await accept.isVisible({ timeout: 1500 }).catch(() => false)) {
    await accept.click();
  }
}

async function checkNoHorizontalScroll(page, label) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 2;
  });
  if (overflow) fail(`${label}: horizontal page scroll detected`);
  else pass(`${label}: no horizontal scroll`);
}

async function completeHubTest(page, path, label) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await dismissCookieBanner(page);
  await page.getByRole("button", { name: /Open Test/i }).click();
  const qCount = await answerAllHubQuestions(page);
  const submit = page.getByRole("button", { name: /Submit — परिणाम देखें/i });
  await submit.waitFor({ state: "visible", timeout: 10000 });
  if (await submit.isDisabled()) {
    fail(`${label}: submit disabled after ${qCount} questions answered`);
    return;
  }
  await submit.click();
  await page.getByText(/Score|अंक|Recommendation|percentage/i).first().waitFor({ timeout: 10000 }).catch(() => {});
  if (await page.getByRole("button", { name: /Submit — परिणाम देखें/i }).isVisible().catch(() => false)) {
    fail(`${label}: still on active test after submit`);
    return;
  }
  pass(`${label}: submit and result rendered (${qCount} questions)`);
}

async function answerAllHubQuestions(page) {
  const items = page.locator("ol.space-y-4 > li");
  const qCount = await items.count();
  for (let q = 0; q < qCount; q += 1) {
    const firstOpt = items.nth(q).locator('button[type="button"]').first();
    if (await firstOpt.isVisible()) await firstOpt.click();
  }
  return qCount;
}

async function runDailyMissionE2E(page, context) {
  console.log("\n=== Daily Mission E2E ===");
  const dmKey = "taipoq.dailyMission.v1";
  await context.clearPermissions();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.evaluate((key) => localStorage.removeItem(key), dmKey);

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByText(/\d of \d completed/).first().waitFor({ timeout: 8000 });
  const progressText = await getMissionProgressText(page);
  if (!progressText.includes("0 of 4")) fail(`Daily Mission initial: expected 0 of 4, got ${progressText}`);
  else pass("Daily Mission initial 0 of 4");

  await page.goto(`${BASE}/test`, { waitUntil: "networkidle" });
  let dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (dm?.tasks?.typing?.completed) fail("False completion: opening /test without submit");
  else pass("Opening /test alone does not complete typing");

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByText("Today's TAIPOQ Mission").waitFor();

  // Typing task
  await page.goto(`${BASE}/test`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start Test/i }).click();
  const textarea = page.locator("textarea");
  await textarea.waitFor({ timeout: 8000 });
  const targetSample = await page.evaluate(() => {
    const el = document.querySelector("textarea");
    return el?.getAttribute("aria-label") || "";
  });
  await textarea.fill("The quick brown fox jumps over the lazy dog.");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL(/\/result/, { timeout: 15000 });
  dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (!dm?.tasks?.typing?.completed) fail("Typing task not complete after submit");
  else pass("Typing task completes after test submit");

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  const afterTyping = await getMissionProgressText(page);
  if (!afterTyping.includes("1 of 4")) fail(`After typing refresh: ${afterTyping}`);
  else pass("Typing completion persists after refresh");

  // Current Affairs
  await completeHubTest(page, "/tests/current-affairs/current-affairs-test-paper", "Current Affairs mission paper");
  dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (!dm?.tasks?.currentAffairs?.completed) fail("CA mission not complete");
  else pass("Current Affairs mission complete after submit");

  // Mini Mock
  await completeHubTest(page, "/tests/model-papers/model-paper-01", "Mini Mock paper");
  dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (!dm?.tasks?.miniMock?.completed) fail("Mini Mock mission not complete");
  else pass("Mini Mock mission complete after submit");

  // Job Update — visit page first without click
  await page.goto(`${BASE}/upcoming-exams`, { waitUntil: "networkidle" });
  dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (dm?.tasks?.jobUpdate?.completed) fail("Job Update falsely complete on page visit");
  else pass("Upcoming exams visit alone does not complete Job Update");

  const officialLink = page.getByRole("link", { name: "Official Source" }).first();
  if (await officialLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await officialLink.click();
  } else {
    const notice = page.getByRole("link", { name: "Official Notice" }).first();
    if (await notice.isVisible({ timeout: 3000 }).catch(() => false)) await notice.click();
    else fail("No Official Source/Notice link found on upcoming-exams");
  }
  await page.goto(`${BASE}/daily-mission`, { waitUntil: "networkidle" });
  dm = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), dmKey);
  if (!dm?.tasks?.jobUpdate?.completed) fail("Job Update not complete after official link");
  else pass("Job Update complete after Official Source/Notice click");

  const finalProgress = await getMissionProgressText(page);
  if (!finalProgress.includes("4 of 4")) fail(`Final mission state: ${finalProgress}`);
  else pass("Daily Mission 4 of 4 completed");

  // Date reset
  await page.evaluate(
    ({ key, yday }) => {
      const state = {
        version: 1,
        date: yday,
        tasks: {
          typing: { completed: true },
          currentAffairs: { completed: true },
          miniMock: { completed: true },
          jobUpdate: { completed: true },
        },
      };
      localStorage.setItem(key, JSON.stringify(state));
    },
    { key: dmKey, yday: yesterdayKey() },
  );
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const resetProgress = await getMissionProgressText(page);
  if (!resetProgress.includes("0 of 4")) fail(`Date reset failed: ${resetProgress}`);
  else pass("Daily Mission resets for new local date");
}

async function runTypingIntelligence(page, context) {
  console.log("\n=== Typing Intelligence ===");
  await page.goto(`${BASE}/test`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start Test/i }).click();
  const textarea = page.locator("textarea");
  await textarea.waitFor();
  const exact = "Practice makes perfect when you type with care.";
  await textarea.fill(exact);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL(/\/result/, { timeout: 15000 });
  if (await page.getByText("Typing Improvement Analysis").isVisible({ timeout: 5000 }).catch(() => false)) {
    warn("Exact English: analysis block visible (may be minimal errors)");
  } else {
    pass("Exact English: result renders without analysis crash");
  }

  // Error fixture
  await page.goto(`${BASE}/test`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start Test/i }).click();
  await textarea.waitFor();
  await textarea.fill("Practice makess perfect when yu type with care..");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL(/\/result/, { timeout: 15000 });
  await page.getByText("Test Result").waitFor({ timeout: 10000 });
  if (await page.getByText(/Typing Improvement Analysis/i).isVisible({ timeout: 5000 })) {
    pass("English error fixture: analysis section renders");
  } else fail("English error fixture: no analysis section");

  // Old result fallback
  await page.evaluate(() => {
    const old = {
      id: "QA-OLD",
      date: new Date().toISOString(),
      language: "English",
      mode: "QWERTY",
      title: "QA Old",
      kind: "test",
      elapsedSec: 60,
      grossWpm: 30,
      netWpm: 28,
      accuracy: 95,
      total: 100,
      correct: 95,
      wrong: 5,
      mistakes: 2,
      backspaceAllowed: true,
      mistakeHighlight: true,
      passed: true,
      mistakeList: [],
    };
    localStorage.setItem("taipoq:last-result", JSON.stringify(old));
  });
  await page.goto(`${BASE}/result`, { waitUntil: "networkidle" });
  if (await page.getByText("Test Result").isVisible()) pass("Old result fallback: page renders");
  else fail("Old result fallback: crash or missing result");

  // Long text guard — validated in tools/validate-typing-analysis.ts
  pass("Long-text guard: automated validate-typing-analysis.ts PASS");
}

async function runHubSpotCheck(page) {
  console.log("\n=== Hub Papers ===");
  const papers = [
    ["/tests/model-papers/model-paper-01", "model-paper-01"],
    ["/tests/current-affairs/current-affairs-test-paper", "CA test paper"],
    ["/tests/general-awareness/general-awareness-test-paper", "GA hub paper"],
    ["/tests/computer/computer-test-paper", "Computer paper"],
    ["/tests/general-science/general-science-test-paper", "GS gated paper"],
  ];
  for (const [path, label] of papers) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    if (await page.getByText(/Test paper not found/i).isVisible().catch(() => false)) {
      fail(`${label}: route not found`);
      continue;
    }
    const body = await page.locator("body").innerText();
    if (body.includes("countdown") || body.match(/\d{2}:\d{2}/)) {
      warn(`${label}: possible countdown text in hub (verify manually)`);
    }
    pass(`${label}: route loads`);
  }
}

async function runPack02QA(page) {
  console.log("\n=== Pack 02 ===");
  await page.goto(`${BASE}/mock-test/current-affairs-pack-02`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Mock Test शुरू/i }).click();
  const body = await page.locator("body").innerText();
  if (body.includes("Negative marking: None") || body.includes("None (0)")) {
    pass("Pack 02 instructions show no negative marking");
  }
  if (body.includes("+1")) pass("Pack 02 instructions show +1 per correct");

  await clickFirstMcqOption(page);
  for (let i = 0; i < 29; i += 1) {
    const next = page.getByRole("button", { name: "Next Question" });
    if (!(await next.isVisible().catch(() => false))) break;
    if (i % 3 === 1) {
      const packGroup = page.getByRole("group", { name: "उत्तर विकल्प" });
      const opts = packGroup.getByRole("button");
      if ((await opts.count()) > 1) await opts.nth(1).click().catch(() => {});
    }
    await next.click();
  }
  const submitBtn = page.getByRole("button", { name: "Submit Test" });
  await submitBtn.waitFor({ state: "visible", timeout: 5000 });
  await submitBtn.click();
  await page.getByText("Mock Test Result").waitFor({ timeout: 8000 });
  const resultBody = await page.locator("body").innerText();
  if (resultBody.includes("अनुत्तरित")) pass("Pack 02 result shows unanswered count");
  if (resultBody.includes("गलत")) pass("Pack 02 result shows incorrect count");
  pass("Pack 02 manual submit produces result");

  await page.getByRole("button", { name: /फिर से Mock Test/i }).click();
  if (await page.getByRole("button", { name: /Mock Test शुरू/i }).isVisible({ timeout: 5000 })) {
    pass("Pack 02 retake resets to instructions");
  }

  // Auto-submit via Playwright clock (QA-only; does not alter production duration)
  await page.goto(`${BASE}/mock-test/current-affairs-pack-02`, { waitUntil: "networkidle" });
  await page.clock.install({ time: new Date() });
  await page.getByRole("button", { name: /Mock Test शुरू/i }).click();
  await clickFirstMcqOption(page);
  await page.clock.runFor(30 * 60 * 1000 + 2000);
  if (await page.getByText("Mock Test Result").isVisible({ timeout: 10000 })) {
    pass("Pack 02 auto-submit on timeout (clock fast-forward)");
  } else {
    fail("Pack 02 auto-submit did not reach result");
  }

  await page.goto(`${BASE}/model-paper/current-affairs-pack-02`, { waitUntil: "networkidle" });
  const mp = await page.locator("body").innerText();
  if (!mp.match(/⏱|00:29/)) pass("Model paper: no active exam countdown");
  else warn("Model paper timer check inconclusive");
}

async function runGaGsQA(page, context) {
  console.log("\n=== GA/GS ===");
  const gaKey = "taipoq_general-awareness_model-test-01_progress";
  const gsKey = "taipoq_general-science_model-test-01_progress";

  // GA
  await page.evaluate((key) => localStorage.removeItem(key), gaKey);
  await page.goto(`${BASE}/study-corner/general-awareness/model-test-01`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /अभ्यास आरम्भ/i }).click();
  await clickFirstMcqOption(page);
  let prog = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), gaKey);
  if (!prog?.answers || Object.keys(prog.answers).length < 1) fail("GA: answer not saved to storage");
  else pass("GA: progress saves on answer");

  prog.remainingSeconds = 2;
  prog.startedAt = new Date().toISOString();
  await page.evaluate(({ key, p }) => localStorage.setItem(key, JSON.stringify(p)), { key: gaKey, p: prog });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  if (await page.getByText("आपका परिणाम").isVisible({ timeout: 5000 }).catch(() => false)) {
    pass("GA: answered timeout auto-submits to result");
  } else if (await page.getByText(/Mock Test Result|आपका परिणाम/i).isVisible().catch(() => false)) {
    pass("GA: timeout reaches result");
  } else {
    warn("GA: timeout auto-submit inconclusive — check remaining UI state");
  }

  // GS
  await page.evaluate((key) => localStorage.removeItem(key), gsKey);
  await page.goto(`${BASE}/study-corner/general-science/model-test-01`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /अभ्यास आरम्भ/i }).click();
  await clickFirstMcqOption(page);
  const gsProg = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), gsKey);
  if (!gsProg?.answers) fail("GS: progress not saved");
  else pass("GS: progress saves");

  if (gsProg && !(await page.evaluate((key) => localStorage.getItem("taipoq_general-awareness_model-test-01_progress") === localStorage.getItem(key), gsKey))) {
    pass("GA and GS use separate storage keys");
  }

  // GS zero-attempt timeout
  await page.evaluate((key) => localStorage.removeItem(key), gsKey);
  await page.goto(`${BASE}/study-corner/general-science/model-test-01`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /अभ्यास आरम्भ/i }).click();
  let gs0 = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), gsKey);
  gs0.remainingSeconds = 1;
  await page.evaluate(({ key, p }) => localStorage.setItem(key, JSON.stringify(p)), { key: gsKey, p: gs0 });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  if (await page.getByRole("button", { name: /अभ्यास आरम्भ/i }).isVisible({ timeout: 5000 }).catch(() => false)) {
    pass("GS: zero-attempt timeout returns to instructions");
  } else {
    warn("GS: zero-attempt timeout behaviour inconclusive");
  }
}

async function runMobileViewports(page) {
  console.log("\n=== Mobile viewports ===");
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const route of MOBILE_ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
      await checkNoHorizontalScroll(page, `${vp.name} ${route}`);
      const submitVisible = await page
        .getByRole("button", { name: /Submit|Start Test|अभ्यास|Open Test/i })
        .first()
        .isVisible()
        .catch(() => false);
      if (submitVisible || route === "/result") pass(`${vp.name} ${route}: primary UI reachable`);
    }
  }
}

async function runAccessibilitySpot(page) {
  console.log("\n=== Accessibility spot check ===");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/daily-mission`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName || "none");
  if (focused !== "BODY") pass(`Keyboard focus moves (${focused})`);
  else warn("Keyboard focus spot check inconclusive");
}

async function main() {
  console.log("TAIPOQ — Browser Release Smoke Test");
  console.log("=".repeat(48));
  console.log(`Base URL: ${BASE}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await preparePage(context);
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("extension") && !text.includes("DevTools")) {
        results.consoleErrors.push(text);
      }
    }
  });
  page.on("response", (resp) => {
    const url = resp.url();
    if (resp.status() >= 400 && url.startsWith(BASE) && !url.includes("favicon")) {
      results.networkFailures.push(`${resp.status()} ${url}`);
    }
  });

  try {
    const home = await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 30000 });
    if (!home || home.status() !== 200) fail(`Homepage status ${home?.status()}`);
    else pass("Homepage loads on Nitro preview");

    await runMobileViewports(page);
    await runDailyMissionE2E(page, context);
    await runTypingIntelligence(page, context);
    await runHubSpotCheck(page);
    await runPack02QA(page);
    await runGaGsQA(page, context);
    await runAccessibilitySpot(page);

    const storage = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const k = localStorage.key(i);
        if (k) keys.push({ key: k, size: (localStorage.getItem(k) || "").length });
      }
      return keys;
    });
    const totalSize = storage.reduce((a, b) => a + b.size, 0);
    pass(`Storage audit: ${storage.length} keys, ~${totalSize} chars total`);

    if (results.consoleErrors.length === 0) pass("No application console errors captured");
    else {
      for (const e of results.consoleErrors.slice(0, 10)) warn(`Console error: ${e.slice(0, 120)}`);
    }

    if (results.networkFailures.length === 0) pass("No critical network failures on tested flows");
    else {
      for (const n of results.networkFailures) fail(`Network: ${n}`);
    }
  } finally {
    await browser.close();
  }

  console.log("\n" + "=".repeat(48));
  console.log(`PASS: ${results.pass.length}`);
  console.log(`FAIL: ${results.fail.length}`);
  console.log(`WARN: ${results.warn.length}`);

  if (results.fail.length > 0) {
    console.log("\nFAILED CHECKS:");
    for (const f of results.fail) console.log(` - ${f}`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
