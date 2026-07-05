/** Public Verified PYQ subject — slug kept for route compatibility. */
export const PYQ_GUIDE_SUBJECT_SLUG = "pyq-practice";

export const PYQ_GUIDE_PAPER_ID = "pyq-practice-test-paper";

export const PYQ_GUIDE_CONTENT_LABEL = "Official-Source Verified PYQ";

export const PYQ_CTET_PAPER_TITLE =
  "CTET January 2021 Paper I — Child Development and Pedagogy PYQs";

export const PYQ_CTET_PROVENANCE_LINE =
  "CTET January 2021 · Paper I · Main Set I · Questions 1–10";

export const PYQ_CTET_INTRO =
  "This practice set is based on Questions 1–10 of the official CTET January 2021 Paper I, Main Set I, Child Development and Pedagogy section. The correct options have been checked against the official final answer key. The wording has been lightly adapted for clear digital practice; this page is not an official CBSE or CTET publication.";

export const PYQ_CTET_SEO_TITLE = "CTET January 2021 Paper I CDP PYQs — TAIPOQ";

export const PYQ_CTET_SEO_DESCRIPTION =
  "Practise 10 official-source verified adapted Child Development and Pedagogy questions from CTET January 2021 Paper I, Main Set I, checked against the official final answer key.";

export const PYQ_CTET_OFFICIAL_SOURCES = [
  {
    label: "View official CTET January 2021 question-paper archive",
    href: "https://ctet.nic.in/question-paper-january-2021/",
  },
  {
    label: "View official CTET January 2021 Main Paper I page",
    href: "https://ctet.nic.in/document/ctet-january-2021-main-paper-1/",
  },
  {
    label: "View official CTET previous-year final-answer-key archive",
    href: "https://ctet.nic.in/previous-year-final-answer-key/",
  },
  {
    label: "View official CTET January 2021 Paper I answer-key page",
    href: "https://ctet.nic.in/document/ctet-january-2021-paper-1/",
  },
] as const;

export function isPyqGuideSubjectSlug(subjectSlug: string): boolean {
  return subjectSlug === PYQ_GUIDE_SUBJECT_SLUG;
}

export function isPyqGuidePaper(subjectSlug: string, paperId: string): boolean {
  return isPyqGuideSubjectSlug(subjectSlug) && paperId === PYQ_GUIDE_PAPER_ID;
}

export const PYQ_GUIDE_SUBJECT_INTRO =
  "Official-source verified adapted previous-year questions checked against official final answer keys. These are not official CBSE or CTET publications.";
