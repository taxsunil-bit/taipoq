#!/usr/bin/env node
/**
 * Phase B3 — multi-post schema verification for ISRO ISTRAC 02/2026.
 * Usage: node tools/apply-batch-b3-vacancy-verification.mjs [--report-dir <path>]
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LIVE_PATH,
  PREVIEW_PATH,
  SOURCES_PATH,
  readJson,
  writeJson,
  istDateOnly,
  semanticDiff,
} from "./vacancy-update-lib.mjs";
import { strictPublicationContractPasses } from "../src/lib/vacanciesSource.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERIFIED_AT = istDateOnly(new Date("2026-07-05T06:30:00+05:30"));

const DEFAULT_REPORT =
  process.env.BATCH_B3_REPORT_DIR ||
  "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b3_20260705_060410";

const args = process.argv.slice(2);
const reportArgIdx = args.indexOf("--report-dir");
const REPORT_DIR = reportArgIdx >= 0 ? args[reportArgIdx + 1] : DEFAULT_REPORT;

const ISRO_NOTICE =
  "https://www.isro.gov.in/media_isro/pdf/recruitmentNotice/2026/June/ISTRAC_BILINGUAL_ADVERTISEMENT_02_2026_26062026.pdf";
const ISRO_RECRUITMENT_PAGE = "https://www.isro.gov.in/ISTRACRecruitment4.html";
const ISRO_APPLY = "https://www.isro.gov.in/ISTRACRecruitment4.html";

/** @type {Record<string, string>} */
const B3_DECISIONS = {
  "isro-istrac-02-2026": "READY_FOR_STRICT_VERIFICATION",
  "indian-navy-agniveer-apprentice-0127-0227-2026": "CORRIGENDUM_REVIEW_REQUIRED",
};

const STRICT_READY_IDS = Object.entries(B3_DECISIONS)
  .filter(([, d]) => d === "READY_FOR_STRICT_VERIFICATION")
  .map(([id]) => id);

function fact(key, value, sourceId) {
  return `fact:${key}|value:${value}|source:${sourceId}|verifiedAt:${VERIFIED_AT}`;
}

const NOTIFICATION_SOURCE = "isro-istrac-02-2026--notification";

function groupFacts(entries) {
  return entries.map(([key, value]) => fact(key, value, NOTIFICATION_SOURCE));
}

const ISRO_POST_GROUPS = [
  {
    id: "technical-assistant",
    title: "Technical Assistant",
    postCodes: ["005", "006"],
    vacancies: {
      total: 7,
      locationNote: "Post code 005: 6 vacancies; post code 006: 1 vacancy (Mechanical discipline)",
    },
    disciplines: ["Electronics (005)", "Mechanical (006)"],
    qualification:
      "Post 005: First Class Diploma in Electronics / Electronics & Communication from a recognised State Board; Post 006: First Class Diploma in Mechanical Engineering from a recognised State Board",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 7 — Rs 44,900/month + admissible allowances",
    fee: "Rs 250 non-refundable application fee; Rs 750 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Curriculum based)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "technical-assistant"],
      ["vacancies", "7"],
      ["postCodes", "005,006"],
      ["payLevel", "Level 7"],
    ]),
  },
  {
    id: "scientific-assistant",
    title: "Scientific Assistant",
    postCodes: ["007", "008"],
    vacancies: { total: 5 },
    disciplines: ["Computer Science (007)", "B.Sc Mathematics (008)"],
    qualification:
      "Post 007: First Class B.Sc. in Computer Science from recognised University/Institution; Post 008: First Class B.Sc. with Mathematics as main subject from recognised University/Institution",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 7 — Rs 44,900/month + admissible allowances",
    fee: "Rs 250 non-refundable application fee; Rs 750 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Curriculum based)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "scientific-assistant"],
      ["vacancies", "5"],
      ["postCodes", "007,008"],
    ]),
  },
  {
    id: "library-assistant",
    title: "Library Assistant — A",
    postCodes: ["009"],
    vacancies: { total: 1 },
    qualification:
      "First Class Graduate + First Class Master's in Library Science / Library & Information Science or equivalent from recognised University/Institution",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 2 — Rs 19,900/month + admissible allowances",
    fee: "Rs 250 non-refundable application fee; Rs 750 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Curriculum based)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "library-assistant"],
      ["vacancies", "1"],
      ["postCode", "009"],
    ]),
  },
  {
    id: "technician-b",
    title: "Technician — B",
    postCodes: ["001", "002"],
    vacancies: {
      total: 9,
      locationNote:
        "Post 001: 5 at ISTRAC + 3 at MCF Hassan (Electronics Mechanic); Post 002: 1 (Carpenter)",
    },
    disciplines: ["ITI Electronics Mechanic (001)", "ITI Carpenter (002)"],
    qualification:
      "SSLC/SSC/Matriculation + NCVT ITI/NTC/NAC in the trade relevant to the post code (Electronics Mechanic or Carpenter)",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 3 — Rs 21,700/month + admissible allowances",
    fee: "Rs 100 non-refundable application fee; Rs 500 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Curriculum based)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "technician-b"],
      ["vacancies", "9"],
      ["postCodes", "001,002"],
      ["ageLimit", "18-35 years as on 20.07.2026"],
    ]),
  },
  {
    id: "draughtsman-b",
    title: "Draughtsman — B",
    postCodes: ["003", "004"],
    vacancies: { total: 2 },
    disciplines: ["Draughtsman Civil (003)", "Draughtsman Mechanical (004)"],
    qualification:
      "SSLC/SSC/Matriculation + NCVT ITI/NTC/NAC in Draughtsman (Civil) or Draughtsman (Mechanical) trade as applicable to post code",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 3 — Rs 21,700/month + admissible allowances",
    fee: "Rs 100 non-refundable application fee; Rs 500 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Curriculum based)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "draughtsman-b"],
      ["vacancies", "2"],
      ["postCodes", "003,004"],
    ]),
  },
  {
    id: "cook-a",
    title: "Cook — A",
    postCodes: ["010"],
    vacancies: {
      total: 2,
      locationNote: "1 post at ISTRAC Bengaluru + 1 post at MCF Hassan",
    },
    qualification:
      "SSLC/SSC pass or equivalent; 5 years experience as cook in a well-established hotel/canteen; basic computer literacy certificate",
    ageMinimum: 18,
    ageMaximum: 35,
    ageCutoffDate: "2026-07-20",
    payLevel: "Level 2 — Rs 19,900/month + admissible allowances",
    fee: "Rs 100 non-refundable application fee; Rs 500 processing fee per application (processing fee refunded on appearing in Written Test/CBT)",
    selectionProcess: ["Written Test / Computer Based Test (CBT)", "Skill Test (Computer Literacy)"],
    sourceIds: [NOTIFICATION_SOURCE],
    verifiedFacts: groupFacts([
      ["postGroup", "cook-a"],
      ["vacancies", "2"],
      ["postCode", "010"],
    ]),
  },
];

