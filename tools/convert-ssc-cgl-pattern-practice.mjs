#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(
  ROOT,
  "RAW DATA",
  "TAIPOQ_SSC_CGL_Pattern_Practice_100_Starter_Questions_PUBLISH_READY.md",
);
const OUT_PATH = path.join(ROOT, "src", "content", "sscCglPatternPracticeContent.ts");

const SUBJECT_CONFIG = [
  {
    marker: "## 1. Quantitative Aptitude",
    slug: "quantitative-aptitude",
    idPrefix: "SSC-CGL-QA",
    title: "Quantitative Aptitude",
    hindiTitle: "गणितीय योग्यता",
    description:
      "Percentage, profit-loss, interest, time-work, algebra, geometry, DI, and number system — Tier-I style starter practice.",
    subject: "Quantitative Aptitude",
  },
  {
    marker: "## 2. General Intelligence and Reasoning",
    slug: "general-intelligence-reasoning",
    idPrefix: "SSC-CGL-GIR",
    title: "General Intelligence and Reasoning",
    hindiTitle: "सामान्य बुद्धिमत्ता एवं तर्क",
    description:
      "Analogy, coding, blood relation, series, direction, syllogism, Venn diagram, and arrangement — reasoning pattern practice.",
    subject: "General Intelligence and Reasoning",
  },
  {
    marker: "## 3. English Comprehension",
    slug: "english-comprehension",
    idPrefix: "SSC-CGL-ENG",
    title: "English Comprehension",
    hindiTitle: "अंग्रेज़ी समझ",
    description:
      "Grammar, vocabulary, comprehension, and sentence improvement — English section pattern practice.",
    subject: "English Comprehension",
  },
  {
    marker: "## 4. General Awareness",
    slug: "general-awareness",
    idPrefix: "SSC-CGL-GA",
    title: "General Awareness",
    hindiTitle: "सामान्य जागरूकता",
    description:
      "History, geography, polity, science, economy, and static GK — awareness section pattern practice.",
    subject: "General Awareness",
  },
];

function parseField(line) {
  const m = line.match(/^\*\*(Answer|Explanation|Shortcut\/Trick|Common mistake|Difficulty):\*\*\s*(.*)$/);
  return m ? { key: m[1], value: m[2].trim() } : null;
}

function parseQuestionBlock(block, chapter, subjectConfig, questionNumber) {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const qLine = lines.find((l) => /^\*\*Q\d+\./.test(l));
  if (!qLine) return null;

  const qMatch = qLine.match(/^\*\*Q\d+\.\s*(.+)\*\*$/);
  if (!qMatch) return null;

  const question = qMatch[1].trim();
  const options = [];
  let answer = "";
  let explanation = "";
  let shortcut = "";
  let commonMistake = "";
  let difficulty = "Moderate";

  for (const line of lines) {
    const opt = line.match(/^([A-D])\.\s*(.+)$/);
    if (opt) {
      options.push({ label: opt[1], text: opt[2].trim() });
      continue;
    }
    const field = parseField(line);
    if (!field) continue;
    switch (field.key) {
      case "Answer":
        answer = field.value;
        break;
      case "Explanation":
        explanation = field.value;
        break;
      case "Shortcut/Trick":
        shortcut = field.value;
        break;
      case "Common mistake":
        commonMistake = field.value;
        break;
      case "Difficulty":
        difficulty = field.value;
        break;
    }
  }

  if (options.length !== 4 || !answer || !explanation) {
    throw new Error(
      `Invalid question ${subjectConfig.idPrefix}-${String(questionNumber).padStart(3, "0")}: options=${options.length}`,
    );
  }

  const id = `${subjectConfig.idPrefix}-${String(questionNumber).padStart(3, "0")}`;

  return {
    id,
    subject: subjectConfig.subject,
    chapter,
    questionNumber,
    difficulty,
    question,
    options,
    answer,
    explanation,
    ...(shortcut ? { shortcut } : {}),
    ...(commonMistake ? { commonMistake } : {}),
  };
}

function extractSubjectSection(md, index) {
  const start = md.indexOf(SUBJECT_CONFIG[index].marker);
  if (start === -1) throw new Error(`Missing section: ${SUBJECT_CONFIG[index].marker}`);
  const nextMarker =
    index < SUBJECT_CONFIG.length - 1
      ? SUBJECT_CONFIG[index + 1].marker
      : "## Current Affairs Note-Making Method";
  const end = md.indexOf(nextMarker, start + 1);
  return md.slice(start, end === -1 ? undefined : end);
}

