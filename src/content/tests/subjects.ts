import { CHECKED_TEST_PAPER_PACK_01 } from "./checkedTestPaperPack01";

export type TestSubjectMeta = {
  slug: string;
  title: string;
  paperCount: number;
  freeCount: number;
  hasCurrentAffairs: boolean;
};

const SUBJECT_SLUG_MAP: Record<string, string> = {
  Computer: "computer",
  "MS Word": "ms-word",
  Excel: "excel",
  "Typing Skill": "typing-skill",
  Reasoning: "reasoning",
  Maths: "maths",
  "General Awareness": "general-awareness",
  "General Science": "general-science",
  "Current Affairs": "current-affairs",
  Hindi: "hindi",
  English: "english",
  "UP GK": "up-gk",
  "PYQ Practice": "pyq-practice",
  "Model Papers": "model-papers",
};

const SLUG_TITLE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECT_SLUG_MAP).map(([title, slug]) => [slug, title]),
);

export function getSubjectSlug(subject: string): string {
  return SUBJECT_SLUG_MAP[subject] ?? subject.toLowerCase().replace(/\s+/g, "-");
}

export function getSubjectBySlug(slug: string): TestSubjectMeta | undefined {
  return TEST_SUBJECTS.find((s) => s.slug === slug);
}

function buildSubjects(): TestSubjectMeta[] {
  const bySlug = new Map<string, TestSubjectMeta>();

  for (const paper of CHECKED_TEST_PAPER_PACK_01.papers) {
    const slug = getSubjectSlug(paper.subject);
    const existing = bySlug.get(slug) ?? {
      slug,
      title: paper.subject,
      paperCount: 0,
      freeCount: 0,
      hasCurrentAffairs: paper.subject === "Current Affairs",
    };
    existing.paperCount += 1;
    if (paper.access === "free" || paper.level === "basic") {
      existing.freeCount += 1;
    }
    bySlug.set(slug, existing);
  }

  return Array.from(bySlug.values());
}

export const TEST_SUBJECTS: TestSubjectMeta[] = buildSubjects();

export const PACK_PREPARED_DATE = CHECKED_TEST_PAPER_PACK_01.prepared;

export function getSubjectTitle(slug: string): string {
  return SLUG_TITLE_MAP[slug] ?? slug;
}
