#!/usr/bin/env node
/** Capture daily mission UI states at common viewports. */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:4174";
const OUT =
  process.argv[3] ||
  `C:\\Users\\dell\\Desktop\\taipoq reports\\daily_mission_guided_flow_screenshots_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

function missionState(partial) {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const base = {
    version: 2,
    date,
    tasks: {
      typing: { completed: false },
      currentAffairs: { completed: false },
      miniMock: { completed: false },
      jobUpdate: { completed: false },
    },
  };
  return JSON.stringify({ ...base, ...partial, date, version: 2 });
}

const states = {
  fresh: missionState({}),
  one: missionState({
    tasks: {
      typing: { completed: true, result: { netWpm: 31, accuracy: 94 } },
      currentAffairs: { completed: false },
      miniMock: { completed: false },
      jobUpdate: { completed: false },
    },
  }),
  complete: missionState({
    tasks: {
      typing: { completed: true, result: { netWpm: 31, accuracy: 94 } },
      currentAffairs: { completed: true, result: { score: 7, total: 10 } },
      miniMock: { completed: true, result: { score: 8, total: 10, percentage: 80 } },
      jobUpdate: { completed: false },
    },
  }),
  job: missionState({
    tasks: {
      typing: { completed: true, result: { netWpm: 31, accuracy: 94 } },
      currentAffairs: { completed: true, result: { score: 7, total: 10 } },
      miniMock: { completed: true, result: { score: 8, total: 10, percentage: 80 } },
      jobUpdate: { completed: true, source: "vacancy-official-notice" },
    },
  }),
};

const browser = await chromium.launch({ headless: true });

for (const [stateName, json] of Object.entries(states)) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 120000 });
    await page.evaluate((payload) => {
      localStorage.setItem("taipoq.dailyMission.v1", payload);
      window.dispatchEvent(new CustomEvent("taipoq:daily-mission-updated"));
    }, json);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const section = page.locator("#daily-mission-heading");
    await section.scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    const file = path.join(OUT, `mission-${stateName}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("Wrote", file, "overflow", overflow.doc);
    await page.close();
  }
}

await browser.close();
console.log("Done:", OUT);
