#!/usr/bin/env node
/**
 * Homepage vertical scroll regression (nested modal scroll-lock).
 * Run: npm run build && npm run preview
 *      npm run smoke:homepage-scroll
 * Env: QA_BASE_URL (default http://127.0.0.1:4174)
 */

import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4174";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error(`  FAIL: ${msg}`);
}

function pass(msg) {
  console.log(`  PASS: ${msg}`);
}

async function scrollMetrics(page) {
  return page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    bodyOverflow: document.body.style.overflow,
    scrollY: window.scrollY,
  }));
}

async function assertCanScroll(page, label) {
  const before = await scrollMetrics(page);
  if (before.scrollHeight <= before.clientHeight + 8) {
    fail(`${label}: page not tall enough to scroll (${before.scrollHeight} vs ${before.clientHeight})`);
    return;
  }
  if (before.bodyOverflow === "hidden") {
    fail(`${label}: body overflow still hidden`);
    return;
  }

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);
  const after = await scrollMetrics(page);
  if (after.scrollY <= 0) {
    fail(`${label}: scrollY did not increase after scrollTo bottom`);
    return;
  }

  const footerVisible = await page
    .locator("footer")
    .isVisible()
    .catch(() => false);
  if (!footerVisible) {
    fail(`${label}: footer not visible after scroll to bottom`);
    return;
  }

  const hOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  if (hOverflow) {
    fail(`${label}: horizontal overflow detected`);
    return;
  }

  pass(`${label}: vertical scroll to footer OK`);
}

async function dismissCookieIfPresent(page) {
  const accept = page.getByRole("button", { name: "Accept All" });
  if (await accept.isVisible({ timeout: 1200 }).catch(() => false)) {
    await accept.click();
  }
}

async function testOverlaysDismissThenScroll(page, viewportName) {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);

  await dismissHomeOverlaysIfPresent(page);
  await assertCanScroll(page, `${viewportName} after overlay dismiss`);
}

async function testPreparedHomeScroll(page, viewportName) {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await assertCanScroll(page, `${viewportName} prepared session`);
}

async function testMobileMenuDoesNotLock(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);

  const menu = page.locator("summary", { hasText: "Menu" });
  if (await menu.isVisible({ timeout: 2000 }).catch(() => false)) {
    await menu.click();
    await page.waitForTimeout(200);
    await menu.click();
    await page.waitForTimeout(200);
  }

  await assertCanScroll(page, "mobile menu close restores scroll");
}

async function dismissHomeOverlaysIfPresent(page) {
  const skipWelcome = page.getByRole("button", { name: /skip welcome/i });
  if (await skipWelcome.isVisible({ timeout: 3000 }).catch(() => false)) {
    await skipWelcome.click();
    await page.waitForTimeout(400);
  }

  const toughClose = page.getByRole("button", { name: "Close", exact: true });
  if (await toughClose.isVisible({ timeout: 2000 }).catch(() => false)) {
    await toughClose.click();
    await page.waitForTimeout(300);
  }
}

async function testNavigateAwayAndBack(page) {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await dismissHomeOverlaysIfPresent(page);

  await page.waitForFunction(
    () => !document.querySelector('[role="dialog"][aria-modal="true"]'),
    null,
    { timeout: 5000 },
  ).catch(() => {});

  await page.getByRole("link", { name: "Tests" }).first().click();
  await page.waitForURL(/\/tests/);
  await page.getByRole("link", { name: "Home" }).first().click();
  await page.waitForURL(/\//);
  await page.waitForTimeout(900);

  const overflow = await page.evaluate(() => document.body.style.overflow);
  if (overflow === "hidden") {
    fail("return home after navigation left body.style.overflow hidden");
    return;
  }

  await assertCanScroll(page, "return home after navigation");
}

async function testNestedOverlaySequence(page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);

  await page.waitForTimeout(1200);

  const skipWelcome = page.getByRole("button", { name: /skip welcome/i });
  if (await skipWelcome.isVisible({ timeout: 5000 }).catch(() => false)) {
    await skipWelcome.click();
    await page.waitForTimeout(300);
  }

  await page.waitForTimeout(500);

  const toughClose = page.getByRole("button", { name: "Close", exact: true });
  if (await toughClose.isVisible({ timeout: 3000 }).catch(() => false)) {
    await toughClose.click();
    await page.waitForTimeout(300);
  }

  const overflow = await page.evaluate(() => document.body.style.overflow);
  if (overflow === "hidden") {
    await page.waitForFunction(() => document.body.style.overflow !== "hidden", null, {
      timeout: 3000,
    }).catch(() => {});
  }

  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  if (overflowAfter === "hidden") {
    fail("nested overlay sequence left body.style.overflow hidden");
    return;
  }
  pass("nested welcome + tough mock sequence releases body overflow");

  await assertCanScroll(page, "nested overlay sequence scroll");
}

async function main() {
  console.log("TAIPOQ — Homepage Scroll Regression");
  console.log("=".repeat(48));
  console.log(`Base URL: ${BASE}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  const prepared = await browser.newContext();
  await prepared.addInitScript(() => {
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

  try {
    for (const vp of VIEWPORTS) {
      const page = await prepared.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await testPreparedHomeScroll(page, vp.name);
      await page.close();
    }

    const freshPage = await context.newPage();
    await testNestedOverlaySequence(freshPage);
    await freshPage.close();

    for (const vp of VIEWPORTS.slice(0, 2)) {
      const page = await context.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await testOverlaysDismissThenScroll(page, vp.name);
      await page.close();
    }

    const menuPage = await context.newPage();
    await testMobileMenuDoesNotLock(menuPage);
    await menuPage.close();

    const navPage = await prepared.newPage();
    await testNavigateAwayAndBack(navPage);
    await navPage.close();
  } finally {
    await prepared.close();
    await context.close();
    await browser.close();
  }

  console.log(`\nFailures: ${failures.length}`);
  if (failures.length) {
    console.log("\nFAIL");
    process.exit(1);
  }
  console.log("\nPASS");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
