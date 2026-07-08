import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NumericAnswerInput } from "@/components/math-speed-lab/NumericAnswerInput";
import { T01_DIRECT_QUESTIONS } from "@/content/math-speed-lab";
import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import {
  completeT01DirectSet,
  deriveT01StateAfterDirectSet,
  getT01ActiveDirectSession,
  getT01Progress,
  markT01PracticeStarted,
  recordT01Attempt,
  resetT01DirectPracticeScores,
  saveT01ActiveDirectSession,
  scoreDirectSet,
} from "@/lib/math-speed-lab";
import type { MslProgressState, MslTechniqueProgress } from "@/lib/math-speed-lab/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "active" | "summary";

export function MslT01DirectPracticeRunner() {
  const questions = T01_DIRECT_QUESTIONS;
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
    const restored = getT01ActiveDirectSession();
    if (
      restored?.techniqueId === "MSL-T01-SQUARE-ENDING-5" &&
      typeof restored.questionIndex === "number" &&
      restored.questionIndex >= 0 &&
      restored.questionIndex < questions.length
    ) {
      setIndex(restored.questionIndex);
      setFirstPassResults({ ...(restored.firstPassResults ?? {}) });
    }
    setProgress(markT01PracticeStarted());
    setSessionReady(true);
  }, [questions.length]);

  useEffect(() => {
    if (!sessionReady || phase !== "active") return;
    saveT01ActiveDirectSession({ questionIndex: index, firstPassResults });
  }, [index, firstPassResults, phase, sessionReady]);

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

    recordT01Attempt({
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
      setFeedback(`Correct. ${question.operand}² = ${question.correctAnswer}.`);
    } else {
      setFeedbackTone("error");
      setFeedback(
        `Incorrect. Your answer ${value} is not equal to ${question.operand}². Try again, or reveal the method.`,
      );
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
    const current = getT01Progress();
    const previouslyMastered = current.state === "mastered" || Boolean(current.masteredAt);
    const nextState: MslProgressState = deriveT01StateAfterDirectSet({
      previousState: current.state,
      previouslyMastered,
      accuracyPercent: scored.accuracyPercent,
      masteryThreshold: T01_TECHNIQUE.masteryDirectPercent,
      reviewBelowThreshold: T01_TECHNIQUE.reviewRequiredBelowPercent,
    });
    const saved = completeT01DirectSet({
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
    resetT01DirectPracticeScores();
    setIndex(0);
    setFirstPassResults({});
    setPhase("active");
    resetCurrentInput();
    setProgress(markT01PracticeStarted());
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
              Current state: <span className="font-semibold text-foreground">{progress.state}</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Timing is not scored. Full multi-set mastery (recognition, error, exam) will expand in
            later pilot work.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" className="min-h-11" onClick={handleRestart}>
              Restart direct practice
            </Button>
            <Link
              to="/math-speed-lab/square-ending-5"
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
        <p className="font-mono text-xs text-muted-foreground">{question.questionId}</p>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <h2 className="text-xl font-bold leading-snug tracking-tight">{question.prompt}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumericAnswerInput
            key={question.questionId}
            label={`Exact value of ${question.operand} squared`}
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
