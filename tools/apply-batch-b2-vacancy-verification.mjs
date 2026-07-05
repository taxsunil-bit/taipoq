#!/usr/bin/env node
/**
 * Phase B2 — strict verification for the next safe vacancy batch.
 * Usage: node tools/apply-batch-b2-vacancy-verification.mjs [--report-dir <path>]
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
const VERIFIED_AT = istDateOnly(new Date("2026-07-05T00:30:00+05:30"));

const DEFAULT_REPORT =
  process.env.BATCH_B2_REPORT_DIR ||
  "C:\\Users\\dell\\Desktop\\taipoq reports\\vacancy_batch_b2_20260705_055157";

const args = process.argv.slice(2);
const reportArgIdx = args.indexOf("--report-dir");
const REPORT_DIR = reportArgIdx >= 0 ? args[reportArgIdx + 1] : DEFAULT_REPORT;

/** @type {Record<string, string>} */
const B2_DECISIONS = {
  "rrb-technician-cen-02-2026": "READY_FOR_STRICT_VERIFICATION",
  "gujarat-hc-legal-assistant-2026": "READY_FOR_STRICT_VERIFICATION",
  "isro-istrac-02-2026": "SCHEMA_BLOCKED",
  "drdo-deal-apprentice-2026-27": "READY_FOR_STRICT_VERIFICATION",
  "indian-navy-agniveer-apprentice-0127-0227-2026": "CORRIGENDUM_REVIEW_REQUIRED",
  "delhi-hjs-examination-2026": "READY_FOR_STRICT_VERIFICATION",
};

const STRICT_READY_IDS = Object.entries(B2_DECISIONS)
  .filter(([, d]) => d === "READY_FOR_STRICT_VERIFICATION")
  .map(([id]) => id);

function fact(key, value, sourceId) {
  return `fact:${key}|value:${value}|source:${sourceId}|verifiedAt:${VERIFIED_AT}`;
}

const RRB_NOTICE =
  "https://www.rrbranchi.gov.in/upload/files/pdf/09_07_06pm04776926682e2fd15200721eacbac1c3.pdf";
const GUJARAT_NOTICE =
  "https://gujarathighcourt.nic.in/hccms/sites/default/files/Recruitment_files/999_999_2026_6_29_645.pdf";
const DRDO_NOTICE = "https://drdo.gov.in/drdo/sites/default/files/vacancy/advtDEAL23062026.pdf";
const DELHI_NOTICE = "https://delhihighcourt.nic.in/files/2026-07/adv-eng_dhjs-2026.pdf";
const DELHI_APPLY = "https://applycareer.co.in/DHC/HighCourt2026DHJSE/";

