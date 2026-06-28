import { CHECKED_TEST_PAPER_PACK_01 } from "@/content/tests/checkedTestPaperPack01";
import { getSubjectBySlug, getSubjectSlug } from "@/content/tests/subjects";
import type { ShuffledQuestion, TestPaper } from "./testTypes";
import { shuffleQuestions } from "./questionShuffle";

export function getAllPapers(): TestPaper[] {
  return CHECKED_TEST_PAPER_PACK_01.papers;
}

export function getPaperBySlugs(subjectSlug: string, paperId: string): TestPaper | undefined {
  return getAllPapers().find(
    (p) => getSubjectSlug(p.subject) === subjectSlug && p.paperId === paperId,
  );
}

export function getPapersForSubject(subjectSlug: string): TestPaper[] {
  return getAllPapers().filter((p) => getSubjectSlug(p.subject) === subjectSlug);
}

export function getFreeBasicPapers(): TestPaper[] {
  return getAllPapers().filter((p) => p.access === "free" || p.level === "basic");
}

export function getLockedPapers(): TestPaper[] {
  return getAllPapers().filter((p) => p.access !== "free" && p.level !== "basic");
}

export function createShuffledSession(paper: TestPaper): ShuffledQuestion[] {
  return shuffleQuestions(paper.questions);
}

export function resolveSubjectTitle(subjectSlug: string): string {
  return getSubjectBySlug(subjectSlug)?.title ?? subjectSlug;
}

/** Route params for TanStack Link — single source of truth for subject + paper slugs. */
export function getPaperRouteParams(paper: TestPaper): { subject: string; paperId: string } {
  return {
    subject: getSubjectSlug(paper.subject),
    paperId: paper.paperId,
  };
}

export function getPaperHref(paper: TestPaper, subjectSlug?: string): string {
  const subject = subjectSlug ?? getSubjectSlug(paper.subject);
  return `/tests/${subject}/${paper.paperId}`;
}
