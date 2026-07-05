/** Public PYQ Guide subject — slug kept for route compatibility; label is "PYQ Guide". */
export const PYQ_GUIDE_SUBJECT_SLUG = "pyq-practice";

export const PYQ_GUIDE_PAPER_ID = "pyq-practice-test-paper";

export const PYQ_GUIDE_CONTENT_LABEL = "TAIPOQ Original Guide";

export function isPyqGuideSubjectSlug(subjectSlug: string): boolean {
  return subjectSlug === PYQ_GUIDE_SUBJECT_SLUG;
}

export function isPyqGuidePaper(subjectSlug: string, paperId: string): boolean {
  return isPyqGuideSubjectSlug(subjectSlug) && paperId === PYQ_GUIDE_PAPER_ID;
}

export const PYQ_GUIDE_SUBJECT_INTRO =
  "Learn how to identify previous-year questions, check official sources, understand provisional and final answer keys, and practise with the right structure. This section does not provide copied or officially verified previous-year exam papers.";
