#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC =
  process.argv[2] ??
  path.join(process.env.USERPROFILE ?? "", "Downloads", "TAIPOQ_CHECKED_TEST_PAPER_PACK_01.json");
const OUT = path.join(ROOT, "src", "content", "tests", "checkedTestPaperPack01.ts");
const JSON_OUT = path.join(ROOT, "public", "data", "test-paper-pack-01.json");

function paperIdFromFile(file) {
  return file
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/^\d+_/, "")
    .replace(/_/g, "-");
}

const data = JSON.parse(readFileSync(SRC, "utf8"));
for (const p of data.papers) {
  p.paperId = paperIdFromFile(p.file);
}

mkdirSync(path.dirname(OUT), { recursive: true });
const body = `import type { TestPaperPack } from "@/lib/tests/testTypes";

/** Checked pack 01 — 14 papers, 140 questions. Source: TAIPOQ_CHECKED_TEST_PAPER_PACK_01.json */
export const CHECKED_TEST_PAPER_PACK_01: TestPaperPack = ${JSON.stringify(data, null, 2)} as const;
`;

writeFileSync(OUT, body, "utf8");
writeFileSync(JSON_OUT, JSON.stringify(data, null, 2), "utf8");
console.log("Wrote", OUT);
console.log("Wrote", JSON_OUT);