/** @type {Record<string, object>} */
const STRICT_PATCHES = {
  "rrb-technician-cen-02-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      "rrb-technician-cen-02-2026--notification",
      "rrb-technician-cen-02-2026--application",
      "rrb-technician-cen-02-2026--website",
    ],
    advertisementNumber: "CEN 02/2026",
    notificationDate: "2026-05-23",
    totalVacancies: 6557,
    officialNotificationUrl: RRB_NOTICE,
    officialNoticeUrl: RRB_NOTICE,
    officialApplicationUrl: "https://www.rrbapply.gov.in/",
    applyUrl: "https://www.rrbapply.gov.in/",
    qualificationShort:
      "Grade-I Signal (323): B.Sc (Physics/Electronics/CS/IT/Instrumentation) or Diploma/Degree in Engineering in relevant streams; Grade-III (6234): Matriculation/SSLC + NCVT/SCVT ITI in post-specific trade OR completed Act Apprenticeship in that trade per CEN 02/2026",
    ageLimitShort:
      "Grade-I Signal: 18–33 years; Grade-III: 18–30 years as on 01.07.2026 (relaxations per CEN)",
    feeShort:
      "Rs 500 (Rs 400 refunded after appearing in CBT, minus bank charges); Rs 250 for SC/ST/Ex-Servicemen/PwBD/Female/Transgender/Minorities/EBC (Rs 250 refunded after CBT); fee exempt categories per CEN 02/2026",
    selectionProcessShort:
      "Computer Based Test (CBT), Document Verification, Medical Examination per CEN 02/2026",
    notificationWindowText:
      "Online applications 30.06.2026 to 29.07.2026 23:59 hrs IST via rrbapply.gov.in; fee payment till 31.07.2026 23:59; modification window 01.08.2026–10.08.2026 per CEN 02/2026",
    examWindowText: "CBT dates to be notified on participating RRB websites per CEN 02/2026",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official RRB CEN 02/2026 PDF (6557 vacancies: 323 Grade-I Signal + 6234 Grade-III). No corrigendum located. Apply only via rrbapply.gov.in.",
  },
  "gujarat-hc-legal-assistant-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      "gujarat-hc-legal-assistant-2026--notification",
      "gujarat-hc-legal-assistant-2026--application",
      "gujarat-hc-legal-assistant-2026--website",
    ],
    advertisementNumber: "RC/B/1320/2026 (LA)",
    notificationDate: "2026-06-29",
    totalVacancies: 65,
    officialNotificationUrl: GUJARAT_NOTICE,
    officialNoticeUrl: GUJARAT_NOTICE,
    officialApplicationUrl: "https://hc-ojas.gujarat.gov.in/",
    applyUrl: "https://hc-ojas.gujarat.gov.in/",
    qualificationShort:
      "Fresh law graduate with minimum 55% marks (or equivalent CGPA) from a UGC-recognized university; final-year 3-yr/5-yr LL.B. candidates may apply subject to passing with 55% before appointment; basic computer knowledge and Gujarati language required",
    ageLimitShort: "Not more than 26 years as on 20.07.2026 (last date of online application)",
    feeShort: "Rs 500 plus bank charges via SBI e-Pay on HC-OJAS portal",
    selectionProcessShort:
      "Objective-type written test (MCQs) on 09.08.2026; viva-voce in August/September 2026 per official advertisement",
    notificationWindowText:
      "Online applications 01.07.2026 12:00 hrs to 20.07.2026 23:59 hrs IST via hc-ojas.gujarat.gov.in",
    examWindowText: "Written test 09.08.2026 (Sunday); viva-voce August/September 2026",
    vacanciesText: "65 Legal Assistant posts on purely contractual basis",
    category: "Law / Legal Recruitment / Gujarat",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from Gujarat High Court Advertisement RC/B/1320/2026 (LA). Purely contractual engagement — Rs 60,000/month fixed remuneration, initial 11 months extendable up to 11 further months. Not a judicial service examination.",
  },
  "drdo-deal-apprentice-2026-27": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      "drdo-deal-apprentice-2026-27--notification",
      "drdo-deal-apprentice-2026-27--application",
      "drdo-deal-apprentice-2026-27--website",
    ],
    advertisementNumber: "DEAL/HRD/Apprenticeship/2026-27",
    notificationDate: "2026-06-23",
    totalVacancies: 77,
    applicationEndDate: "2026-07-23",
    statusLabel: "Applications Open; Last Date 23/07/2026",
    officialNotificationUrl: DRDO_NOTICE,
    officialNoticeUrl: DRDO_NOTICE,
    officialApplicationUrl: "https://nats.education.gov.in/",
    applyUrl: "https://nats.education.gov.in/",
    qualificationShort:
      "Graduate (19): B.E./B.Tech Electronics & Communication 60%; Diploma (8): Diploma in ECE/related 60%; ITI (50): NCVT/SCVT ITI in listed trades; qualifying exam passed in 2022–2026; higher qualifications not eligible per advt",
    ageLimitShort:
      "Minimum 18 years; maximum age and relaxations per Apprentices Act 1961 and NATS 2.0/NAPS guidelines",
    feeShort: "No application fee stated in official DEAL/HRD/Apprenticeship/2026-27 advertisement",
    selectionProcessShort:
      "Merit-based selection via NATS 2.0 (Graduate/Diploma) or NAPS (ITI); joining intimation by email to selected candidates",
    notificationWindowText:
      "Applications within 30 days of publication on drdo.gov.in (published 23.06.2026; last date 23.07.2026). Register on NATS 2.0 portal and apply against DEAL ID NUKDDC000015.",
    examWindowText: "No written exam; merit selection and email joining instructions per official advertisement",
    vacanciesText: "77 apprentices (19 Graduate + 8 Diploma + 50 ITI trades per advt)",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from official DEAL/HRD/Apprenticeship/2026-27 PDF. Apprenticeship training — not regular permanent employment. Stipend Rs 12,300/month. Apply via NATS 2.0 (https://nats.education.gov.in) for DEAL ID NUKDDC000015.",
  },
  "delhi-hjs-examination-2026": {
    lifecycleStatus: "published",
    verificationStatus: "verified",
    lastVerifiedAt: VERIFIED_AT,
    sourceIds: [
      "delhi-hjs-examination-2026--notification",
      "delhi-hjs-examination-2026--application",
      "delhi-hjs-examination-2026--website",
    ],
    advertisementNumber: "Delhi Higher Judicial Service Examination 2026",
    notificationDate: "2026-07-01",
    totalVacancies: 27,
    applicationEndTime: "17:30",
    officialNotificationUrl: DELHI_NOTICE,
    officialNoticeUrl: DELHI_NOTICE,
    officialApplicationUrl: DELHI_APPLY,
    applyUrl: DELHI_APPLY,
    sourceUrl: "https://delhihighcourt.nic.in/job-openings",
    vacanciesText: "27 vacancies (24 existing + 3 anticipated) for Delhi Higher Judicial Service",
    qualificationShort:
      "Advocate: minimum 7 years continuous practice as on 15.07.2026; Judicial Officer pathway: 7 years combined as Judicial Officer and Advocate per official advertisement",
    ageLimitShort: "Must have attained 35 years and not attained 45 years on last date of application (15.07.2026)",
    feeShort: "Rs 2,000 for General category; Rs 500 for SC/ST/PwBD (40%+ benchmark disability)",
    selectionProcessShort:
      "Preliminary Examination (objective, 25% negative marking), Mains Examination (written), Viva-voce per official advertisement",
    notificationWindowText:
      "Online applications 01.07.2026 from 10:00 hrs to 15.07.2026 17:30 hrs IST via official Delhi High Court application portal",
    examWindowText: "Preliminary, Mains and Viva-voce dates to be notified by Delhi High Court per official advertisement",
    sourceCheckedDate: VERIFIED_AT,
    trustNote:
      "Strict verification completed 2026-07-05 from Delhi High Court official advertisement PDF and apply portal link. Direct recruitment to Delhi Higher Judicial Service — not a local PLA notice.",
  },
};

