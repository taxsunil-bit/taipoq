import { Badge } from "@/components/ui/badge";
import type { MockTestAnalysis, MockTestScoreResult } from "@/types/mockTest";

type MockTestResultSummaryProps = {
  title: string;
  result: MockTestScoreResult;
  analysis: MockTestAnalysis;
  attemptedAt?: string;
};

export function MockTestResultSummary({
  title,
  result,
  analysis,
  attemptedAt,
}: MockTestResultSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6" aria-labelledby="mock-result-heading">
      <h2 id="mock-result-heading" className="font-display text-xl font-bold text-foreground">
        परिणाम / Result
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Score" value={`${result.score}/${result.maximumMarks}`} />
        <Stat label="Percentage" value={`${result.percentage}%`} />
        <Stat label="सही" value={result.correct} />
        <Stat label="गलत" value={result.incorrect} />
        <Stat label="Unanswered" value={result.unanswered} />
        <Stat label="Attempted" value={result.attempted} />
        <Stat label="Negative marks" value={result.negativeMarks} />
        <Stat label="Accuracy" value={`${analysis.accuracy}%`} />
      </div>

      {typeof result.passed === "boolean" ? (
        <div className="mt-3">
          <Badge
            className={
              result.passed
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground"
            }
          >
            {result.passed ? "Pass" : "Fail"}
          </Badge>
        </div>
      ) : null}

      <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed text-foreground">
        {analysis.recommendation}
      </p>

      {analysis.weakAreas.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weak areas</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {analysis.weakAreas.map((area) => (
              <li key={area}>
                <Badge variant="outline">{area}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
