#!/usr/bin/env node
/**
 * robots.txt + sitemap.xml integrity tests.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_ORIGIN,
  STATIC_PUBLIC_PATHS,
  SITEMAP_EXCLUSIONS,
  collectSitemapPaths,
  buildSitemapXml,
} from "../../src/lib/siteMapCore.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

test("public/robots.txt exists and permits indexing with sitemap", () => {
  const robotsPath = path.join(ROOT, "public", "robots.txt");
  assert.ok(existsSync(robotsPath), "robots.txt must exist in public/");
  const text = readFileSync(robotsPath, "utf8");
  assert.match(text, /User-agent:\s*\*/i);
  assert.match(text, /Allow:\s*\/\s*$/m);
  assert.doesNotMatch(text, /Disallow:\s*\/\s*$/m);
  assert.match(text, /Sitemap:\s*https:\/\/www\.taipoq\.com\/sitemap\.xml/);
  assert.match(text, /Disallow:\s*\/admin/);
  assert.match(text, /Disallow:\s*\/vacancies-preview/);
});

test("sitemap builder is deterministic, unique, and uses canonical host", () => {
  const pack = JSON.parse(readFileSync(path.join(ROOT, "public", "data", "test-paper-pack-01.json"), "utf8"));
  const paths = collectSitemapPaths(pack);
  const again = collectSitemapPaths(pack);
  assert.deepEqual(paths, again);
  assert.equal(new Set(paths).size, paths.length);

  for (const required of ["/", "/about", "/terms", "/privacy", "/disclaimer", "/tests", "/upcoming-exams", "/daily-mission", "/math-speed-lab"]) {
    assert.ok(paths.includes(required), `missing ${required}`);
  }
  for (const ex of SITEMAP_EXCLUSIONS) {
    assert.ok(!paths.includes(ex), `excluded path leaked: ${ex}`);
  }
  assert.ok(paths.includes("/tests/pyq-practice/pyq-practice-test-paper"));

  const xml = buildSitemapXml(paths);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(xml, new RegExp(`<loc>${SITE_ORIGIN}/</loc>`));
  assert.match(xml, new RegExp(`<loc>${SITE_ORIGIN}/privacy</loc>`));
  assert.doesNotMatch(xml, /<lastmod>/);
  assert.doesNotMatch(xml, /\?utm_/);
  assert.equal((xml.match(/<loc>/g) || []).length, paths.length);
});

test("committed public/sitemap.xml matches builder output", () => {
  const pack = JSON.parse(readFileSync(path.join(ROOT, "public", "data", "test-paper-pack-01.json"), "utf8"));
  const expected = buildSitemapXml(collectSitemapPaths(pack));
  const actual = readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
  assert.equal(actual, expected);
});

test("static public paths do not include query strings", () => {
  for (const p of STATIC_PUBLIC_PATHS) {
    assert.ok(p.startsWith("/"));
    assert.ok(!p.includes("?"));
    assert.ok(!p.includes("#"));
  }
});