/** @type {Record<string, string[]>} */
const SOURCE_VERIFIED_FACTS = {
  "rrb-technician-cen-02-2026--notification": [
    fact("advertisementNumber", "CEN 02/2026", "rrb-technician-cen-02-2026--notification"),
    fact("vacancyCount", "6557 (323 Grade-I Signal + 6234 Grade-III)", "rrb-technician-cen-02-2026--notification"),
    fact("applicationStartDate", "2026-06-30", "rrb-technician-cen-02-2026--notification"),
    fact("applicationEndDate", "2026-07-29", "rrb-technician-cen-02-2026--notification"),
    fact("applicationEndTime", "23:59 IST", "rrb-technician-cen-02-2026--notification"),
    fact("ageLimit", "Grade-I Signal 18-33; Grade-III 18-30 as on 01.07.2026", "rrb-technician-cen-02-2026--notification"),
    fact("ageCutoffDate", "2026-07-01", "rrb-technician-cen-02-2026--notification"),
    fact("qualification", "Grade-I Signal: B.Sc/Diploma/Degree in specified streams; Grade-III: Matriculation + ITI or Act Apprenticeship in post trade", "rrb-technician-cen-02-2026--notification"),
    fact("applicationFee", "Rs 500 (Rs 400 refund after CBT); Rs 250 for reserved categories (Rs 250 refund after CBT)", "rrb-technician-cen-02-2026--notification"),
    fact("employmentType", "regular railway technician recruitment", "rrb-technician-cen-02-2026--notification"),
    fact("selectionProcess", "CBT, Document Verification, Medical Examination", "rrb-technician-cen-02-2026--notification"),
    fact("payOrStipend", "Level 5 (Grade-I Signal); Level 2 (Grade-III) per 7th CPC in CEN", "rrb-technician-cen-02-2026--notification"),
  ],
  "rrb-technician-cen-02-2026--application": [
    fact("officialApplicationUrl", "https://www.rrbapply.gov.in/", "rrb-technician-cen-02-2026--application"),
    fact("applicationMode", "online via rrbapply.gov.in", "rrb-technician-cen-02-2026--application"),
  ],
  "gujarat-hc-legal-assistant-2026--notification": [
    fact("advertisementNumber", "RC/B/1320/2026 (LA)", "gujarat-hc-legal-assistant-2026--notification"),
    fact("employmentType", "contractual legal assistant (not judicial service examination)", "gujarat-hc-legal-assistant-2026--notification"),
    fact("vacancyCount", "65", "gujarat-hc-legal-assistant-2026--notification"),
    fact("applicationStartDate", "2026-07-01", "gujarat-hc-legal-assistant-2026--notification"),
    fact("applicationEndDate", "2026-07-20", "gujarat-hc-legal-assistant-2026--notification"),
    fact("applicationEndTime", "23:59 IST", "gujarat-hc-legal-assistant-2026--notification"),
    fact("ageLimit", "Not more than 26 years as on 20.07.2026", "gujarat-hc-legal-assistant-2026--notification"),
    fact("ageCutoffDate", "2026-07-20", "gujarat-hc-legal-assistant-2026--notification"),
    fact("qualification", "LL.B. minimum 55%; final-year law students may apply subject to 55% before appointment; computer and Gujarati required", "gujarat-hc-legal-assistant-2026--notification"),
    fact("applicationFee", "Rs 500 plus bank charges via SBI e-Pay", "gujarat-hc-legal-assistant-2026--notification"),
    fact("payOrStipend", "Rs 60000 per month fixed remuneration; initial 11 months extendable up to 11 months", "gujarat-hc-legal-assistant-2026--notification"),
    fact("selectionProcess", "Written test 09.08.2026; viva-voce Aug/Sep 2026", "gujarat-hc-legal-assistant-2026--notification"),
  ],
  "gujarat-hc-legal-assistant-2026--application": [
    fact("officialApplicationUrl", "https://hc-ojas.gujarat.gov.in/", "gujarat-hc-legal-assistant-2026--application"),
    fact("applicationMode", "online via HC-OJAS portal", "gujarat-hc-legal-assistant-2026--application"),
  ],
  "drdo-deal-apprentice-2026-27--notification": [
    fact("advertisementNumber", "DEAL/HRD/Apprenticeship/2026-27", "drdo-deal-apprentice-2026-27--notification"),
    fact("employmentType", "apprenticeship training (not regular permanent employment)", "drdo-deal-apprentice-2026-27--notification"),
    fact("vacancyCount", "77 (19 Graduate + 8 Diploma + 50 ITI)", "drdo-deal-apprentice-2026-27--notification"),
    fact("applicationStartDate", "2026-06-23", "drdo-deal-apprentice-2026-27--notification"),
    fact("applicationEndDate", "2026-07-23", "drdo-deal-apprentice-2026-27--notification"),
    fact("qualification", "Graduate/Diploma/ITI in specified ECE and related trades with 60% marks; pass year 2022-2026", "drdo-deal-apprentice-2026-27--notification"),
    fact("ageLimit", "Minimum 18 years; maximum per Apprentices Act 1961 and NATS/NAPS", "drdo-deal-apprentice-2026-27--notification"),
    fact("payOrStipend", "Rs 12300 per month", "drdo-deal-apprentice-2026-27--notification"),
    fact("applicationMode", "NATS 2.0 portal; DEAL ID NUKDDC000015", "drdo-deal-apprentice-2026-27--notification"),
    fact("selectionProcess", "Merit-based; joining intimation by email", "drdo-deal-apprentice-2026-27--notification"),
  ],
  "drdo-deal-apprentice-2026-27--application": [
    fact("officialApplicationUrl", "https://nats.education.gov.in/", "drdo-deal-apprentice-2026-27--application"),
    fact("applicationMode", "online via NATS 2.0 for DEAL ID NUKDDC000015", "drdo-deal-apprentice-2026-27--application"),
  ],
  "delhi-hjs-examination-2026--notification": [
    fact("advertisementNumber", "Delhi Higher Judicial Service Examination 2026", "delhi-hjs-examination-2026--notification"),
    fact("employmentType", "direct recruitment to Delhi Higher Judicial Service", "delhi-hjs-examination-2026--notification"),
    fact("vacancyCount", "27 (24 existing + 3 anticipated)", "delhi-hjs-examination-2026--notification"),
    fact("applicationStartDate", "2026-07-01", "delhi-hjs-examination-2026--notification"),
    fact("applicationEndDate", "2026-07-15", "delhi-hjs-examination-2026--notification"),
    fact("applicationEndTime", "17:30 IST", "delhi-hjs-examination-2026--notification"),
    fact("ageLimit", "35 to 45 years on last date of application", "delhi-hjs-examination-2026--notification"),
    fact("ageCutoffDate", "2026-07-15", "delhi-hjs-examination-2026--notification"),
    fact("qualification", "Advocate: 7+ years practice; Judicial Officer route: 7 years combined per advt", "delhi-hjs-examination-2026--notification"),
    fact("applicationFee", "Rs 2000 General; Rs 500 SC/ST/PwBD (40%+ benchmark)", "delhi-hjs-examination-2026--notification"),
    fact("selectionProcess", "Preliminary (objective), Mains (written), Viva-voce", "delhi-hjs-examination-2026--notification"),
  ],
  "delhi-hjs-examination-2026--application": [
    fact("officialApplicationUrl", DELHI_APPLY, "delhi-hjs-examination-2026--application"),
    fact("applicationMode", "online via applycareer.co.in Delhi High Court portal", "delhi-hjs-examination-2026--application"),
  ],
};

