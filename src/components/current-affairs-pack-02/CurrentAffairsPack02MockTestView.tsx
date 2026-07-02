import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CurrentAffairsToughPack02 } from "@/content/tests/currentAffairsToughPack02";
import { TOUGH_PACK_02_TOPIC_LABELS } from "@/content/tests/currentAffairsToughPack02";
import {
  analyzePack02MockResult,
  createPack02SubmissionGuard,
  formatPack02NegativeMarkingLabel,
  getPack02ScoringContract,
  nextRemainingSeconds,
  scorePack02MockTest,
  shouldAutoSubmitAtSeconds,
} from "@/lib/currentAffairsPack02Scoring";
import { cn } from "@/lib/utils";
import { Pack02PaperHeader } from "./Pack02PaperHeader";
import { Pack02QuestionBlock } from "./Pack02QuestionBlock";

type Props = {
  pack: CurrentAffairsToughPack02;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const BTN =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition-colors sm:w-auto";

export function CurrentAffairsPack02MockTestView({ pack }: Props) {
  const total = pack.questions.length;
  const scoringContract = useMemo(() => getPack02ScoringContract(pack), [pack]);
  const submitGuardRef = useRef(createPack02SubmissionGuard());
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(scoringContract.durationSeconds);

  const question = pack.questions[index];
  const selectedIndex = answers[question.id] ?? null;

  const submitTest = useCallback(() => {
    submitGuardRef.current.trySubmit(() => {
      setFinished(true);
      setStarted(false);
    });
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (shouldAutoSubmitAtSeconds(prev)) {
          submitTest();
          return 0;
        }
        return nextRemainingSeconds(prev);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, finished, submitTest]);

  const scoreResult = useMemo(() => {
    if (!finished) return null;
    return scorePack02MockTest(pack, answers);
  }, [finished, pack, answers]);

  const analysis = useMemo(() => {
    if (!scoreResult) return null;
    return analyzePack02MockResult(pack, scoreResult);
  }, [scoreResult, pack]);

  const handleRetake = () => {
    submitGuardRef.current.reset();
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setStarted(false);
    setSecondsLeft(scoringContract.durationSeconds);
  };

  if (!started && !finished) {
    return (
      <div className="space-y-6 font-hindi">
        <Pack02PaperHeader pack={pack} mode="mock" />
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-lg font-bold text-blue-950">Mock Test निर्देश</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed text-blue-900">
            <li>कुल {pack.totalQuestions} प्रश्न — {pack.durationMinutes} मिनट</li>
            <li>हर सही उत्तर पर +{scoringContract.marksPerCorrect} अंक</li>
            <li>Submit से पहले उत्तर नहीं दिखेंगे</li>
            <li>Submit के बाद score, सही उत्तर और व्याख्या दिखेगी</li>
            <li>Negative marking: {formatPack02NegativeMarkingLabel(pack.negativeMarks)}</li>
          </ul>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-4 min-h-11 w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            Mock Test शुरू करें
          </button>
        </section>
      </div>
    );
  }

  if (finished && scoreResult) {
    return (
      <div className="space-y-5 font-hindi">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Mock Test Result</h2>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {scoreResult.correct} / {scoreResult.totalQuestions}{" "}
            <span className="text-lg font-semibold text-slate-600">({scoreResult.percentage}%)</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">
            कुल अंक: {scoreResult.score} / {scoreResult.maximumMarks}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              सही: {scoreResult.correct}
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-800">
              गलत: {scoreResult.incorrect}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              अनुत्तरित: {scoreResult.unanswered}
            </span>
          </div>
          {analysis?.recommendation ? (
            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
              {analysis.recommendation}
            </p>
          ) : null}
        </section>

        <section className="space-y-4" aria-labelledby="pack02-review-heading">
          <h2 id="pack02-review-heading" className="text-lg font-bold text-slate-900">
            उत्तर समीक्षा
          </h2>
          {pack.questions.map((q, i) => (
            <Pack02QuestionBlock
              key={q.id}
              question={q}
              questionIndex={i}
              totalQuestions={total}
              selectedIndex={answers[q.id] ?? null}
              revealAnswer
              disabled
            />
          ))}
        </section>

        <section className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleRetake}
            className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}
          >
            फिर से Mock Test दें
          </button>
          <Link
            to="/model-paper/current-affairs-pack-02"
            className={cn(BTN, "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100")}
          >
            Model Paper देखें
          </Link>
          <Link
            to="/current-affairs"
            className={cn(BTN, "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50")}
          >
            Current Affairs Hub
          </Link>
        </section>
      </div>
    );
  }

  const attempted = Object.keys(answers).length;
  const timerTone =
    secondsLeft <= 60 ? "text-red-700 bg-red-50 border-red-200" : "text-slate-700 bg-white border-slate-200";

  return (
    <div className="space-y-4 font-hindi">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <span className="font-medium text-slate-700">Mock Test — {pack.titleHindi}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-3 py-1 font-mono text-sm font-semibold", timerTone)}>
            ⏱ {formatTimer(secondsLeft)}
          </span>
          <span className="text-slate-500">
            {attempted}/{total} attempted
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Topic: {TOUGH_PACK_02_TOPIC_LABELS[question.topic]}
      </p>

      <Pack02QuestionBlock
        question={question}
        questionIndex={index}
        totalQuestions={total}
        selectedIndex={selectedIndex}
        onSelect={(optionIndex) => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
        revealAnswer={false}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={cn(
            "min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-800",
            index === 0 && "cursor-not-allowed opacity-50",
          )}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            if (index < total - 1) {
              setIndex((i) => i + 1);
              return;
            }
            submitTest();
          }}
          className="min-h-11 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          {index < total - 1 ? "Next Question" : "Submit Test"}
        </button>
      </div>
    </div>
  );
}
