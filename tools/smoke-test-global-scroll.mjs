#!/usr/bin/env node
/**
 * Global document scroll regression across representative routes.
 * Run: npm run build && npm run preview
 *      npm run smoke:global-scroll
 * Env: QA_BASE_URL (default http://127.0.0.1:4174)
 */

import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4174";

const ROUTES = [
  { path: "/", footer: "footer", tall: true },
  { path: "/tests", footer: "footer", tall: true },
  { path: "/english/practice", footer: "footer", tall: true },
  { path: "/hindi/practice", footer: "footer", tall: true },
  { path: "/daily-mission", footer: "footer", tall: true },
  { path: "/progress", footer: "footer", tall: false },
  { path: "/upcoming-exams", footer: "footer", tall: false },
  { path: "/study-corner", footer: "footer", tall: true },
  { path: "/tests/ctet/verified-pyq-paper-1", footer: "footer", tall: false },
];

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "mobile", width: 390, height: 844 },
];

const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error(`  FAIL: ${msg}`);
}

function pass(msg) {
  console.log(`  PASS: ${msg}`);
}

async function metrics(page) {
  return page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    bodyOverflow: document.body.style.overflow,
    bodyOverflowY: getComputedStyle(document.body).overflowY,
    scrollY: window.scrollY,
    hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    openDialogs: document.querySelectorAll('[role="dialog"][aria-modal="true"]').length,
  }));
}

async function dismissCookieIfPresent(page) {
  const accept = page.getByRole("button", { name: "Accept All" });
  if (await accept.isVisible({ timeout: 1200 }).catch(() => false)) {
    await accept.click();
  }
}

async function dismissHomeOverlays(page) {
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

async function assertRouteScroll(page, route, viewportName) {
  const m = await metrics(page);
  if (m.hOverflow) {
    fail(`${viewportName} ${route.path}: horizontal overflow`);
    return;
  }
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail(`${viewportName} ${route.path}: stale body overflow hidden with no open dialog`);
    return;
  }
  if (!route.tall) {
    pass(`${viewportName} ${route.path}: short page OK`);
    return;
  }
  if (m.scrollHeight <= m.clientHeight + 8) {
    fail(`${viewportName} ${route.path}: not tall enough (${m.scrollHeight} vs ${m.clientHeight})`);
    return;
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);
  const after = await metrics(page);
  if (after.scrollY <= 0) {
    fail(`${viewportName} ${route.path}: scrollY did not increase`);
    return;
  }
  const footerVisible = await page.locator(route.footer).isVisible().catch(() => false);
  if (!footerVisible) {
    fail(`${viewportName} ${route.path}: footer not visible after scroll`);
    return;
  }
  pass(`${viewportName} ${route.path}: scroll to footer OK`);
}

async function testPreparedRoutes(context, viewport) {
  const page = await context.newPage();
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded" });
    await dismissCookieIfPresent(page);
    await assertRouteScroll(page, route, viewport.name);
  }
  await page.close();
}

async function testOverlayLifecycle(page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await page.waitForTimeout(1200);
  const skip = page.getByRole("button", { name: /skip welcome/i });
  if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(400);
  }
  const tough = page.getByRole("button", { name: "Close", exact: true });
  if (await tough.isVisible({ timeout: 2000 }).catch(() => false)) {
    await tough.click();
    await page.waitForTimeout(300);
  }
  const m = await metrics(page);
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail("overlay lifecycle: stale body lock after dismiss");
    return;
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY <= 0) {
    fail("overlay lifecycle: scroll after dismiss failed");
    return;
  }
  pass("overlay lifecycle: dismiss restores scroll");
}

async function testMobileMenuLifecycle(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await dismissHomeOverlays(page);
  const menu = page.locator("summary", { hasText: "Menu" });
  if (await menu.isVisible({ timeout: 2000 }).catch(() => false)) {
    await menu.click();
    await page.waitForTimeout(200);
    await menu.click();
    await page.waitForTimeout(200);
  }
  const m = await metrics(page);
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail("mobile menu lifecycle: stale body lock");
    return;
  }
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(100);
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY <= 0) {
    fail("mobile menu lifecycle: scroll failed after menu close");
    return;
  }
  pass("mobile menu lifecycle: scroll restored");
}