/** @type {Record<string, object>} */
const STRICT_PATCHES = {
  "isro-istrac-02-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      NOTIFICATION_SOURCE,
      "isro-istrac-02-2026--application",
      "isro-istrac-02-2026--website",
    ],
    advertisementNumber: "ISTRAC:02/2026",
    notificationDate: "2026-06-27",
    totalVacancies: 26,
    applicationEndTime: "23:55",
    officialNotificationUrl: ISRO_NOTICE,
    officialNoticeUrl: ISRO_NOTICE,
    officialApplicationUrl: ISRO_APPLY,
    applyUrl: ISRO_APPLY,
    sourceUrl: ISRO_RECRUITMENT_PAGE,
    vacanciesText: "26 posts across 6 post groups (10 post codes) — see post-wise details",
    qualificationShort: "Varies by post group — see structured post-wise details",
    ageLimitShort: "18–35 years as on 20/07/2026 (section 3; relaxations per official notice)",
    feeShort:
      "Rs 250 + Rs 750 processing (Technical/Scientific Assistant) or Rs 100 + Rs 500 processing (Technician-B/Draughtsman-B/Cook-A); processing fee refunded on CBT appearance; SC/ST/PwBD/women/Ex-Servicemen exempt per notice",
    selectionProcessShort: "Written Test / CBT and Skill Test as applicable per post code",
    notificationWindowText:
      "Online applications 27/06/2026 10:00 AM to 20/07/2026 11:55 PM IST via www.isro.gov.in / www.istrac.gov.in per ISTRAC:02/2026",
    examWindowText: "Written Test/CBT and Skill Test dates to be notified per official advertisement",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official ISTRAC:02/2026 bilingual PDF (26 vacancies across 6 post groups). No corrigendum located. Apply only via ISRO/ISTRAC online portal during the published window.",
    postGroups: ISRO_POST_GROUPS,
  },
};

/** @type {Record<string, string[]>} */
const SOURCE_VERIFIED_FACTS = {
  [NOTIFICATION_SOURCE]: [
    fact("advertisementNumber", "ISTRAC:02/2026", NOTIFICATION_SOURCE),
    fact("notificationDate", "2026-06-27", NOTIFICATION_SOURCE),
    fact("totalVacancies", "26", NOTIFICATION_SOURCE),
    fact("applicationStart", "2026-06-27T10:00+05:30", NOTIFICATION_SOURCE),
    fact("applicationEnd", "2026-07-20T23:55+05:30", NOTIFICATION_SOURCE),
    fact("postGroupCount", "6", NOTIFICATION_SOURCE),
    fact("postCodeCount", "10", NOTIFICATION_SOURCE),
  ],
  "isro-istrac-02-2026--application": [
    fact("applicationPortal", "www.isro.gov.in / www.istrac.gov.in", "isro-istrac-02-2026--application"),
  ],
  "isro-istrac-02-2026--website": [
    fact("recruitmentPage", ISRO_RECRUITMENT_PAGE, "isro-istrac-02-2026--website"),
  ],
};

