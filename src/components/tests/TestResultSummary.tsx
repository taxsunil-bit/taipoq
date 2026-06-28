import type { ScoreSummary } from "@/lib/tests/testScoring";

type TestResultSummaryProps = {
  title: string;
  result: ScoreSummary;
  attemptedAt?: string;
};

export function TestResultSummary({ title, result, attemptedAt }: TestResultSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold text-foreground">परिणाम / Result</h2>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Score" value={`${result.score}/${result.total}`} />
        <Stat label="Percentage" value={`${result.percentage}%`} />
        <Stat label="सही" value={result.correctIds.length} />
        <Stat label="गलत" value={result.wrongIds.length} />
      </div>
      {attemptedAt ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Attempted: {new Date(attemptedAt).toLocaleString()}
        </p>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
