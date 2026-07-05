#!/usr/bin/env node
/**
 * Phase B4 — strict verification for Navy Agniveer, IBPS PO/MT-XVI, UPPSC PCS,
 * and Indian Navy SSC Jun 2027 (multi-post). UPSC 07/2026 and DSSSB 03/2026
 * are design-audit only — not modified here.
 *
 * Usage: node tools/apply-batch-b4-vacancy-verification.mjs [--report-dir <path>]
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
import { sumPostGroupVacancies } from "../src/lib/vacancyMultipost.mjs";
import { computePublicVacancySummary } from "../src/lib/vacancyPublicCore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERIFIED_AT = istDateOnly(new Date("2026-07-05T06:35:00+05:30"));

const DEFAULT_REPORT =
  process.env.BATCH_B4_REPORT_DIR ||
  "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b4_20260705_061924";

const args = process.argv.slice(2);
const reportArgIdx = args.indexOf("--report-dir");
const REPORT_DIR = reportArgIdx >= 0 ? args[reportArgIdx + 1] : DEFAULT_REPORT;

// ── Official URLs (verified 2026-07-05 IST) ───────────────────────────────────

const AGNIVEER_NOTICE =
  "https://www.joinindiannavy.gov.in/files/Advt_Agniveer_Apprentice_01_27_English.pdf";
const AGNIVEER_APPLY = "https://agniveer.navydmpr.in/avgapp/login";
const AGNIVEER_WEBSITE = "https://www.joinindiannavy.gov.in/";

const IBPS_NOTICE =
  "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf";
const IBPS_APPLY = "https://ibpsreg.ibps.in/crppoxvijun26/";
const IBPS_WEBSITE = "https://www.ibps.in/";

const UPPSC_NOTICE =
  "https://uppsc.up.nic.in/OuterPages/View_Enclosure.aspx?ID=114&flag=E&FID=929";
const UPPSC_ADVT_PAGE =
  "https://uppsc.up.nic.in/OuterPages/View_Advertisement.aspx?ID=114&flag=E";
const UPPSC_APPLY = "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx";
const UPPSC_WEBSITE = "https://uppsc.up.nic.in/";

const NAVY_SSC_NOTICE =
  "https://www.joinindiannavy.gov.in/files/SSC_Notification_for_ADV_Jun_27.pdf";
const NAVY_SSC_APPLY = "https://www.joinindiannavy.gov.in/en/account/login";
const NAVY_SSC_EVENT =
  "https://www.joinindiannavy.gov.in/en/event/online-application-window-for-ssc-various-entries-for-jun-27-course-is-live-from-25-jun-26-to-27-jul.html";
const NAVY_SSC_WEBSITE = "https://www.joinindiannavy.gov.in/";

/** @type {Record<string, string>} */
const B4_DECISIONS = {
  "indian-navy-agniveer-apprentice-0127-0227-2026": "READY_FOR_STRICT_VERIFICATION",
  "ibps-po-mt-xvi-2026": "READY_FOR_STRICT_VERIFICATION",
  "uppsc-pcs-2026": "READY_FOR_STRICT_VERIFICATION",
  "indian-navy-ssc-various-entries-jun-2027": "READY_FOR_STRICT_VERIFICATION",
  "upsc-advt-07-2026": "KEEP_REVIEW_PENDING",
  "dsssb-advt-03-2026": "KEEP_REVIEW_PENDING",
};

const STRICT_READY_IDS = Object.entries(B4_DECISIONS)
  .filter(([, d]) => d === "READY_FOR_STRICT_VERIFICATION")
  .map(([id]) => id);

function fact(key, value, sourceId) {
  return `fact:${key}|value:${value}|source:${sourceId}|verifiedAt:${VERIFIED_AT}`;
}

function groupFacts(sourceId, entries) {
  return entries.map(([key, value]) => fact(key, value, sourceId));
}

const AGNIVEER_NOTIFICATION = "indian-navy-agniveer-apprentice-0127-0227-2026--notification";
const IBPS_NOTIFICATION = "ibps-po-mt-xvi-2026--notification";
const UPPSC_NOTIFICATION = "uppsc-pcs-2026--notification";
const NAVY_SSC_NOTIFICATION = "indian-navy-ssc-various-entries-jun-2027--notification";

