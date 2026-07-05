import type { TestLevel } from "@/lib/tests/testTypes";

export const TEST_LEVEL_LABELS: Record<TestLevel, string> = {
  basic: "आरम्भिक",
  practice: "अभ्यास",
  moderate: "मध्यम",
  expert: "विशेषज्ञ",
  model: "Model Paper",
  pyq: "PYQ Guide",
  final_challenge: "Final Challenge",
};

export const TEST_LEVEL_ORDER: TestLevel[] = [
  "basic",
  "practice",
  "moderate",
  "pyq",
  "model",
  "expert",
  "final_challenge",
];

export function getTestLevelLabel(level: string): string {
  return TEST_LEVEL_LABELS[level as TestLevel] ?? level;
}
