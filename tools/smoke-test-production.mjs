#!/usr/bin/env node
/**
 * Read-only production smoke against a deployed TAIPOQ site.
 * Run: TAIPOQ_SMOKE_URL=https://www.taipoq.com npm run smoke:production
 * Or:  node tools/smoke-test-production.mjs --url https://www.taipoq.com
 * Requires: npx playwright install chromium (once, not bundled in package.json)
 */

import { chromium } from "playwright";

function resolveBaseUrl() {
  const argIdx = process.argv.indexOf("--url");
  if (argIdx >= 0 && process.argv[argIdx + 1]) {
    return String(process.argv[argIdx + 1]).replace(/\/$/, "");
  }
  if (process.env.TAIPOQ_SMOKE_URL) {
    return String(process.env.TAIPOQ_SMOKE_URL).replace(/\/$/, "");
  }
  console.error("TAIPOQ production smoke requires an explicit URL.");
  console.error("  TAIPOQ_SMOKE_URL=https://www.taipoq.com npm run smoke:production");
  console.error("  node tools/smoke-test-production.mjs --url https://www.taipoq.com");
  process.exit(1);
}

const BASE = resolveBaseUrl();
const results = { pass: [], fail: [], consoleErrors: [], networkFailures: [] };

function pass(msg) {
  results.pass.push(msg);
  console.log(`  PASS: ${msg}`);
}
function fail(msg) {
  results.fail.push(msg);
  console.error(`  FAIL: ${msg}`);
}

async function main() {
  console.log("TAIPOQ — Production Smoke Test");
  console.log("=".repeat(48));
  console.log(`Base URL: ${BASE}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
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
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!t.includes("extension") && !t.includes("DevTools")) results.consoleErrors.push(t);
    }
  });
  page.on("response", (resp) => {
    const url = resp.url();
    if (resp.status() >= 400 && url.startsWith(BASE) && !url.includes("favicon")) {
      results.networkFailures.push(`${resp.status()} ${url}`);
    }
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const dailyMissionHeading = page
    .locator("#main-content")
    .getByRole("heading", { name: "Today's TAIPOQ Mission", exact: true });
  if (await dailyMissionHeading.isVisible({ timeout: 8000 })) pass("Homepage: Daily Mission section");
  else fail("Homepage: Daily Mission missing");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  if (!overflow) pass("Homepage: no horizontal scroll (390px)");
  else fail("Homepage: horizontal scroll");

  await page.evaluate(() => localStorage.removeItem("taipoq.dailyMission.v1"));
  await page.goto(`${BASE}/daily-mission`, { waitUntil: "networkidle" });
  const dm = await page.evaluate(() => JSON.parse(localStorage.getItem("taipoq.dailyMission.v1") || "null"));
  if (dm && Object.values(dm.tasks || {}).some((t) => t.completed)) fail("Daily Mission: false completion on visit");
  else pass("Daily Mission: visit alone does not complete tasks");

  await page.goto(`${BASE}/tests/model-papers/model-paper-01`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Open Test/i }).click();
  await page.locator("ol.space-y-4 > li").first().locator('button[type="button"]').first().click();
  pass("Hub test: option selection works");

  await page.goto(`${BASE}/mock-test/current-affairs-pack-02`, { waitUntil: "networkidle" });
  let body = await page.locator("body").innerText();
  if (body.includes("Negative marking: None") || body.includes("None (0)")) pass("Pack 02: no negative marking on instructions");
  else fail("Pack 02: negative marking text missing on instructions");
  await page.getByRole("button", { name: /Mock Test शुरू/i }).click();
  body = await page.locator("body").innerText();
  if (body.match(/⏱|00:29|00:30/)) pass("Pack 02: timer visible");
  else fail("Pack 02: timer not visible");
  await page.getByRole("group", { name: "उत्तर विकल्प" }).getByRole("button").first().click();
  await page.getByRole("button", { name: "Next Question" }).click();
  pass("Pack 02: question navigation works");

  await page.goto(`${BASE}/study-corner/general-awareness/model-test-01`, { waitUntil: "networkidle" });
  const gaBody = await page.locator("body").innerText();
  if (gaBody.match(/40|अभ्यास|Mock|Model/i)) pass("GA: instructions present");
  else fail("GA: instructions missing");

  await page.goto(`${BASE}/study-corner/general-science/model-test-01`, { waitUntil: "networkidle" });
  const gsBody = await page.locator("body").innerText();
  if (gsBody.match(/20|General Science|अभ्यास/i)) pass("GS: instructions present");
  else fail("GS: instructions missing");

  for (const [path, label] of [
    ["/data/general-awareness/model-test-01.json", "GA JSON"],
    ["/data/general-science/model-test-01.json", "GS JSON"],
    ["/data/test-paper-pack-02.json", "Pack 02 JSON"],
  ]) {
    const res = await page.request.get(`${BASE}${path}`);
    if (res.ok()) pass(`${label}: HTTP ${res.status()}`);
    else fail(`${label}: HTTP ${res.status()}`);
  }

  await page.goto(`${BASE}/english/practice`, { waitUntil: "networkidle" });
  if (await page.getByRole("button", { name: /Start|Practice|आरम्भ/i }).first().isVisible({ timeout: 5000 }).catch(() => false)) {
    pass("English practice: route loads");
  } else fail("English practice: primary control missing");

  await page.goto(`${BASE}/hindi/practice`, { waitUntil: "networkidle" });
  if (await page.getByRole("button", { name: /Start|Practice|आरम्भ/i }).first().isVisible({ timeout: 5000 }).catch(() => false)) {
    pass("Hindi practice: route loads");
  } else fail("Hindi practice: primary control missing");

  await page.goto(`${BASE}/upcoming-exams`, { waitUntil: "networkidle" });
  if (await page.getByRole("link", { name: "Official Source" }).first().isVisible({ timeout: 5000 }).catch(() => false)) {
    pass("Upcoming Exams: official links present");
  } else if (await page.getByRole("link", { name: "Official Notice" }).first().isVisible().catch(() => false)) {
    pass("Upcoming Exams: official notice links present");
  } else fail("Upcoming Exams: no official links");

  if (results.consoleErrors.length === 0) pass("No application console errors");
  else fail(`Console errors: ${results.consoleErrors.slice(0, 3).join("; ")}`);

  if (results.networkFailures.length === 0) pass("No critical network failures");
  else fail(`Network: ${results.networkFailures.join(", ")}`);

  await browser.close();
  console.log(`\nPASS=${results.pass.length} FAIL=${results.fail.length}`);
  if (results.fail.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