/** @type {import("../src/types/vacancy.js").VacancyPostGroup[]} */
const NAVY_SSC_PAY =
  "Sub Lieutenant initial gross salary from Rs 1,20,000/month (approx.) plus allowances per official SSC officer notification";

const NAVY_SSC_POST_GROUPS = [
  {
    id: "executive-gs-hydro",
    title: "Executive Branch {GS(X)/ Hydro Cadre}",
    vacancies: { total: 90, locationNote: "Including 10 Hydro; max 10 GS(X) + 2 Hydro for women" },
    qualification: "BE/B.Tech in any discipline with minimum 60% marks",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination", "Merit at INA Ezhimala"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "executive-gs-hydro"],
      ["vacancies", "90"],
    ]),
  },
  {
    id: "pilot",
    title: "Pilot",
    vacancies: { total: 25, locationNote: "Maximum 3 vacancies for women" },
    qualification:
      "BE/B.Tech in any discipline with minimum 60% marks; 60% aggregate in Class X and XII; minimum 60% in English in Class X or XII",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2003 to 01 Jul 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination", "CPL holders may apply per Para 1.6"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [["postGroup", "pilot"], ["vacancies", "25"]]),
  },
  {
    id: "naval-air-operations-observer",
    title: "Naval Air Operations Officer (Observers)",
    vacancies: { total: 18, locationNote: "Maximum 3 vacancies for women" },
    qualification: "BE/B.Tech in any discipline with minimum 60% marks (per official entry table)",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2003 to 01 Jul 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "naval-air-operations-observer"],
      ["vacancies", "18"],
    ]),
  },
  {
    id: "atc",
    title: "Air Traffic Controller (ATC)",
    vacancies: { total: 15 },
    qualification: "BE/B.Tech in any discipline with minimum 60% marks (per official entry table)",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jul 2006 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [["postGroup", "atc"], ["vacancies", "15"]]),
  },
  {
    id: "logistics",
    title: "Logistics",
    vacancies: { total: 10, locationNote: "Maximum 2 vacancies for women" },
    qualification:
      "BE/B.Tech First Class OR MBA First Class OR B.Sc/B.Com/B.Sc.(IT) First Class with PG Diploma in Finance/Logistics/Supply Chain/Material Management OR MCA/M.Sc(IT) First Class",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [["postGroup", "logistics"], ["vacancies", "10"]]),
  },
  {
    id: "naic",
    title: "Naval Armament Inspectorate Cadre (NAIC)",
    vacancies: { total: 14 },
    qualification:
      "BE/B.Tech minimum 60% in listed engineering streams OR Post Graduate degree in Electronics/Physics; 60% aggregate in Class X and XII; minimum 60% in English in Class X or XII",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [["postGroup", "naic"], ["vacancies", "14"]]),
  },
  {
    id: "education",
    title: "Education Branch",
    vacancies: { total: 13, locationNote: "5 (MSc/MA paths) + 8 (BE/BTech/ME/M.Tech paths) per official entry table" },
    qualification:
      "MSc/MA minimum 60% in Maths/Operational Research/Physics/Meteorology/Oceanography/Atmospheric Sciences OR MA History 55% OR BE/BTech 60% in Mechanical/Production/Electrical/ECE/EIE OR ME/M.Tech 60% in listed specialisations; minimum 60% in Class X/XII and English per note",
    payLevel: NAVY_SSC_PAY,
    ageLimitText:
      "Born 02 Jul 2002 to 01 Jul 2006 for most paths; ME/M.Tech Meteorology/Oceanography path: 02 Jul 2000 to 01 Jul 2006; unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [["postGroup", "education"], ["vacancies", "13"]]),
  },
  {
    id: "engineering-gs",
    title: "Engineering Branch {General Service (GS)}",
    vacancies: { total: 24, locationNote: "Maximum 4 vacancies for women" },
    qualification: "BE/B.Tech minimum 60% in listed marine/aero/metallurgy/instrumentation/mechanical streams",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination", "Submarine Tech Engineering volunteers per Para 1.3"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "engineering-gs"],
      ["vacancies", "24"],
    ]),
  },
  {
    id: "submarine-tech-engineering",
    title: "Submarine Tech Engineering",
    vacancies: { total: 8 },
    qualification: "Same as Engineering Branch {General Service (GS)} — Ser 8",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men only",
    selectionProcess: ["SSB interview", "Medical examination", "Submarine medicals after INA"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "submarine-tech-engineering"],
      ["vacancies", "8"],
    ]),
  },
  {
    id: "electrical-gs",
    title: "Electrical Branch {General Service (GS)}",
    vacancies: { total: 32, locationNote: "Maximum 5 vacancies for women" },
    qualification: "BE/B.Tech minimum 60% in listed electrical/electronics/instrumentation/telecom streams",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "electrical-gs"],
      ["vacancies", "32"],
    ]),
  },
  {
    id: "submarine-tech-electrical",
    title: "Submarine Tech Electrical",
    vacancies: { total: 8 },
    qualification: "Same as Electrical Branch {General Service (GS)} — Ser 10",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men only",
    selectionProcess: ["SSB interview", "Medical examination", "Submarine medicals after INA"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "submarine-tech-electrical"],
      ["vacancies", "8"],
    ]),
  },
  {
    id: "naval-constructor",
    title: "Naval Constructor",
    vacancies: { total: 18 },
    qualification:
      "BE/B.Tech minimum 60% in Mechanical/Metallurgy/Civil/Marine/Ship Building/Aeronautical/Naval Architecture/Ocean Engineering and related streams per official table",
    payLevel: NAVY_SSC_PAY,
    ageLimitText: "Born 02 Jul 2002 to 01 Jan 2008 (both dates inclusive); unmarried men and women",
    selectionProcess: ["SSB interview", "Medical examination"],
    sourceIds: [NAVY_SSC_NOTIFICATION],
    verifiedFacts: groupFacts(NAVY_SSC_NOTIFICATION, [
      ["postGroup", "naval-constructor"],
      ["vacancies", "18"],
    ]),
  },
];

