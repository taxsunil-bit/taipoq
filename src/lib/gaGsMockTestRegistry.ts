export type GaGsFoundationPaperKey = `${string}/${string}`;

export const GA_GS_SHARED_FOUNDATION_PAPERS = new Set<GaGsFoundationPaperKey>([
  "general-awareness/model-test-01",
  "general-science/model-test-01",
]);

export function toGaGsFoundationPaperKey(subjectSlug: string, paperSlug: string): GaGsFoundationPaperKey {
  return `${subjectSlug}/${paperSlug}`;
}

export function isGaGsSharedFoundationPaper(subjectSlug: string, paperSlug: string): boolean {
  return GA_GS_SHARED_FOUNDATION_PAPERS.has(toGaGsFoundationPaperKey(subjectSlug, paperSlug));
}

export function getGaGsSharedFoundationPaperCount(): number {
  return GA_GS_SHARED_FOUNDATION_PAPERS.size;
}
