import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { CurrentAffairsPaper } from "@/content/currentAffairsPapers";
import { formatTopicLabel } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";

type Score = {
  correct: number;
  wrong: number;
  total: number;
};

type Props = {
  paper: CurrentAffairsPaper;
  answers: Record<string, number>;
  score: Score;
  onRetake: () => void;
};

type TopicStat = {
  topic: string;
  correct: number;
  total: number;
};

function buildTopicStats(paper: CurrentAffairsPaper, answers: Record<string, number>): TopicStat[] {
  const map = new Map<string, TopicStat>();
  for (const q of paper.questions) {
    const entry = map.get(q.topic) ?? { topic: formatTopicLabel(q.topic), correct: 0, total: 0 };
    entry.total += 1;
    if (answers[q.id] === q.answerIndex) entry.correct += 1;
    map.set(q.topic, entry);
  }
  return [...map.values()];
}

const BTN =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition-colors sm:w-auto";

export function CurrentAffairsResultView({ paper, answers, score, onRetake }: Props) {
  const topicStats = useMemo(() => buildTopicStats(paper, answers), [paper, answers]);
  const weakTopics = topicStats.filter((t) => t.correct < t.total);

  const percent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-5 font-hindi">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Test Result</h2>
        <p className="mt-2 text-3xl font-bold text-blue-700">
          {score.correct} / {score.total}{" "}
          <span className="text-lg font-semibold text-slate-600">({percent}%)</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
            सही: {score.correct}
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-800">
            गलत: {score.wrong}
          </span>
        </div>
      </section>

      {weakTopics.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-base font-bold text-amber-900">Topic-wise सुधार संकेत</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900">
            {weakTopics.map((t) => (
              <li key={t.topic} className="rounded-xl border border-amber-200 bg-white/70 px-4 py-3">
                <span className="font-semibold">{t.topic}</span>
                <span className="text-amber-800">
                  {" "}
                  — {t.correct}/{t.total} सही। इस topic के notes और Practice Mode दोहराएँ।
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onRetake}
          className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}
        >
          Retake Test
        </button>
        <Link
          to="/current-affairs/paper/$paperId"
          params={{ paperId: paper.id }}
          search={{ mode: "practice" }}
          className={cn(BTN, "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100")}
        >
          Practice This Paper
        </Link>
        <Link
          to="/current-affairs"
          className={cn(BTN, "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50")}
        >
          Back to Current Affairs
        </Link>
      </section>
    </div>
  );
}