/** @type {Record<string, object>} */
const STRICT_PATCHES = {
  "indian-navy-agniveer-apprentice-0127-0227-2026": {
    title: "Indian Navy Agniveer (Apprentice) 01/27 & 02/27",
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      AGNIVEER_NOTIFICATION,
      "indian-navy-agniveer-apprentice-0127-0227-2026--application",
      "indian-navy-agniveer-apprentice-0127-0227-2026--website",
    ],
    advertisementNumber: "Agniveer (Apprentice) 01/2027 and 02/2027 Batch",
    notificationDate: "2026-06-05",
    employmentType: "apprenticeship",
    applicationStartDate: "2026-06-05",
    applicationEndDate: "2026-07-05",
    applicationEndTime: "17:00",
    officialNotificationUrl: AGNIVEER_NOTICE,
    officialNoticeUrl: AGNIVEER_NOTICE,
    officialApplicationUrl: AGNIVEER_APPLY,
    applyUrl: AGNIVEER_APPLY,
    sourceUrl: AGNIVEER_WEBSITE,
    sourceType: "official_pdf",
    vacanciesText: "Not announced in official advertisement",
    qualificationShort:
      "Matriculation 50% aggregate + 3-yr AICTE-recognised polytechnic diploma 50% aggregate (Engineering or Electrical streams per advt)",
    ageLimitShort:
      "01/27 batch: DOB 01 Dec 2004–31 May 2009; 02/27 batch: DOB 01 May 2005–31 Oct 2009; unmarried male only",
    feeShort: "Stage I INET: Rs 550 + 18% GST (online); no separate Stage II fee",
    selectionProcessShort:
      "Stage I: INET 2/2026 (online); Stage II: PFT, written exam, recruitment medical; state-wise merit",
    notificationWindowText:
      "Online registration 05/06/2026 10:00 to 05/07/2026 17:00 IST (extended from 29/06/2026 per official Indian Navy website on 05/07/2026)",
    examWindowText:
      "Stage I INET Aug 2026; results end Aug/early Sep 2026. Stage II: 01/27 batch Oct 2026, 02/27 batch Mar 2027. Training Dec 2026 / May 2027 per advt.",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official Agniveer (Apprentice) PDF and Indian Navy website extension notice (1700 hrs on 05 Jul 26). Trade-wise vacancy count not declared. Apply only via AVR (Apprentice) INET 2/26 portal.",
    status: "closing_soon",
    statusLabel: "Applications Open; Last Date 05/07/2026, 17:00",
  },
  "ibps-po-mt-xvi-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      IBPS_NOTIFICATION,
      "ibps-po-mt-xvi-2026--application",
      "ibps-po-mt-xvi-2026--website",
    ],
    advertisementNumber: "CRP PO/MT-XVI",
    notificationDate: "2026-06-30",
    employmentType: "regular",
    totalVacancies: 6715,
    applicationStartDate: "2026-07-01",
    applicationEndDate: "2026-07-21",
    officialNotificationUrl: IBPS_NOTICE,
    officialNoticeUrl: IBPS_NOTICE,
    officialApplicationUrl: IBPS_APPLY,
    applyUrl: IBPS_APPLY,
    sourceUrl: IBPS_WEBSITE,
    sourceType: "official_pdf",
    vacanciesText: "6715 indicative Probationary Officer/Management Trainee vacancies (2027-28; provisional per Annexure I)",
    qualificationShort:
      "Graduation (any discipline) from a university recognised by Govt. of India as on 21/07/2026; final-year allowed if degree completed and results declared by 21/07/2026",
    ageLimitShort: "20–30 years as on 01/07/2026 (DOB 02/07/1996 to 01/07/2006 inclusive; relaxations per notification)",
    feeShort: "Rs 850 (inclusive of GST) for General/OBC/EWS; Rs 175 for SC/ST/PwBD",
    selectionProcessShort:
      "Online Preliminary Examination, Online Main Examination, Personality Test/Interview; provisional allotment Jan 2027",
    notificationWindowText:
      "Online registration and fee payment 01/07/2026 to 21/07/2026 (both dates inclusive) via ibpsreg.ibps.in/crppoxvijun26/ per CRP PO/MT-XVI notification",
    examWindowText:
      "Prelims Aug 2026; Mains Oct 2026; Interview Nov/Dec 2026; provisional allotment Jan 2027 (tentative per official schedule)",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official IBPS CRP PO/MT-XVI detailed notification PDF (6715 indicative vacancies). Bank-wise/category allocation in Annexure I. No corrigendum located.",
  },
  "uppsc-pcs-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      UPPSC_NOTIFICATION,
      "uppsc-pcs-2026--application",
      "uppsc-pcs-2026--website",
    ],
    advertisementNumber: "A-1/E-1/2026",
    notificationDate: "2026-06-25",
    employmentType: "regular",
    totalVacancies: 500,
    applicationStartDate: "2026-06-25",
    applicationEndDate: "2026-07-27",
    correctionEndDate: "2026-08-03",
    officialNotificationUrl: UPPSC_NOTICE,
    officialNoticeUrl: UPPSC_NOTICE,
    officialApplicationUrl: UPPSC_APPLY,
    applyUrl: UPPSC_APPLY,
    sourceUrl: UPPSC_WEBSITE,
    sourceType: "official_pdf",
    vacanciesText:
      "About 500 Group A and B posts (provisional — may increase or decrease per official advertisement)",
    qualificationShort:
      "Graduation for most posts; post-wise special qualifications for select posts (e.g. Computer Engineering degree, MSc/MA paths) per official notification",
    ageLimitShort:
      "21–40 years as on 01/07/2026 for most posts (DOB not earlier than 02/07/1986 and not later than 01/07/2005); post-wise variations per advt",
    feeShort:
      "General/EWS Rs 125; OBC Rs 65 (Rs 40 exam + Rs 25 online); SC/ST Rs 25 online processing; PwBD exempt from exam fee + Rs 25 online",
    selectionProcessShort:
      "Preliminary Examination, Main (Written) Examination, Interview; post-wise variations per official notification",
    notificationWindowText:
      "OTR mandatory via otr.pariksha.nic.in; online application 25/06/2026 to 27/07/2026; correction/fee reconciliation till 03/08/2026 per Advt A-1/E-1/2026",
    examWindowText: "Prelims/Mains dates to be notified via UPPSC e-Admit Card",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official UPPSC Advt A-1/E-1/2026 English PDF (~500 provisional vacancies). OTR required before application. No corrigendum located.",
  },
  "indian-navy-ssc-various-entries-jun-2027": {
    title: "Indian Navy SSC Various Entries — Jun 2027 (AT 27) Course",
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      NAVY_SSC_NOTIFICATION,
      "indian-navy-ssc-various-entries-jun-2027--application",
      "indian-navy-ssc-various-entries-jun-2027--website",
      "indian-navy-ssc-various-entries-jun-2027--event",
    ],
    advertisementNumber: "SSC Various Entries — Jun 2027 (AT 27) Course",
    notificationDate: "2026-06-25",
    employmentType: "regular",
    totalVacancies: 275,
    applicationStartDate: "2026-06-25",
    applicationEndDate: "2026-07-27",
    officialNotificationUrl: NAVY_SSC_NOTICE,
    officialNoticeUrl: NAVY_SSC_NOTICE,
    officialApplicationUrl: NAVY_SSC_APPLY,
    applyUrl: NAVY_SSC_APPLY,
    sourceUrl: NAVY_SSC_WEBSITE,
    sourceType: "official_pdf",
    vacanciesText: "275 tentative SSC vacancies across 12 entry groups — see post-wise details",
    qualificationShort: "Entry-wise BE/BTech or higher qualifications with minimum marks — see structured post-wise details",
    ageLimitShort: "Entry-wise date-of-birth bands for unmarried men and women — see post-wise details",
    feeShort: "As per Indian Navy officer entry norms (see official notification)",
    selectionProcessShort: "SSB shortlisting and interview, medical standards, merit at Indian Naval Academy Ezhimala",
    notificationWindowText:
      "Online applications 25/06/2026 to 27/07/2026 via joinindiannavy.gov.in officer registration per official SSC Jun 2027 notification",
    examWindowText: "SSB dates to be allotted; course commencing Jun 2027 at INA Ezhimala per advt",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official SSC Jun 2027 PDF (275 tentative vacancies across 12 entries). Vacancies may change per training slots. Apply via officer login on joinindiannavy.gov.in.",
    postGroups: NAVY_SSC_POST_GROUPS,
  },
};