/** @type {Record<string, object>} */
const NEW_SOURCE_ENTRIES = {
  "rrb-technician-cen-02-2026--notification": {
    id: "rrb-technician-cen-02-2026--notification",
    vacancyId: "rrb-technician-cen-02-2026",
    sourceType: "official-notification",
    organisation: "Railway Recruitment Boards",
    title: "RRB Technician CEN 02/2026 — official notification PDF",
    url: RRB_NOTICE,
    publicationDate: "2026-05-23",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
    verifiedFacts: [],
    corrigendumChecked: true,
    notes: "Phase B2 strict verification from official CEN 02/2026 PDF.",
  },
  "gujarat-hc-legal-assistant-2026--notification": {
    id: "gujarat-hc-legal-assistant-2026--notification",
    vacancyId: "gujarat-hc-legal-assistant-2026",
    sourceType: "official-notification",
    organisation: "High Court of Gujarat",
    title: "Gujarat High Court Legal Assistant 2026 — detailed advertisement PDF",
    url: GUJARAT_NOTICE,
    publicationDate: "2026-06-29",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
    verifiedFacts: [],
    corrigendumChecked: true,
    notes: "Phase B2 strict verification from RC/B/1320/2026 (LA) detailed PDF.",
  },
  "drdo-deal-apprentice-2026-27--application": {
    id: "drdo-deal-apprentice-2026-27--application",
    vacancyId: "drdo-deal-apprentice-2026-27",
    sourceType: "official-application",
    organisation: "Defence Electronics Applications Laboratory (DEAL), DRDO",
    title: "DRDO DEAL Apprenticeship 2026-27 — NATS 2.0 application portal",
    url: "https://nats.education.gov.in/",
    publicationDate: "2026-06-23",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
    verifiedFacts: [],
    corrigendumChecked: true,
    notes: "Official NATS 2.0 portal for DEAL ID NUKDDC000015 per advertisement PDF.",
  },
  "delhi-hjs-examination-2026--notification": {
    id: "delhi-hjs-examination-2026--notification",
    vacancyId: "delhi-hjs-examination-2026",
    sourceType: "official-notification",
    organisation: "High Court of Delhi",
    title: "Delhi Higher Judicial Service Examination 2026 — official advertisement PDF",
    url: DELHI_NOTICE,
    publicationDate: "2026-07-01",
    checkedAt: VERIFIED_AT,
    verificationStatus: "verified",
    verifiedFacts: [],
    corrigendumChecked: true,
    notes: "Phase B2 source repair — direct PDF replaces broken /recruitment page.",
  },
};

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  writeFileSync(filePath, lines.join("\n") + "\n", "utf8");
}

