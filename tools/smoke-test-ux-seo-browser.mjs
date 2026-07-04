#!/usr/bin/env node
/**
 * Post-refinement UX/SEO browser verification against Nitro preview.
 * Run: npm run build && QA_BASE_URL=http://127.0.0.1:PORT node tools/smoke-test-ux-seo-browser.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4175";
const VIEWPORTS = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
];

const ROUTES = [
  "/",
  "/test",
  "/daily-mission",
  "/tests",
  "/study-corner",
  "/mock-test/current-affairs-pack-02",
  "/upcoming-exams",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
];

const pass = [];
const fail = [];

function recordPass(msg) {
  pass.push(msg);
}
function recordFail(msg) {
  fail.push(msg);
  console.error(`FAIL: ${msg}`);
}

async function prepareContext(context) {
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

async function dismissCookie(page) {
  const btn = page.getByRole("button", { name: "Accept All" });
  if (await btn.isVisible({ timeout: 1200 }).catch(() => false)) await btn.click();
}

async function checkRoute(page, route, vpName) {
  const label = `${vpName} ${route}`;
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 45000 });
  if (!res || res.status() >= 400) {
    recordFail(`${label}: HTTP ${res?.status() ?? "no response"}`);
    return;
  }
  recordPass(`${label}: HTTP ${res.status()}`);

  await dismissCookie(page);

  const mainReady = await page
    .waitForSelector("#main-content", { timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!mainReady) {
    recordFail(`${label}: #main-content not found after hydration`);
    return;
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  if (overflow) recordFail(`${label}: horizontal scroll`);
  else recordPass(`${label}: no horizontal scroll`);

  if (route === "/") {
    const mainH1 = await page.locator("#main-content h1").count();
    if (mainH1 !== 1) recordFail(`${label}: expected exactly 1 H1 in main, got ${mainH1}`);
    else recordPass(`${label}: single visible H1 in main`);
  }

  const mains = await page.locator("main").count();
  if (mains !== 1) recordFail(`${label}: expected 1 main landmark, got ${mains}`);
  else recordPass(`${label}: single main landmark`);
}

async function checkSeoMeta(page) {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  if (!canonical) recordFail("SEO: missing canonical on /");
  else if (canonical.includes("localhost")) recordFail("SEO: canonical points to localhost");
  else recordPass(`SEO: canonical ${canonical}`);
}

async function checkRobotsSitemap(request) {
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const res = await request.get(`${BASE}${path}`);
    if (res.status() !== 200) recordFail(`${path}: HTTP ${res.status()}`);
    else recordPass(`${path}: HTTP 200`);
    const body = await res.text();
    if (path === "/sitemap.xml" && body.includes("localhost")) recordFail("sitemap.xml: contains localhost");
    if (path === "/sitemap.xml" && body.includes("/result")) recordFail("sitemap.xml: contains /result");
  }
}

async function main() {
  console.log(`UX/SEO browser verification @ ${BASE}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await prepareContext(context);
  const page = await context.newPage();

  await checkRobotsSitemap(page.request);

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const route of ROUTES) {
      await checkRoute(page, route, vp.name);
    }
  }

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await checkSeoMeta(page);

  await browser.close();

  console.log(`\nPass: ${pass.length}, Fail: ${fail.length}`);
  if (fail.length) process.exit(1);
  console.log("\nBROWSER UX/SEO PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