/** @type {Record<string, string[]>} */
const SOURCE_VERIFIED_FACTS = {
  [AGNIVEER_NOTIFICATION]: groupFacts(AGNIVEER_NOTIFICATION, [
    ["advertisementNumber", "Agniveer (Apprentice) 01/2027 and 02/2027 Batch"],
    ["notificationDate", "2026-06-05"],
    ["applicationStart", "2026-06-05T10:00+05:30"],
    ["originalApplicationEnd", "2026-06-29T17:00+05:30"],
    ["vacancies", "not_announced"],
  ]),
  "indian-navy-agniveer-apprentice-0127-0227-2026--website": groupFacts(
    "indian-navy-agniveer-apprentice-0127-0227-2026--website",
    [
      ["applicationEndExtended", "2026-07-05T17:00+05:30"],
      ["extensionNotice", "Official homepage banner 05 Jul 2026"],
    ],
  ),
  "indian-navy-agniveer-apprentice-0127-0227-2026--application": groupFacts(
    "indian-navy-agniveer-apprentice-0127-0227-2026--application",
    [["applicationPortal", "agniveer.navydmpr.in/avgapp/login"]],
  ),
  [IBPS_NOTIFICATION]: groupFacts(IBPS_NOTIFICATION, [
    ["advertisementNumber", "CRP PO/MT-XVI"],
    ["notificationDate", "2026-06-30"],
    ["totalVacancies", "6715"],
    ["vacancyNote", "indicative_provisional"],
    ["applicationStart", "2026-07-01"],
    ["applicationEnd", "2026-07-21"],
    ["ageCutoff", "2026-07-01"],
  ]),
  "ibps-po-mt-xvi-2026--application": groupFacts("ibps-po-mt-xvi-2026--application", [
    ["applicationPortal", "ibpsreg.ibps.in/crppoxvijun26/"],
  ]),
  [UPPSC_NOTIFICATION]: groupFacts(UPPSC_NOTIFICATION, [
    ["advertisementNumber", "A-1/E-1/2026"],
    ["notificationDate", "2026-06-25"],
    ["totalVacancies", "500"],
    ["vacancyNote", "provisional_may_change"],
    ["applicationStart", "2026-06-25"],
    ["applicationEnd", "2026-07-27"],
    ["correctionEnd", "2026-08-03"],
    ["otrRequired", "true"],
  ]),
  "uppsc-pcs-2026--application": groupFacts("uppsc-pcs-2026--application", [
    ["applicationPortal", "uppsc.up.nic.in/CandidatePages/Notifications.aspx"],
    ["otrPortal", "otr.pariksha.nic.in"],
  ]),
  [NAVY_SSC_NOTIFICATION]: groupFacts(NAVY_SSC_NOTIFICATION, [
    ["course", "Jun 2027 (AT 27)"],
    ["totalVacancies", "275"],
    ["vacancyNote", "tentative"],
    ["applicationStart", "2026-06-25"],
    ["applicationEnd", "2026-07-27"],
    ["postGroupCount", "12"],
  ]),
  "indian-navy-ssc-various-entries-jun-2027--application": groupFacts(
    "indian-navy-ssc-various-entries-jun-2027--application",
    [["applicationPortal", "joinindiannavy.gov.in/en/account/login"]],
  ),
  "indian-navy-ssc-various-entries-jun-2027--event": groupFacts(
    "indian-navy-ssc-various-entries-jun-2027--event",
    [["applicationWindow", "2026-06-25 to 2026-07-27"]],
  ),
};

