import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NumericAnswerInput } from "@/components/math-speed-lab/NumericAnswerInput";
import {
  completeDirectSet,
  deriveStateAfterDirectSet,
  formatMslProgressLabel,
  getActiveDirectSession,
  getTechniqueProgress,
  markPracticeStarted,
  recordAttempt,
  resetDirectPracticeScores,
  saveActiveDirectSession,
  scoreDirectSet,
} from "@/lib/math-speed-lab";
import type {
  MslDirectQuestion,
  MslProgressState,
  MslTechniqueMeta,
  MslTechniqueProgress,
} from "@/lib/math-speed-lab/types";
import { cn } from "@/lib/utils";

type Phase = "active" | "summary";

export type MslLessonReturnTo =
  | "/math-speed-lab/square-ending-5"
  | "/math-speed-lab/complements-10n"
  | "/math-speed-lab/nearbase-100";

type MslDirectPracticeRunnerProps = {
  technique: MslTechniqueMeta;
  questions: MslDirectQuestion[];
  lessonTo: MslLessonReturnTo;
  answerLabel: (question: MslDirectQuestion) => string;
  successFeedback: (question: MslDirectQuestion) => string;
  errorFeedback: (question: MslDirectQuestion, value: number) => string;
};

export function MslDirectPracticeRunner({
  technique,
  questions,
  lessonTo,
  answerLabel,
  successFeedback,
  errorFeedback,
}: MslDirectPracticeRunnerProps) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"neutral" | "success" | "error">("neutral");
  const [revealed, setRevealed] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [firstPassResults, setFirstPassResults] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<Phase>("active");
  const [progress, setProgress] = useState<MslTechniqueProgress | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const restored = getActiveDirectSession(technique.techniqueId);
    if (
      restored?.techniqueId === technique.techniqueId &&
      typeof restored.questionIndex === "number" &&
      restored.questionIndex >= 0 &&
      restored.questionIndex < questions.length
    ) {
      setIndex(restored.questionIndex);
      setFirstPassResults({ ...(restored.firstPassResults ?? {}) });
    }
    setProgress(markPracticeStarted(technique.techniqueId));
    setSessionReady(true);
  }, [technique.techniqueId, questions.length]);

  useEffect(() => {
    if (!sessionReady || phase !== "active") return;
    saveActiveDirectSession(technique.techniqueId, {
      questionIndex: index,
      firstPassResults,
    });
  }, [index, firstPassResults, phase, sessionReady, technique.techniqueId]);

  const question = questions[index];
  const canAdvance = answeredCorrectly || revealed;

  const summary = useMemo(() => {
    if (phase !== "summary") return null;
    return scoreDirectSet(questions, firstPassResults);
  }, [phase, questions, firstPassResults]);

  function resetCurrentInput() {
    setTyped("");
    setFeedback(null);
    setFeedbackTone("neutral");
    setRevealed(false);
    setAnsweredCorrectly(false);
    setAttemptCount(0);
  }

  function handleValidSubmit(value: number, raw: string) {
    if (!question || answeredCorrectly || revealed) return;

    const correct = value === question.correctAnswer;
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);

    const firstValid = !(question.questionId in firstPassResults);
    if (firstValid) {
      setFirstPassResults((prev) => ({
        ...prev,
        [question.questionId]: correct,
      }));
    }

    recordAttempt({
      questionId: question.questionId,
      techniqueId: question.techniqueId,
      typedAnswer: raw,
      correct,
      attemptCount: nextAttempt,
      firstValidCorrect: firstValid && correct,
      timestamp: new Date().toISOString(),
    });

    if (correct) {
      setAnsweredCorrectly(true);
      setFeedbackTone("success");
      setFeedback(successFeedback(question));
    } else {
      setFeedbackTone("error");
      setFeedback(errorFeedback(question, value));
    }
  }

  function handleInvalidSubmit(reason: string) {
    setFeedbackTone("error");
    setFeedback(reason);
  }

  function handleRetry() {
    setTyped("");
    setFeedback(null);
    setFeedbackTone("neutral");
    setRevealed(false);
    setAnsweredCorrectly(false);
    // Keep firstPassResults for this question unchanged (first valid attempt wins).
  }

  function handleReveal() {
    if (!question) return;
    // Reveal is never scored as first-pass correct.
    setRevealed(true);
    setFeedbackTone("neutral");
    setFeedback(`Answer: ${question.correctAnswer}. Study the rapid steps, then continue.`);
    if (!(question.questionId in firstPassResults)) {
      setFirstPassResults((prev) => ({
        ...prev,
        [question.questionId]: false,
      }));
    }
  }

  function finishSet(results: Record<string, boolean>) {
    const scored = scoreDirectSet(questions, results);
    const current = getTechniqueProgress(technique.techniqueId);
    const previouslyMastered = current.state === "mastered" || Boolean(current.masteredAt);
    const nextState: MslProgressState = deriveStateAfterDirectSet({
      previousState: current.state,
      previouslyMastered,
      accuracyPercent: scored.accuracyPercent,
      masteryThreshold: technique.masteryDirectPercent,
      reviewBelowThreshold: technique.reviewRequiredBelowPercent,
    });
    const saved = completeDirectSet(technique.techniqueId, {
      firstPassCorrect: scored.firstPassCorrect,
      total: scored.total,
      accuracyPercent: scored.accuracyPercent,
      completedQuestionIds: scored.completedQuestionIds,
      state: nextState,
    });
    setProgress(saved);
    setPhase("summary");
  }

  function handleNext() {
    if (!canAdvance || !question) return;
    const results = { ...firstPassResults };
    if (!(question.questionId in results)) {
      results[question.questionId] = answeredCorrectly;
    }
    if (index >= questions.length - 1) {
      setFirstPassResults(results);
      finishSet(results);
      return;
    }
    setFirstPassResults(results);
    setIndex((i) => i + 1);
    resetCurrentInput();
  }

  function handleRestart() {
    resetDirectPracticeScores(technique.techniqueId);
    setIndex(0);
    setFirstPassResults({});
    setPhase("active");
    resetCurrentInput();
    setProgress(markPracticeStarted(technique.techniqueId));
  }

  if (phase === "summary" && summary && progress) {
    return (
      <Card className="border-border bg-card/80">
        <CardHeader>
          <h2 id="msl-direct-summary-heading" className="text-xl font-bold">
            Direct practice summary
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <ul className="space-y-2 text-muted-foreground">
            <li>
              First-pass correct:{" "}
              <span className="font-semibold text-foreground">
                {summary.firstPassCorrect} / {summary.total}
              </span>
            </li>
            <li>
              Completed questions:{" "}
              <span className="font-semibold text-foreground">{summary.total}</span>
            </li>
            <li>
              Accuracy:{" "}
              <span className="font-semibold text-foreground">{summary.accuracyPercent}%</span>
            </li>
            <li>
              Current state:{" "}
              <span className="font-semibold text-foreground">
                {formatMslProgressLabel(progress.state)}
              </span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Timing is not scored. Additional recognition, mixed, exam, error, and revision practice
            sets may be added in future updates.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" className="min-h-11" onClick={handleRestart}>
              Restart direct practice
            </Button>
            <Link
              to={lessonTo}
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11 justify-center")}
            >
              Return to lesson
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Question {index + 1} of {questions.length}
        </p>
        <p className="sr-only">Question reference {question.questionId}</p>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <h2 className="text-xl font-bold leading-snug tracking-tight">{question.prompt}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumericAnswerInput
            key={question.questionId}
            label={answerLabel(question)}
            value={typed}
            onChange={setTyped}
            onSubmitValid={handleValidSubmit}
            onSubmitInvalid={handleInvalidSubmit}
            disabled={answeredCorrectly || revealed}
            feedback={feedback}
            feedbackTone={feedbackTone}
          />

          {(answeredCorrectly || revealed) && (
            <div className="space-y-3 rounded-xl border border-border bg-surface/40 p-4 text-sm leading-relaxed">
              {question.techniqueId === "MSL-T03-NEARBASE-100" &&
              question.rightBlock != null &&
              question.leftRaw != null ? (
                <div
                  className="space-y-1 rounded-lg border border-border bg-background/60 p-3 font-mono text-sm"
                  aria-label={`Near-base blocks: left ${question.leftRaw + (question.carry ?? 0)}, right block ${question.rightBlock}, carry ${question.carry ?? 0}`}
                >
                  <p className="text-foreground">
                    Left final: {question.leftRaw + (question.carry ?? 0)} · Right block:{" "}
                    <span className="tracking-widest">{question.rightBlock}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Carry: {question.carry ?? 0}
                    {(question.rightBlock?.startsWith("0") ?? false)
                      ? " · leading zero kept in right block"
                      : ""}
                  </p>
                  <p className="sr-only">
                    Right block digits are {question.rightBlock.split("").join(", ")}. Carry value
                    is {question.carry ?? 0}.
                  </p>
                </div>
              ) : null}
              <div>
                <h3 className="font-semibold text-foreground">Rapid method</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                  {question.rapidMethodSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ordinary verification</h3>
                <p className="mt-1 text-muted-foreground">{question.ordinaryVerification}</p>
              </div>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {!answeredCorrectly && !revealed ? (
              <>
                <Button type="button" variant="outline" className="min-h-11" onClick={handleRetry}>
                  Clear and retry
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-11"
                  onClick={handleReveal}
                >
                  Reveal answer and method
                </Button>
              </>
            ) : (
              <Button type="button" className="min-h-11" onClick={handleNext}>
                {index >= questions.length - 1 ? "Finish set" : "Next question"}
              </Button>
            )}
            {answeredCorrectly || revealed ? (
              <Button type="button" variant="outline" className="min-h-11" onClick={handleRetry}>
                Retry this question
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