function ensureReportDir() {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
}

function buildArtifacts(live, preview) {
  ensureReportDir();
  const ids = Object.keys(B2_DECISIONS);
  writeJson(
    path.join(REPORT_DIR, "selected-records-before.json"),
    live.items.filter((i) => ids.includes(i.id)),
  );
  writeCsv(
    path.join(REPORT_DIR, "b2-verification-matrix.csv"),
    ["recordId", "decision"],
    ids.map((id) => ({ recordId: id, decision: B2_DECISIONS[id] })),
  );
  const factRows = [];
  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    for (const f of facts) {
      const parts = Object.fromEntries(f.split("|").map((p) => p.split(":")));
      factRows.push({
        recordId: sourceId.replace(/--(notification|application|website)$/, ""),
        factKey: parts.fact ?? "",
        verifiedValue: parts.value ?? "",
        sourceId: parts.source ?? sourceId,
        verifiedAt: parts.verifiedAt ?? VERIFIED_AT,
      });
    }
  }
  writeCsv(
    path.join(REPORT_DIR, "b2-verified-facts-proposed.csv"),
    ["recordId", "factKey", "verifiedValue", "sourceId", "verifiedAt"],
    factRows,
  );
  writeJson(
    path.join(REPORT_DIR, "b2-strict-ready-records.json"),
    STRICT_READY_IDS.map((id) => preview.items.find((i) => i.id === id)),
  );
  writeJson(
    path.join(REPORT_DIR, "b2-review-pending-records.json"),
    ids.filter((id) => B2_DECISIONS[id] !== "READY_FOR_STRICT_VERIFICATION").map((id) => ({
      id,
      decision: B2_DECISIONS[id],
    })),
  );
  writeFileSync(
    path.join(REPORT_DIR, "b2-schema-blockers.txt"),
    "isro-istrac-02-2026: SCHEMA_BLOCKED — Advertisement 02/2026 covers six post groups (Technical Assistant, Scientific Assistant, Library Assistant, Technician-B, Draughtsman-B, Cook-A) with distinct qualifications, vacancy counts and age limits. Existing single-record schema cannot represent post-wise differences without misleading generalisation. Proposed: post-table or split records in a future schema revision.\n",
  );
}

