import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PageShell } from "@/components/PageShell";
import { GeneralAwarenessResult } from "@/components/GeneralAwarenessResult";
import {
  calculateGAScore,
  clearGAProgress,
  formatTimer,
  loadGAProgress,
  saveGAProgress,
  type GATestData,
  type GAProgressState,
} from "@/types/generalAwarenessTest";
import { cn } from "@/lib/utils";

type Phase = "loading" | "error" | "instructions" | "test" | "confirm" | "result";

type GeneralAwarenessTestProps = {
  dataUrl: string;
};

export function GeneralAwarenessTest({ dataUrl }: GeneralAwarenessTestProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [testData, setTestData] = useState<GATestData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState<GAProgressState | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(dataUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GATestData;
        if (!data.questions?.length) throw new Error("प्रश्न सूची खाली है");
        if (cancelled) return;
        setTestData(data);

        const saved = loadGAProgress();
        if (saved?.submitted) {
          setProgress(saved);
          setPhase("result");
        } else if (saved?.startedAt) {
          setProgress(saved);
          setPhase("test");
        } else {
          setPhase("instructions");
        }
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "डेटा लोड नहीं हो सका");
        setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  const persist = useCallback((next: GAProgressState) => {
    setProgress(next);
    saveGAProgress(next);
  }, []);

  const submitTest = useCallback(
    (state: GAProgressState) => {
      const submitted: GAProgressState = { ...state, submitted: true };
      persist(submitted);
      setShowConfirm(false);
      setPhase("result");
    },
    [persist],
  );

  useEffect(() => {
    if (phase !== "test" || !progress || progress.submitted || !testData) return;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (!prev || prev.submitted) return prev;
        const nextSeconds = prev.remainingSeconds - 1;
        if (nextSeconds <= 0) {
          const autoSubmit: GAProgressState = { ...prev, remainingSeconds: 0, submitted: true };
          saveGAProgress(autoSubmit);
          window.setTimeout(() => setPhase("result"), 0);
          return autoSubmit;
        }
        const next: GAProgressState = { ...prev, remainingSeconds: nextSeconds };
        saveGAProgress(next);
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, progress?.startedAt, testData]);

  const startTest = () => {
    if (!testData) return;
    const initial: GAProgressState = {
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0,
      answers: {},
      remainingSeconds: testData.durationMinutes * 60,
      submitted: false,
    };
    persist(initial);
    setPhase("test");
  };

  const handleRestart = () => {
    clearGAProgress();
    setProgress(null);
    setShowConfirm(false);
    setPhase("instructions");
  };

  const scoreResult = useMemo(() => {
    if (!testData || !progress) return null;
    return calculateGAScore(testData, progress.answers);
  }, [testData, progress]);

  const attemptedCount = progress ? Object.keys(progress.answers).length : 0;
  const totalQuestions = testData?.totalQuestions ?? 0;
  const leftCount = totalQuestions - attemptedCount;

  const selectAnswer = (optionIndex: number) => {
    if (!testData || !progress || progress.submitted) return;
    const q = testData.questions[progress.currentQuestionIndex];
    if (!q) return;
    persist({
      ...progress,
      answers: { ...progress.answers, [q.id]: optionIndex },
    });
  };

  const goPrev = () => {
    if (!progress || progress.currentQuestionIndex <= 0) return;
    persist({ ...progress, currentQuestionIndex: progress.currentQuestionIndex - 1 });
  };

  const goNext = () => {
    if (!testData || !progress) return;
    if (progress.currentQuestionIndex >= testData.questions.length - 1) return;
    persist({ ...progress, currentQuestionIndex: progress.currentQuestionIndex + 1 });
  };

  const shell = (children: ReactNode) => (
    <PageShell>
      <div className="min-h-[calc(100vh-8rem)] overflow-x-hidden bg-slate-50">{children}</div>
    </PageShell>
  );

  if (phase === "loading") {
    return shell(
      <div className="mx-auto max-w-3xl p-6 text-center font-hindi">
        <p className="text-lg text-slate-700">अभ्यास लोड हो रहा है…</p>
      </div>,
    );
  }

  if (phase === "error") {
    return shell(
      <div className="mx-auto max-w-3xl space-y-4 p-6 font-hindi">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <p className="font-semibold">अभ्यास लोड नहीं हो सका</p>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:w-auto"
        >
          पुनः प्रयास करें
        </button>
      </div>,
    );
  }

  if (phase === "result" && testData && progress && scoreResult) {
    return shell(
      <GeneralAwarenessResult
        testData={testData}
        answers={progress.answers}
        score={scoreResult}
        onRestart={handleRestart}
      />,
    );
  }

  if (phase === "instructions" && testData) {
    return shell(
      <div className="mx-auto max-w-3xl space-y-5 p-4 font-hindi sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{testData.titleHi}</h1>
          <p className="mt-2 text-base text-slate-600">{testData.descriptionHi}</p>

          <ul className="mt-5 space-y-2 text-base text-slate-700">
            <li>• {testData.totalQuestions} प्रश्न</li>
            <li>• {testData.durationMinutes} मिनट</li>
            <li>• {testData.totalMarks} अंक</li>
            <li>• ऋणात्मक अंकन: {testData.negativeMarking ? "हाँ" : "नहीं"}</li>
            <li>• स्तर: {testData.level}</li>
          </ul>

          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900 sm:text-base">
            <p className="font-semibold">निर्देश:</p>
            <ul className="mt-2 list-none space-y-1.5">
              <li>• प्रत्येक प्रश्न के चार विकल्प हैं।</li>
              <li>• एक सही उत्तर चुनें।</li>
              <li>• उत्तर अभ्यास जमा करने के बाद दिखेगा।</li>
              <li>• Page refresh होने पर आपका अभ्यास सुरक्षित रहेगा।</li>
              <li>• समय समाप्त होने पर अभ्यास अपने आप जमा हो जाएगा।</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={startTest}
            className="mt-6 min-h-12 w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            अभ्यास आरम्भ करें
          </button>
        </div>
      </div>,
    );
  }

  if (phase === "test" && testData && progress) {
    const q = testData.questions[progress.currentQuestionIndex];
    const selected = q ? progress.answers[q.id] : undefined;
    const isLast = progress.currentQuestionIndex >= testData.questions.length - 1;

    return shell(
      <div className="relative mx-auto max-w-3xl space-y-4 overflow-x-hidden p-4 font-hindi sm:p-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-600">{testData.titleHi}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                प्रश्न {progress.currentQuestionIndex + 1} / {testData.totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center">
              <p className="text-xs text-blue-700">समय</p>
              <p className="font-mono text-xl font-bold text-blue-800">
                {formatTimer(progress.remainingSeconds)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
            <span>उत्तर दिए: {attemptedCount}</span>
            <span>बाकी: {leftCount}</span>
          </div>
        </header>

        {q && (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {q.topic}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {q.difficulty}
              </span>
            </div>
            <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
              {q.question}
            </p>
            <div className="mt-5 space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectAnswer(idx)}
                  className={cn(
                    "flex min-h-12 w-full items-center rounded-xl border px-4 py-3 text-left text-base leading-relaxed transition-colors sm:text-lg",
                    selected === idx
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50",
                  )}
                >
                  <span className="mr-3 shrink-0 font-semibold text-slate-500">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </article>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={goPrev}
            disabled={progress.currentQuestionIndex === 0}
            className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 disabled:opacity-40 sm:min-w-[8rem] sm:flex-none"
          >
            पिछला
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={goNext}
              className="min-h-12 flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:min-w-[8rem] sm:flex-none"
            >
              अगला
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className={cn(
              "min-h-12 flex-1 rounded-xl px-4 py-3 font-semibold sm:min-w-[10rem] sm:flex-none",
              isLast
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100",
            )}
          >
            अभ्यास जमा करें
          </button>
        </div>

        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirm-title"
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
              <h2 id="submit-confirm-title" className="text-lg font-bold text-slate-900">
                क्या आप अभ्यास जमा करना चाहते हैं?
              </h2>
              <ul className="mt-4 space-y-2 text-base text-slate-700">
                <li>कुल प्रश्न: {testData.totalQuestions}</li>
                <li>उत्तर दिए गए: {attemptedCount}</li>
                <li>बाकी: {leftCount}</li>
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800"
                >
                  नहीं, वापस जाएँ
                </button>
                <button
                  type="button"
                  onClick={() => submitTest(progress)}
                  className="min-h-12 flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  हाँ, जमा करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>,
    );
  }

  return null;
}