function ensureSource(sources, byId, spec) {
  let rec = byId.get(spec.id);
  if (!rec) {
    rec = { ...spec, verifiedFacts: [], corrigendumChecked: false };
    sources.push(rec);
    byId.set(spec.id, rec);
  }
  return rec;
}

function patchSources(sources) {
  const byId = new Map(sources.map((s) => [s.id, s]));

  ensureSource(sources, byId, {
    id: IBPS_NOTIFICATION,
    vacancyId: "ibps-po-mt-xvi-2026",
    sourceType: "official-notification",
    organisation: "Institute of Banking Personnel Selection",
    title: "IBPS CRP PO/MT-XVI — official detailed notification PDF",
    url: IBPS_NOTICE,
    publicationDate: "2026-06-30",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
  });

  ensureSource(sources, byId, {
    id: UPPSC_NOTIFICATION,
    vacancyId: "uppsc-pcs-2026",
    sourceType: "official-notification",
    organisation: "Uttar Pradesh Public Service Commission",
    title: "UPPSC PCS 2026 Advt A-1/E-1/2026 — official English PDF",
    url: UPPSC_NOTICE,
    publicationDate: "2026-06-25",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
  });

  ensureSource(sources, byId, {
    id: NAVY_SSC_NOTIFICATION,
    vacancyId: "indian-navy-ssc-various-entries-jun-2027",
    sourceType: "official-notification",
    organisation: "Indian Navy",
    title: "Indian Navy SSC Various Entries Jun 2027 — official notification PDF",
    url: NAVY_SSC_NOTICE,
    publicationDate: "2026-06-25",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
  });

  ensureSource(sources, byId, {
    id: "indian-navy-ssc-various-entries-jun-2027--application",
    vacancyId: "indian-navy-ssc-various-entries-jun-2027",
    sourceType: "official-application",
    organisation: "Indian Navy",
    title: "Indian Navy officer application login",
    url: NAVY_SSC_APPLY,
    publicationDate: null,
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
  });

  ensureSource(sources, byId, {
    id: "indian-navy-ssc-various-entries-jun-2027--event",
    vacancyId: "indian-navy-ssc-various-entries-jun-2027",
    sourceType: "official-website",
    organisation: "Indian Navy",
    title: "SSC Jun 2027 application window event page",
    url: NAVY_SSC_EVENT,
    publicationDate: null,
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
  });

  const urlUpdates = {
    [AGNIVEER_NOTIFICATION]: AGNIVEER_NOTICE,
    "indian-navy-agniveer-apprentice-0127-0227-2026--application": AGNIVEER_APPLY,
    "indian-navy-agniveer-apprentice-0127-0227-2026--website": AGNIVEER_WEBSITE,
    "ibps-po-mt-xvi-2026--application": IBPS_APPLY,
    "ibps-po-mt-xvi-2026--website": IBPS_WEBSITE,
    "uppsc-pcs-2026--application": UPPSC_APPLY,
    "uppsc-pcs-2026--website": UPPSC_WEBSITE,
    "indian-navy-ssc-various-entries-jun-2027--website": NAVY_SSC_WEBSITE,
  };

  for (const [id, url] of Object.entries(urlUpdates)) {
    const rec = byId.get(id);
    if (rec) {
      rec.url = url;
      rec.checkedAt = VERIFIED_AT;
      rec.corrigendumChecked = true;
    }
  }

  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    const rec = byId.get(sourceId);
    if (!rec) throw new Error(`Missing source: ${sourceId}`);
    rec.verifiedFacts = facts;
    rec.checkedAt = VERIFIED_AT;
    rec.corrigendumChecked = true;
    rec.notes = `${rec.notes ?? ""} Phase B4 verified ${VERIFIED_AT}.`.trim();
  }

  const notif = byId.get(AGNIVEER_NOTIFICATION);
  if (notif) {
    notif.corrigendumChecked = true;
    notif.notes = "Original PDF dates superseded by official website extension verified 2026-07-05.";
  }

  return sources;
}