function patchSources(sources) {
  const byId = new Map(sources.map((s) => [s.id, s]));
  for (const [id, entry] of Object.entries(NEW_SOURCE_ENTRIES)) {
    if (byId.has(id)) Object.assign(byId.get(id), entry);
    else {
      sources.push(entry);
      byId.set(id, entry);
    }
  }
  const drdoNotice = byId.get("drdo-deal-apprentice-2026-27--notification");
  if (drdoNotice) {
    drdoNotice.url = DRDO_NOTICE;
    drdoNotice.checkedAt = VERIFIED_AT;
    drdoNotice.corrigendumChecked = true;
  }
  const delhiApp = byId.get("delhi-hjs-examination-2026--application");
  if (delhiApp) {
    delhiApp.url = DELHI_APPLY;
    delhiApp.checkedAt = VERIFIED_AT;
  }
  const delhiWeb = byId.get("delhi-hjs-examination-2026--website");
  if (delhiWeb) {
    delhiWeb.url = "https://delhihighcourt.nic.in/job-openings";
    delhiWeb.checkedAt = VERIFIED_AT;
  }
  for (const [sourceId, facts] of Object.entries(SOURCE_VERIFIED_FACTS)) {
    const rec = byId.get(sourceId);
    if (!rec) throw new Error(`Missing source: ${sourceId}`);
    rec.verifiedFacts = facts;
    rec.checkedAt = VERIFIED_AT;
    rec.corrigendumChecked = true;
    rec.notes = `${rec.notes ?? ""} Phase B2 verified ${VERIFIED_AT}.`.trim();
  }
  return sources;
}

function main() {
  if (STRICT_READY_IDS.length === 0) {
    console.error("STOP: zero strict-ready B2 records.");
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
  console.log(`B2 applied. Strict-ready: ${STRICT_READY_IDS.join(", ")}`);
  console.log(`Modified: ${diff.semantic.modified.join(", ")}`);
}

main();