function parseSubject(sectionMd, config) {
  let chapter = "General";
  const questions = [];
  const chunks = sectionMd.split(/\n---\n/);

  for (const chunk of chunks) {
    const chapterMatch = chunk.match(/^###\s+(.+)$/m);
    if (chapterMatch && !/^\*\*Q\d+\./.test(chunk.trim())) {
      if (chunk.trim().startsWith("###")) {
        chapter = chapterMatch[1].trim();
      }
    }

    if (!/^\*\*Q\d+\./m.test(chunk)) continue;

    const qNumMatch = chunk.match(/^\*\*Q(\d+)\./m);
    if (!qNumMatch) continue;

    const chapterInChunk = chunk.match(/^###\s+(.+)$/m);
    const activeChapter = chapterInChunk ? chapterInChunk[1].trim() : chapter;
    if (chapterInChunk) chapter = activeChapter;

    const q = parseQuestionBlock(chunk, activeChapter, config, Number(qNumMatch[1]));
    if (q) questions.push(q);
  }

  questions.sort((a, b) => a.questionNumber - b.questionNumber);
  return {
    slug: config.slug,
    title: config.title,
    hindiTitle: config.hindiTitle,
    description: config.description,
    questions,
  };
}

const md = readFileSync(MD_PATH, "utf8");
const subjects = SUBJECT_CONFIG.map((config, i) =>
  parseSubject(extractSubjectSection(md, i), config),
);

for (const s of subjects) {
  console.log(`${s.title}: ${s.questions.length} questions`);
  if (s.questions.length !== 25) {
    throw new Error(`${s.title} has ${s.questions.length} questions, expected 25`);
  }
}

const total = subjects.reduce((n, s) => n + s.questions.length, 0);
console.log(`Total: ${total}`);

const body = `export type SscCglPracticeQuestion = {
  id: string;
  subject:
    | "Quantitative Aptitude"
    | "General Intelligence and Reasoning"
    | "English Comprehension"
    | "General Awareness";
  chapter: string;
  questionNumber: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  question: string;
  options: {
    label: "A" | "B" | "C" | "D";
    text: string;
  }[];
  answer: string;
  explanation: string;
  shortcut?: string;
  commonMistake?: string;
};

export type SscCglPracticeSubject = {
  slug: string;
  title: string;
  hindiTitle: string;
  description: string;
  questions: SscCglPracticeQuestion[];
};

export const SSC_CGL_PATTERN_PRACTICE_HREF = "/study-corner/ssc-cgl-pattern-practice" as const;

export const SSC_CGL_PATTERN_PRACTICE_META = {
  title: "SSC CGL Pattern Practice — 100 Starter Questions",
  subtitle:
    "TAIPOQ original illustrative practice for SSC CGL Tier-I pattern. This is not an official SSC previous-year question paper or official PYQ book.",
  notice:
    "This practice page contains TAIPOQ original illustrative questions based on the common SSC CGL Tier-I structure. It is not an official SSC previous-year paper, not an official PYQ book, and does not reproduce paid books or downloaded PDFs. Official questions may be added later only after source tagging, solving, rewriting, and adding original explanations.",
  howToUse: {
    title: "How to use this page",
    text: "Use this page to understand the question pattern, practise starter-level concepts, and identify weak topics. After this, solve official SSC papers and maintain your own source-tagged notes.",
  },
  contentPolicy: [
    "TAIPOQ original illustrative practice",
    "Not an official SSC paper",
    "Not an official PYQ book",
    "Paid books and PDFs are not copied",
    "Downloaded pattern PDFs are not republished",
    "Future official questions must be source-tagged, solved, rewritten, and explained originally",
  ],
  seoTitle: "SSC CGL Pattern Practice 100 Questions | TAIPOQ",
  seoDescription:
    "Practice 100 SSC CGL Tier-I pattern questions for Quantitative Aptitude, Reasoning, English Comprehension and General Awareness. TAIPOQ original illustrative practice.",
  subjectJumps: [
    { label: "Maths", slug: "quantitative-aptitude" },
    { label: "Reasoning", slug: "general-intelligence-reasoning" },
    { label: "English", slug: "english-comprehension" },
    { label: "General Awareness", slug: "general-awareness" },
  ],
} as const;

export const sscCglPatternPracticeSubjects: SscCglPracticeSubject[] = ${JSON.stringify(subjects, null, 2)};

export const SSC_CGL_PATTERN_PRACTICE_TOTAL = ${total};
`;

writeFileSync(OUT_PATH, body, "utf8");
console.log("Wrote", OUT_PATH);
