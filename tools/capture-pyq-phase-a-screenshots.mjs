#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:4174";
const OUT = process.argv[3] || "C:\\Users\\dell\\Desktop\\taipoq reports\\pyq_naming_integrity_phase_a_screenshots_20260705";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function shot(page, name, vp) {
  await page.setViewportSize(vp);
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("Wrote", file, "overflow", overflow);
  return overflow;
}

const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  sessionStorage.setItem("taipoq_welcome_motivation_seen", "1");
  localStorage.setItem("taipoq_cookie_consent", JSON.stringify({ essential: true, analytics: false, updatedAt: new Date().toISOString() }));
});
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });

await page.goto(`${BASE}/tests`, { waitUntil: "networkidle", timeout: 120000 });
await page.getByText("PYQ Guide", { exact: false }).first().waitFor({ timeout: 15000 });
await shot(page, "tests-desktop.png", { width: 1440, height: 900 });
await shot(page, "tests-mobile.png", { width: 390, height: 844 });

const bodyTests = await page.locator("body").innerText();
if (!bodyTests.includes("PYQ Guide")) throw new Error("PYQ Guide missing on /tests");
if (bodyTests.includes("PYQ Practice")) throw new Error("PYQ Practice still visible on /tests");

await page.goto(`${BASE}/tests/pyq-practice/`, { waitUntil: "networkidle" });
await shot(page, "pyq-guide-subject-desktop.png", { width: 1440, height: 900 });

await page.goto(`${BASE}/tests/pyq-practice/pyq-practice-test-paper`, { waitUntil: "networkidle" });
await shot(page, "pyq-guide-paper-intro-desktop.png", { width: 1440, height: 900 });
await shot(page, "pyq-guide-paper-intro-mobile.png", { width: 390, height: 844 });

await page.getByRole("button", { name: /Open Test/i }).click();
await page.waitForTimeout(500);
const opts = page.locator('button[type="button"]').filter({ hasText: /^[A-D]\./ });
const n = await opts.count();
for (let i = 0; i < n; i += 4) await opts.nth(i).click().catch(() => {});
await page.getByRole("button", { name: /Submit/i }).click();
await page.waitForTimeout(800);
await shot(page, "pyq-guide-result-desktop.png", { width: 1440, height: 900 });

await page.goto(`${BASE}/daily-mission`, { waitUntil: "networkidle" });
await shot(page, "daily-mission-desktop.png", { width: 1440, height: 900 });

await ctx.close();
await browser.close();
console.log("QA OK consoleErrors", consoleErrors.length, "dir", OUT);
