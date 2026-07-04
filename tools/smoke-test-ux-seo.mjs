#!/usr/bin/env node
/**
 * UX / SEO refinement smoke test.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors = [];
const checks = [];

function fail(msg) {
  errors.push(msg);
}
function pass(msg) {
  checks.push(msg);
}
function mustExist(rel) {
  const p = path.join(ROOT, rel);
  if (!existsSync(p)) fail(`Missing: ${rel}`);
  else pass(`Exists: ${rel}`);
}
function mustInclude(rel, needle, label) {
  const p = path.join(ROOT, rel);
  const src = readFileSync(p, "utf8");
  if (!src.includes(needle)) fail(`${rel}: missing ${label ?? needle}`);
  else pass(`${rel}: ${label ?? needle}`);
}
function mustNotInclude(rel, needle, label) {
  const p = path.join(ROOT, rel);
  const src = readFileSync(p, "utf8");
  if (src.includes(needle)) fail(`${rel}: should not contain ${label ?? needle}`);
  else pass(`${rel}: no ${label ?? needle}`);
}

console.log("TAIPOQ — UX / SEO Smoke Test");
console.log("=".repeat(48));

mustExist("public/robots.txt");
mustExist("public/sitemap.xml");
mustExist("src/lib/seo.ts");
mustExist("src/lib/homeJobTeaser.ts");
mustExist("src/components/HomeJobUpdatesTeaser.tsx");
mustExist("src/components/StructuredData.tsx");

mustInclude("src/routes/index.tsx", "Start Typing Practice", "homepage typing CTA");
mustInclude("src/routes/index.tsx", "Today&apos;s Mission", "homepage mission CTA");
mustInclude("src/routes/index.tsx", "HomeJobUpdatesTeaser", "job updates teaser");
mustInclude(
  "src/routes/index.tsx",
  "Free Typing Practice and Exam Preparation for Government-Job Aspirants",
  "visible H1 text",
);
mustNotInclude("src/routes/index.tsx", 'className="sr-only"', "hidden-only H1");
mustInclude("src/components/PageShell.tsx", "Skip to main content", "skip link");
mustInclude("src/components/PageShell.tsx", 'id="main-content"', "main landmark id");
mustInclude("src/components/PageShell.tsx", "tabIndex={-1}", "skip-link focus target");
mustInclude("src/components/NavBar.tsx", "Typing Practice", "nav typing link");
mustInclude("src/components/NavBar.tsx", "Job Updates", "nav job updates");
mustInclude("src/components/HomeJobUpdatesTeaser.tsx", "No verified open job updates are available at present", "empty state copy");
mustInclude("src/components/HomeJobUpdatesTeaser.tsx", "Check Again Later", "empty state check again");
mustInclude("src/lib/seo.ts", "https://www.taipoq.com", "production domain");
mustInclude("public/robots.txt", "Sitemap:", "sitemap reference");
mustInclude("public/robots.txt", "Disallow: /admin", "admin disallow");
mustInclude("public/sitemap.xml", "/upcoming-exams", "sitemap job updates");
mustNotInclude("public/sitemap.xml", "localhost", "no localhost in sitemap");
mustNotInclude("public/sitemap.xml", "/login", "no login in sitemap");
mustNotInclude("public/sitemap.xml", "/result", "no result in sitemap");
mustInclude("src/routes/about.tsx", "official government website", "about independence");
mustInclude("src/routes/contact.tsx", "Vacancy corrections", "vacancy correction section");
mustInclude("src/routes/disclaimer.tsx", "not affiliated", "disclaimer affiliation");
mustInclude("src/components/StructuredData.tsx", '"@type": "WebSite"', "WebSite schema only");

console.log(`\nChecks passed: ${checks.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}
console.log("\nPASS");
process.exit(0);