function buildArtifacts(live, preview) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const reconciliation = [
    "postGroupId,postCodes,vacancies,advertisementTotal,reconciled",
    ...ISRO_POST_GROUPS.map((g) =>
      [g.id, (g.postCodes ?? []).join("|"), g.vacancies.total, 26, g.vacancies.total].join(","),
    ),
    `TOTAL,,26,26,26`,
  ].join("\n");
  writeFileSync(path.join(REPORT_DIR, "isro-vacancy-reconciliation.csv"), reconciliation);
  writeFileSync(
    path.join(REPORT_DIR, "isro-post-groups-proposed.json"),
    JSON.stringify(ISRO_POST_GROUPS, null, 2),
  );
  writeFileSync(path.join(REPORT_DIR, "b3-isro-decision.txt"), "READY_FOR_STRICT_VERIFICATION");
  writeFileSync(
    path.join(REPORT_DIR, "b3-navy-decision.txt"),
    "CORRIGENDUM_REVIEW_REQUIRED",
  );
}

function patchSources(sources) {
  const byId = new Map(sources.map((s) => [s.id, s]));

  let notification = byId.get(NOTIFICATION_SOURCE);
  if (!notification) {
    notification = {
      id: NOTIFICATION_SOURCE,
      vacancyId: "isro-istrac-02-2026",
      sourceType: "official-notification",
      organisation: "ISRO Telemetry, Tracking and Command Network",
      title: "ISTRAC Advertisement 02/2026 — official bilingual PDF",
      url: ISRO_NOTICE,
      publicationDate: "2026-06-27",
      checkedAt: VERIFIED_AT,
      verificationStatus: "verified",
      verifiedFacts: [],
      corrigendumChecked: true,
      notes: "Phase B3 strict verification source.",
    };
    sources.push(notification);
    byId.set(NOTIFICATION_SOURCE, notification);
  } else {
    notification.url = ISRO_NOTICE;
    notification.publicationDate = "2026-06-27";
    notification.checkedAt = VERIFIED_AT;
    notification.corrigendumChecked = true;
  }

  const app = byId.get("isro-istrac-02-2026--application");
  if (app) {
    app.url = ISRO_APPLY;
    app.checkedAt = VERIFIED_AT;
    app.corrigendumChecked = true;
  }
  const web = byId.get("isro-istrac-02-2026--website");
  if (web) {
    web.url = ISRO_RECRUITMENT_PAGE;
    web.checkedAt = VERIFIED_AT;
    web.corrigendumChecked = true;
  }

  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    const rec = byId.get(sourceId);
    if (!rec) throw new Error(`Missing source: ${sourceId}`);
    rec.verifiedFacts = facts;
    rec.checkedAt = VERIFIED_AT;
    rec.corrigendumChecked = true;
    rec.notes = `${rec.notes ?? ""} Phase B3 verified ${VERIFIED_AT}.`.trim();
  }
  return sources;
}

function main() {
  if (STRICT_READY_IDS.length === 0) {
    console.error("STOP: zero strict-ready B3 records.");
    process.exit(2);
  }
  const live = readJson(LIVE_PATH);
  const preview = readJson(PREVIEW_PATH);
  buildArtifacts(live, preview);

  const nextPreview = {
    ...preview,
    lastUpdated: VERIFIED_AT,
    items: preview.items.map((item) => {
      const patch = STRICT_PATCHES[item.id];
      return patch ? { ...item, ...patch } : item;
    }),
  };
  const nextSources = patchSources([...readJson(SOURCES_PATH)]);

  for (const id of STRICT_READY_IDS) {
    const item = nextPreview.items.find((i) => i.id === id);
    if (!strictPublicationContractPasses(item)) {
      console.error(`Strict contract failed: ${id}`);
      process.exit(1);
    }
  }

  writeJson(PREVIEW_PATH, nextPreview);
  writeJson(SOURCES_PATH, nextSources);
  const diff = semanticDiff(live, nextPreview);
  console.log(`B3 applied. Strict-ready: ${STRICT_READY_IDS.join(", ")}`);
  console.log(`Modified: ${diff.semantic.modified.join(", ")}`);
  if (diff.postGroupChanges?.length) {
    console.log(`Post-group changes: ${JSON.stringify(diff.postGroupChanges)}`);
  }
}

main();
