import { getSubjectSlug } from "@/content/tests/subjects";
import { getAllPapers } from "@/lib/tests/testGenerator";

export type SharedFoundationPaperKey = `${string}/${string}`;

export function toSharedFoundationPaperKey(
  subjectSlug: string,
  paperId: string,
): SharedFoundationPaperKey {
  return `${subjectSlug}/${paperId}`;
}

/**
 * All hub papers served via /tests/$subject/$paperId from Pack 01.
 * Built once from the paper registry — single source of truth for Phase 4 migration.
 */
function buildSharedMockFoundationRegistry(): ReadonlySet<SharedFoundationPaperKey> {
  const keys = new Set<SharedFoundationPaperKey>();
  for (const paper of getAllPapers()) {
    keys.add(toSharedFoundationPaperKey(getSubjectSlug(paper.subject), paper.paperId));
  }
  return keys;
}

export const SHARED_MOCK_FOUNDATION_PAPERS: ReadonlySet<SharedFoundationPaperKey> =
  buildSharedMockFoundationRegistry();

export function isSharedMockFoundationPaper(subjectSlug: string, paperId: string): boolean {
  return SHARED_MOCK_FOUNDATION_PAPERS.has(toSharedFoundationPaperKey(subjectSlug, paperId));
}

export function getSharedMockFoundationPaperList(): Array<{ subject: string; paperId: string }> {
  return [...SHARED_MOCK_FOUNDATION_PAPERS].map((key) => {
    const slash = key.indexOf("/");
    return {
      subject: key.slice(0, slash),
      paperId: key.slice(slash + 1),
    };
  });
}

export function getHubPaperInventoryCount(): number {
  return getAllPapers().length;
}

export function getSharedFoundationPaperCount(): number {
  return SHARED_MOCK_FOUNDATION_PAPERS.size;
}