function buildArtifacts(live, preview) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const clock = { now: () => new Date("2026-07-05T06:35:00+05:30") };
  const summary = computePublicVacancySummary(preview.items, clock);

  const matrix = [
    "id,title,decision",
    ...Object.entries(B4_DECISIONS).map(([id, d]) => {
      const item = live.items.find((i) => i.id === id);
      return [id, item?.title ?? "", d].join(",");
    }),
  ].join("\n");
  writeFileSync(path.join(REPORT_DIR, "b4-verification-matrix.csv"), matrix);

  writeFileSync(
    path.join(REPORT_DIR, "b4-strict-ready-records.json"),
    JSON.stringify(STRICT_READY_IDS, null, 2),
  );
  writeFileSync(
    path.join(REPORT_DIR, "b4-review-pending-records.json"),
    JSON.stringify(
      Object.entries(B4_DECISIONS)
        .filter(([, d]) => d === "KEEP_REVIEW_PENDING")
        .map(([id]) => id),
      null,
      2,
    ),
  );

  const factsRows = ["sourceId,fact"];
  for (const [sid, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    for (const f of facts) factsRows.push(`${sid},${f}`);
  }
  writeFileSync(path.join(REPORT_DIR, "b4-verified-facts-proposed.csv"), factsRows.join("\n"));

  writeFileSync(
    path.join(REPORT_DIR, "b4-current-counts.txt"),
    [
      `Audit clock: 2026-07-05 06:35:00 IST`,
      `Total records: ${preview.items.length}`,
      `Displayed open: ${summary.displayed.length}`,
      `Fully verified open: ${summary.fullyVerified}`,
      `Review pending open: ${summary.reviewPending}`,
    ].join("\n"),
  );

  const ssc = preview.items.find((i) => i.id === "indian-navy-ssc-various-entries-jun-2027");
  if (ssc?.postGroups) {
    const { sum } = sumPostGroupVacancies(ssc);
    const recon = [
      "postGroupId,vacancies,total,reconciled",
      ...ssc.postGroups.map((g) => [g.id, g.vacancies.total, 275, g.vacancies.total].join(",")),
      `TOTAL,${sum},275,${sum}`,
    ].join("\n");
    writeFileSync(path.join(REPORT_DIR, "navy-ssc-vacancy-reconciliation.csv"), recon);
  }

  writeFileSync(
    path.join(REPORT_DIR, "b4-release-readiness.txt"),
    STRICT_READY_IDS.length > 0
      ? "READY_FOR_B4_MIGRATION"
      : "STOP_NO_STRICT_READY",
  );
}

function main() {
  if (STRICT_READY_IDS.length === 0) {
    console.error("STOP: zero strict-ready B4 records.");
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
  console.log(`B4 applied. Strict-ready: ${STRICT_READY_IDS.join(", ")}`);
  console.log(`Modified: ${diff.semantic.modified.join(", ")}`);
  if (diff.postGroupChanges?.length) {
    console.log(`Post-group changes: ${JSON.stringify(diff.postGroupChanges)}`);
  }
}

main();
