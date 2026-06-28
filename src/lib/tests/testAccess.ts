import type { MockUserPlan, TestAccess, TestPaper } from "./testTypes";

export const MOCK_USER_PLAN: MockUserPlan = "free";

/** When true, all papers open regardless of access field (future paid gates preserved below). */
export const TESTS_ALL_FREE = true;

const PLAN_RANK: Record<MockUserPlan, number> = {
  free: 0,
  practice_pass: 1,
  exam_pass: 2,
  selection_pass: 3,
};

const ACCESS_REQUIREMENT: Record<TestAccess, MockUserPlan | null> = {
  free: null,
  practice_pass: "practice_pass",
  exam_pass: "exam_pass",
  selection_pass: "selection_pass",
};

export function isBasicLevel(level: string): boolean {
  return level === "basic";
}

export function canAccessPaper(paper: TestPaper, plan: MockUserPlan = MOCK_USER_PLAN): boolean {
  if (TESTS_ALL_FREE) return true;
  if (paper.access === "free" || isBasicLevel(paper.level)) {
    return true;
  }
  const required = ACCESS_REQUIREMENT[paper.access];
  if (!required) return true;
  return PLAN_RANK[plan] >= PLAN_RANK[required];
}

/** Alias for future UI naming. */
export const canAccessTest = canAccessPaper;

export function getAccessRequirementLabel(access: TestAccess): string {
  if (TESTS_ALL_FREE) return "Free Practice";
  switch (access) {
    case "practice_pass":
      return "Practice Pass Required";
    case "exam_pass":
      return "Exam Pass Required";
    case "selection_pass":
      return "Selection Pass Required";
    default:
      return "Free";
  }
}

export function getAccessRequirementLabelHi(access: TestAccess): string {
  if (TESTS_ALL_FREE) return "Free Practice";
  switch (access) {
    case "practice_pass":
      return "Practice Pass आवश्यक";
    case "exam_pass":
      return "Exam Pass आवश्यक";
    case "selection_pass":
      return "Selection Pass आवश्यक";
    default:
      return "निःशुल्क / Free";
  }
}

export function getTestCardCtaLabel(): string {
  return TESTS_ALL_FREE ? "Open Test →" : "Start Test →";
}

export function getTestResultHint(): string {
  return TESTS_ALL_FREE ? "Result तुरंत देखें" : "";
}