async function testClientNavigation(page) {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await dismissHomeOverlays(page);
  await page.getByRole("link", { name: "Tests" }).first().click();
  await page.waitForURL(/\/tests/);
  await page.waitForTimeout(400);
  const m = await metrics(page);
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail("client navigation: stale body lock on /tests");
    return;
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY <= 0) {
    fail("client navigation: /tests scroll failed");
    return;
  }
  await page.getByRole("link", { name: "Home" }).first().click();
  await page.waitForURL(/\//);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 500));
  const homeScroll = await page.evaluate(() => window.scrollY);
  if (homeScroll <= 0) {
    fail("client navigation: home scroll failed after return");
    return;
  }
  pass("client navigation: scroll works after route changes");
}

async function testDeepLoadAndHistory(page) {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/daily-mission`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  await dismissHomeOverlays(page);
  await page.evaluate(() => window.scrollTo(0, 400));
  const deep = await page.evaluate(() => window.scrollY);
  if (deep <= 0) {
    fail("deep load: /daily-mission scroll failed");
    return;
  }
  await page.goto(`${BASE}/english/practice`, { waitUntil: "domcontentloaded" });
  await dismissHomeOverlays(page);
  await page.goBack({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 500));
  const back = await page.evaluate(() => window.scrollY);
  if (back <= 0) {
    fail("history back: scroll failed");
    return;
  }
  pass("deep load and browser back: scroll works");
}

async function testRouteChangeClosesWelcome(page) {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  const welcomeVisible = await page
    .getByRole("button", { name: /skip welcome/i })
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  if (!welcomeVisible) {
    pass("route change welcome: skipped (welcome not shown)");
    return;
  }
  await page.getByRole("link", { name: "Tests" }).first().click({ force: true });
  await page.waitForURL(/\/tests/);
  await page.waitForTimeout(500);
  const stillOpen = await page
    .getByRole("button", { name: /skip welcome/i })
    .isVisible({ timeout: 500 })
    .catch(() => false);
  const m = await metrics(page);
  if (stillOpen) {
    fail("route change welcome: overlay still open on /tests");
    return;
  }
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail("route change welcome: stale body lock");
    return;
  }
  await page.evaluate(() => window.scrollTo(0, 800));
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY <= 0) {
    fail("route change welcome: cannot scroll /tests");
    return;
  }
  pass("route change welcome: overlay closes and scroll works");
}

async function testDeepLinkNoWelcomeLock(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" });
  await dismissCookieIfPresent(page);
  const welcomeVisible = await page
    .getByRole("button", { name: /skip welcome/i })
    .isVisible({ timeout: 1500 })
    .catch(() => false);
  if (welcomeVisible) {
    fail("deep link /tests: welcome overlay should not appear off homepage");
    return;
  }
  const m = await metrics(page);
  if (m.bodyOverflow === "hidden" && m.openDialogs === 0) {
    fail("deep link /tests: stale body lock without modal");
    return;
  }
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(40);
  }
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY <= 0) {
    fail("deep link /tests: wheel scroll failed");
    return;
  }
  pass("deep link /tests: no welcome lock, wheel scroll works");
}

async function main() {
  console.log("TAIPOQ — Global Scroll Regression");
  console.log("=".repeat(48));
  console.log(`Base URL: ${BASE}\n`);

  const browser = await chromium.launch();
  const prepared = await browser.newContext();
  await prepared.addInitScript(() => {
    sessionStorage.setItem("taipoq_welcome_motivation_seen", "1");
    localStorage.setItem("taipoq_tough_mock_popup_dismissed_at", String(Date.now()));
    localStorage.setItem(
      "taipoq_cookie_consent",
      JSON.stringify({ essential: true, analytics: false, updatedAt: new Date().toISOString() }),
    );
  });

  for (const vp of VIEWPORTS) {
    await testPreparedRoutes(prepared, vp);
  }

  const fresh = await browser.newContext();
  const welcomePage = await fresh.newPage();
  await testRouteChangeClosesWelcome(welcomePage);
  await testDeepLinkNoWelcomeLock(welcomePage);
  await welcomePage.close();

  const page = await fresh.newPage();
  await testOverlayLifecycle(page);
  await testMobileMenuLifecycle(page);
  await testClientNavigation(page);
  await testDeepLoadAndHistory(page);
  await page.close();

  await prepared.close();
  await fresh.close();
  await browser.close();

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
