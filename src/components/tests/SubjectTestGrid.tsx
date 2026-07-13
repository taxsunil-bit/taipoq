import { Link } from "@tanstack/react-router";
import type { TestSubjectMeta } from "@/content/tests/subjects";
import { cn } from "@/lib/utils";

type SubjectTestGridProps = {
  subjects: TestSubjectMeta[];
  className?: string;
};

export function SubjectTestGrid({ subjects, className }: SubjectTestGridProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {subjects.map((subject) => (
        <li key={subject.slug}>
          <Link
            to="/tests/$subject"
            params={{ subject: subject.slug }}
            className="flex min-h-[52px] flex-col justify-center rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3.5 shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] hover:-translate-y-px hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="flex items-center gap-2 text-base font-semibold leading-snug text-[var(--text-primary)]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {subject.title}
            </span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">
              {subject.freeCount === 0
                ? `${subject.paperCount} paper${subject.paperCount === 1 ? "" : "s"} available`
                : `${subject.freeCount} free paper${subject.freeCount === 1 ? "" : "s"} · ${subject.paperCount} total`}
            </span>
            {subject.hasCurrentAffairs ? (
              <span className="mt-1 text-[11px] text-[var(--status-warning)]">
                Date-stamped archive — refresh before long-term use
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
