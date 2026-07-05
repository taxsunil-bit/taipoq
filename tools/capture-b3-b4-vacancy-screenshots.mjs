#!/usr/bin/env node
/** Capture B3 production + B4 preview vacancy screenshots. */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const mode = process.argv[2] || "production"; // production | preview
const outArg = process.argv[3];
const base =
  mode === "preview"
    ? process.argv[4] || "http://127.0.0.1:4174/upcoming-exams"
    : "https://www.taipoq.com/upcoming-exams";

const OUT =
  outArg ||
  (mode === "production"
    ? "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b4_20260705_061924\\screenshots\\b3-production"
    : "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b4_20260705_061924\\screenshots\\b4-preview");

fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { file: mode === "production" ? "b3-production-mobile.png" : "b4-mobile.png", width: 390, height: 844 },
  { file: mode === "production" ? "b3-production-tablet.png" : "b4-tablet.png", width: 768, height: 1024 },
  { file: mode === "production" ? "b3-production-desktop.png" : "b4-desktop.png", width: 1366, height: 768 },
];

const browser = await chromium.launch({ headless: true });
const errors = [];

for (const v of viewports) {
  const page = await browser.newPage({ viewport: { width: v.width, height: v.height } });
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  const overflow = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    body: document.body.scrollWidth > document.body.clientWidth,
  }));
  await page.screenshot({ path: path.join(OUT, v.file), fullPage: true });
  console.log("Wrote", v.file, "overflow", overflow);
  await page.close();
}

async function isroShots(prefix) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2000);
  const isro = page.locator("text=ISRO ISTRAC").first();
  await isro.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(OUT, `${prefix}isro-collapsed-production.png`),
    fullPage: false,
  });
  const btn = page.getByRole("button", { name: /View post-wise details/i }).first();
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(OUT, `${prefix}isro-expanded-mobile-production.png`),
      fullPage: true,
    });
  }
  await page.close();

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await desktop.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await desktop.waitForTimeout(2000);
  await desktop.locator("text=ISRO ISTRAC").first().scrollIntoViewIfNeeded().catch(() => {});
  const dbtn = desktop.getByRole("button", { name: /View post-wise details/i }).first();
  if (await dbtn.count()) {
    await dbtn.click();
    await desktop.waitForTimeout(800);
  }
  await desktop.screenshot({
    path: path.join(OUT, `${prefix}isro-expanded-desktop-production.png`),
    fullPage: true,
  });
  await desktop.close();
}

async function keyboardFocusShot() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.locator("text=ISRO ISTRAC").first().scrollIntoViewIfNeeded().catch(() => {});
  const btn = page.getByRole("button", { name: /View post-wise details/i }).first();
  if (await btn.count()) {
    await btn.focus();
    await page.waitForTimeout(400);
  }
  await page.screenshot({
    path: path.join(OUT, mode === "production" ? "keyboard-focus-production.png" : "b4-keyboard-focus.png"),
    fullPage: false,
  });
  await page.close();
}

if (mode === "production") {
  await isroShots("");
  await keyboardFocusShot();
} else {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2000);
  await page.locator("text=Verified Open Job").first().scrollIntoViewIfNeeded().catch(() => {});
  await page.screenshot({ path: path.join(OUT, "b4-new-verified-card.png"), fullPage: false });
  await page.locator("text=verification review pending").first().scrollIntoViewIfNeeded().catch(() => {});
  await page.screenshot({ path: path.join(OUT, "b4-review-pending-card.png"), fullPage: false });
  const isroBtn = page.getByRole("button", { name: /View post-wise details/i }).first();
  if (await isroBtn.count()) {
    await isroBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, "b4-isro-expanded.png"), fullPage: true });
    await page.screenshot({ path: path.join(OUT, "b4-multipost-mobile.png"), fullPage: true });
  }
  await page.close();
  await keyboardFocusShot();
}

await browser.close();
if (errors.length) {
  console.warn("Console/page errors:", [...new Set(errors)].slice(0, 10));
}
console.log("Done:", OUT);
