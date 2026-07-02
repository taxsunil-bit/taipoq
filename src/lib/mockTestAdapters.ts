import type { TestPaper, ShuffledQuestion, TestQuestion, TestAttemptAnswers } from "@/lib/tests/testTypes";
import type { MockQuestion, MockTestPaper, MockTestScoreResult } from "@/types/mockTest";
import { scoreMockTest, toHubLegacyIdLists, toHubLegacyScoreFields } from "./mockTestScoring";
import type { ScoreSummary } from "./tests/testScoring";

function mapHubDifficulty(level: string): MockQuestion["difficulty"] | undefined {
  if (level === "basic" || level === "practice") return "easy";
  if (level === "moderate" || level === "model") return "medium";
  if (level === "expert" || level === "final_challenge") return "hard";
  return undefined;
}

function adaptHubQuestion(
  question: TestQuestion,
  paperDefaults: {
    defaultMarks?: number;
    defaultNegative?: number;
  },
): MockQuestion {
  const options = question.options.map((text, index) => ({
    id: `${question.id}-o${index}`,
    text,
  }));

  const correctOptionId = `${question.id}-o${question.answerIndex}`;
  if (!options.some((option) => option.id === correctOptionId)) {
    throw new Error(`adaptHubQuestion: correct option missing for ${question.id}`);
  }

  return {
    id: question.id,
    question: question.question,
    options,
    correctOptionId,
    explanation: question.explanation || undefined,
    subject: question.subject || undefined,
    topic: question.chapter || undefined,
    difficulty: mapHubDifficulty(question.level),
    marks: paperDefaults.defaultMarks,
    negativeMarks: paperDefaults.defaultNegative,
  };
}

export function adaptHubTestPaper(paper: TestPaper): MockTestPaper {
  if (!paper.questions.length) {
    throw new Error(`adaptHubTestPaper: paper ${paper.paperId} has no questions`);
  }

  const defaultMarksPerQuestion = 1;
  const defaultNegativeMarks = 0;

  return {
    id: paper.paperId,
    subject: paper.subject,
    title: paper.title,
    description: paper.intro,
    durationMinutes: paper.durationMinutes,
    defaultMarksPerQuestion,
    defaultNegativeMarks,
    questions: paper.questions.map((question) =>
      adaptHubQuestion(question, {
        defaultMarks: defaultMarksPerQuestion,
        defaultNegative: defaultNegativeMarks,
      }),
    ),
  };
}

export function adaptShuffledSession(questions: ShuffledQuestion[]): MockTestPaper {
  if (!questions.length) {
    throw new Error("adaptShuffledSession: empty question session");
  }

  const mockQuestions: MockQuestion[] = questions.map((question) => {
    const options = question.shuffledOptions.map((text, index) => ({
      id: `${question.id}-o${index}`,
      text,
    }));
    const correctOptionId = `${question.id}-o${question.correctIndex}`;
    if (!options.some((option) => option.id === correctOptionId)) {
      throw new Error(`adaptShuffledSession: correct option missing for ${question.id}`);
    }

    return {
      id: question.id,
      question: question.question,
      options,
      correctOptionId,
      explanation: question.explanation || undefined,
      subject: question.subject || undefined,
      topic: question.chapter || undefined,
      difficulty: mapHubDifficulty(question.level),
      marks: 1,
      negativeMarks: 0,
    };
  });

  return {
    id: "session",
    subject: questions[0]?.subject ?? "Unknown",
    title: "Session Paper",
    durationMinutes: 15,
    defaultMarksPerQuestion: 1,
    defaultNegativeMarks: 0,
    questions: mockQuestions,
  };
}

export function hubAnswersToSelections(
  questions: ShuffledQuestion[],
  answers: Record<string, number>,
): Record<string, string | undefined> {
  const selections: Record<string, string | undefined> = {};
  for (const question of questions) {
    const selectedIndex = answers[question.id];
    selections[question.id] =
      selectedIndex === undefined ? undefined : `${question.id}-o${selectedIndex}`;
  }
  return selections;
}

export function scoreHubSessionViaMockEngine(
  questions: ShuffledQuestion[],
  answers: TestAttemptAnswers,
): MockTestScoreResult {
  const sessionPaper = adaptShuffledSession(questions);
  const selections = hubAnswersToSelections(questions, answers);
  return scoreMockTest(sessionPaper, selections, { floorScoreAtZero: true });
}

export function toLegacyScoreSummary(result: MockTestScoreResult): ScoreSummary {
  const legacy = toHubLegacyScoreFields(result);
  const { correctIds, wrongIds } = toHubLegacyIdLists(result);
  return {
    score: legacy.score,
    total: legacy.total,
    percentage: legacy.percentage,
    correctIds,
    wrongIds,
  };
}
