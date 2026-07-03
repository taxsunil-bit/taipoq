// Part B — runtime preview-leak sentinel test.
// Proves the public loader returns LIVE data and never PREVIEW data, using
// distinct sentinels served through a mocked fetch. Also inspects the
// production build output for any public-route preview switch. The original
// global fetch is always restored (even on failure) via t.after().

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadVacanciesLive,
  loadVacanciesPreview,
  LIVE_DATA_URL,
  PREVIEW_DATA_URL,
} from "../../src/lib/vacanciesSource.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const LIVE_ONLY_SENTINEL = "LIVE_ONLY_SENTINEL";
const PREVIEW_ONLY_SENTINEL = "PREVIEW_ONLY_SENTINEL";

const livePayload = {
  lastUpdated: "2026-07-01",
  source: "live",
  items: [
    {
      id: "sentinel-live",
      title: LIVE_ONLY_SENTINEL,
      status: "active",
      preparationLinks: [],
    },
  ],
};
const previewPayload = {
  lastUpdated: "2026-07-01",
  source: "preview",
  items: [
    {
      id: "sentinel-preview",
      title: PREVIEW_ONLY_SENTINEL,
      status: "active",
      preparationLinks: [],
    },
  ],
};

function installFetchMock(fetchedUrls) {
  globalThis.fetch = async (url) => {
    fetchedUrls.push(String(url));
    const u = String(url);
    const body = u.endsWith(PREVIEW_DATA_URL) ? previewPayload : u.endsWith(LIVE_DATA_URL) ? livePayload : null;
    if (!body) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => body };
  };
}

test("Part B: public loader returns the live sentinel, never the preview sentinel", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalLocation = globalThis.location;
  t.after(() => {
    globalThis.fetch = originalFetch;
    globalThis.location = originalLocation;
  });

  const urls = [];
  installFetchMock(urls);
  // Simulate an attacker appending ?preview=1 to the public URL.
  globalThis.location = { search: "?preview=1" };

  const live = await loadVacanciesLive();
  const titlesLive = live.payload.items.map((i) => i.title);
  assert.ok(titlesLive.includes(LIVE_ONLY_SENTINEL), "live contains live sentinel");
  assert.ok(!titlesLive.includes(PREVIEW_ONLY_SENTINEL), "live must NOT contain preview sentinel");
  assert.ok(
    urls.some((u) => u.endsWith(LIVE_DATA_URL)) && !urls.some((u) => u.endsWith(PREVIEW_DATA_URL)),
    "public loader fetched only the live URL even with ?preview=1",
  );

  const preview = await loadVacanciesPreview();
  const titlesPrev = preview.payload.items.map((i) => i.title);
  assert.ok(titlesPrev.includes(PREVIEW_ONLY_SENTINEL), "preview loader returns preview sentinel");
});

test("Part B: public route source has no preview switch (supplementary guard)", () => {
  const src = readFileSync(path.join(ROOT, "src", "routes", "upcoming-exams.tsx"), "utf8");
  assert.ok(!/loadVacanciesPreview/.test(src), "no preview loader reference");
  assert.ok(!/useVacancyPreviewMode/.test(src), "no preview-mode hook");
  assert.ok(!/[?&]preview=1|get\(["']preview["']\)/.test(src), "no preview query switch");
  assert.ok(/loadVacanciesLive/.test(src), "uses the live loader");

  const preview = readFileSync(path.join(ROOT, "src", "routes", "vacancies-preview.tsx"), "utf8");
  assert.ok(/PREVIEW — NOT PUBLISHED/.test(preview), "preview route shows PREVIEW — NOT PUBLISHED");
  assert.ok(/loadVacanciesPreview/.test(preview), "preview route uses the preview loader");
});

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(mjs|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

test("Part B: production build exposes no public-route preview switch", (t) => {
  const outDir = path.join(ROOT, ".vercel", "output");
  const files = walk(outDir);
  if (!files.length) {
    t.skip("no build output found (run `npm run build` first)");
    return;
  }
  // The shared loader core is code-split into its own chunk, so the public
  // route chunk must not inline the preview data URL string (string literals
  // survive minification, making this a robust isolation check).
  const upcoming = files.filter((f) => /upcoming-exams/.test(path.basename(f)));
  if (!upcoming.length) {
    t.skip("no upcoming-exams route chunk found in build output");
    return;
  }
  for (const f of upcoming) {
    const code = readFileSync(f, "utf8");
    assert.ok(!/vacancies\.preview\.json/.test(code), `${path.basename(f)} must not reference the preview data URL`);
    assert.ok(!/useVacancyPreviewMode/.test(code), `${path.basename(f)} must not contain a preview-mode hook`);
  }
  // The preview surface (marker + preview URL) must still be shipped somewhere.
  const anyPreviewUrl = files.some((f) => readFileSync(f, "utf8").includes(PREVIEW_DATA_URL));
  const anyMarker = files.some((f) => readFileSync(f, "utf8").includes("PREVIEW — NOT PUBLISHED"));
  assert.ok(anyPreviewUrl, "preview data URL is shipped for the preview route");
  assert.ok(anyMarker, "PREVIEW — NOT PUBLISHED marker is shipped");
});
