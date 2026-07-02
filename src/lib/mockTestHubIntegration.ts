import { analyzeMockTestResult } from "@/lib/mockTestAnalysis";
import {
  adaptShuffledSession,
  scoreHubSessionViaMockEngine,
  toLegacyScoreSummary,
} from "@/lib/mockTestAdapters";
import { isSharedMockFoundationPaper } from "@/lib/mockTestFoundationRegistry";
import { scoreTestAttempt } from "@/lib/tests/testScoring";
import type { ScoreSummary } from "@/lib/tests/testScoring";
import type { ShuffledQuestion, TestAttemptAnswers } from "@/lib/tests/testTypes";
import type { MockTestAnalysis, MockTestScoreResult } from "@/types/mockTest";

export function scoreHubPaperAttempt(
  subjectSlug: string,
  paperId: string,
  questions: ShuffledQuestion[],
  answers: TestAttemptAnswers,
): ScoreSummary {
  if (isSharedMockFoundationPaper(subjectSlug, paperId)) {
    return toLegacyScoreSummary(scoreHubSessionViaMockEngine(questions, answers));
  }
  return scoreTestAttempt(questions, answers);
}

export type SharedHubResultView = {
  mockResult: MockTestScoreResult;
  analysis: MockTestAnalysis;
};

export function buildSharedHubResultView(
  subjectSlug: string,
  paperId: string,
  questions: ShuffledQuestion[],
  answers: TestAttemptAnswers,
): SharedHubResultView | null {
  if (!isSharedMockFoundationPaper(subjectSlug, paperId)) {
    return null;
  }
  const mockResult = scoreHubSessionViaMockEngine(questions, answers);
  const analysis = analyzeMockTestResult(adaptShuffledSession(questions), mockResult);
  return { mockResult, analysis };
}

export function usesSharedMockFoundation(subjectSlug: string, paperId: string): boolean {
  return isSharedMockFoundationPaper(subjectSlug, paperId);
}
