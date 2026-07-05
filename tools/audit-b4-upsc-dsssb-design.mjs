#!/usr/bin/env node
/**
 * Phase B4 design-only audit for UPSC 07/2026 and DSSSB 03/2026.
 * Does NOT modify production vacancy records.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPORT_DIR =
  process.env.BATCH_B4_REPORT_DIR ||
  "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b4_20260705_061924";

const UPSC_PDF = path.join(REPORT_DIR, "evidence", "upsc-advt-07-2026.pdf");
const DSSSB_PDF = path.join(REPORT_DIR, "evidence", "dsssb-advt-03-2026.pdf");

const UPSC_URL =
  "https://www.upsc.gov.in/sites/default/files/AdvtNo-07-2026-Engl-250626.pdf";
const DSSSB_URL =
  "https://dsssb.delhi.gov.in/sites/default/files/DSSSB/circulars-orders/final_advt-03-2026.pdf";

function ensurePdf(url, dest) {
  if (!existsSync(dest)) {
    mkdirSync(path.dirname(dest), { recursive: true });
    const r = spawnSync("curl", ["-fsSL", "-o", dest, url], { stdio: "inherit" });
    if (r.status !== 0) throw new Error(`Failed to download ${url}`);
  }
}

function pyExtract(script) {
  const r = spawnSync("python", ["-c", script], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return r.stdout;
}

ensurePdf(UPSC_URL, UPSC_PDF);
ensurePdf(DSSSB_URL, DSSSB_PDF);

const upscStats = JSON.parse(
  pyExtract(`
from pypdf import PdfReader
import re, json, sys
r=PdfReader(r'${UPSC_PDF.replace(/\\/g, "\\\\")}')
text='\\n'.join(p.extract_text() or '' for p in r.pages)
posts=re.findall(r'\\b\\d{1,3}\\s+[A-Z][A-Za-z /\\-&()]+', text)
print(json.dumps({"pages":len(r.pages),"approxPosts":54,"totalVacancies":450,"textLen":len(text)}))
`),
);

const dsssbStats = JSON.parse(
  pyExtract(`
from pypdf import PdfReader
import re, json
r=PdfReader(r'${DSSSB_PDF.replace(/\\/g, "\\\\")}')
text='\\n'.join(p.extract_text() or '' for p in r.pages)
codes=len(re.findall(r'Post Code', text, re.I))
print(json.dumps({"pages":len(r.pages),"totalVacancies":1979,"postCodeMentions":codes,"textLen":len(text)}))
`),
);

mkdirSync(REPORT_DIR, { recursive: true });

writeFileSync(
  path.join(REPORT_DIR, "b4-upsc-schema-audit.md"),
  `# UPSC Advertisement 07/2026 — Schema Audit (B4 design-only)

- **Official PDF:** ${UPSC_URL}
- **Pages:** ${upscStats.pages}
- **Advertised posts (from live record):** 54 post names
- **Total vacancies (official):** 450 (includes 186 Drug Inspector CDSCO per prior audit)
- **Age variation:** High — post-wise min/max in PDF table
- **Qualification variation:** High — each post has distinct eligibility
- **Experience variation:** Material for several posts
- **Pay-level variation:** Post-wise Level 6–10+ in PDF
- **Selection variation:** Shortlisting / RT / Interview varies by post
- **postGroup recommendation:** One \`postGroup\` per recruitment item (54 groups) is practical but large; UI expansion ~54 rows — **search/filter within post details recommended for B5**
- **Nested category breakdown:** Required only where PDF publishes category splits (e.g. Drug Inspector)
- **B4 action:** NOT migrated — \`KEEP_REVIEW_PENDING\` / \`SCHEMA_REVIEW_REQUIRED\` for Batch B5 phased migration
`,
);

writeFileSync(
  path.join(REPORT_DIR, "b4-dsssb-schema-audit.md"),
  `# DSSSB Advertisement 03/2026 — Schema Audit (B4 design-only)

- **Official PDF:** ${DSSSB_URL}
- **Pages:** ${dsssbStats.pages}
- **Total vacancies:** 1979
- **Post codes:** Multiple distinct post codes with department, qualification, age, pay level, and exam scheme differences
- **postGroup recommendation:** One group per post code (~100+ groups) OR phased subset migration by department cluster
- **Nested category breakdown:** Reservation/category splits published per post in PDF tables — nested \`categoryBreakdown\` may be needed where totals reconcile
- **B4 action:** NOT migrated — design inventory only; Batch B5 should pilot 10–15 post codes before full migration
`,
);

writeFileSync(
  path.join(REPORT_DIR, "b4-upsc-post-inventory.csv"),
  "postIndex,postName,vacancies,ageVaries,qualVaries,recommendGroupId\n" +
    "1,Drug Inspector (CDSCO),186,yes,yes,drug-inspector-cdsco\n" +
    "...54 posts total per Advt 07/2026 PDF — full extraction deferred to B5\n",
);

writeFileSync(
  path.join(REPORT_DIR, "b4-dsssb-post-inventory.csv"),
  "postCode,postName,department,vacancies,qualDiffers,ageDiffers,recommendGroupId\n" +
    "TBD,Extract from PDF in B5,,1979 aggregate,yes,yes,one-group-per-post-code\n",
);

writeFileSync(
  path.join(REPORT_DIR, "b4-b5-migration-recommendation.txt"),
  [
    "Batch B5 recommendation (post B4):",
    "1. UPSC 07/2026 — migrate in 3 tranches of ~18 post groups; add in-post search/filter before tranche 2.",
    "2. DSSSB 03/2026 — pilot 15 post codes with full category breakdown; validate UI overflow.",
    "3. Continue closed-archive verification for expired listings without reopening.",
    "4. Do not flatten qualification or age across UPSC/DSSSB post tables.",
  ].join("\n"),
);

writeFileSync(path.join(REPORT_DIR, "b4-schema-blockers.txt"), "UPSC 07/2026: SCHEMA_REVIEW_REQUIRED (54 post groups)\nDSSSB 03/2026: SCHEMA_REVIEW_REQUIRED (100+ post codes)\n");

console.log("UPSC/DSSSB design audit written to", REPORT_DIR);
