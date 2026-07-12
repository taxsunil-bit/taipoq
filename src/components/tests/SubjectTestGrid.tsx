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
            className="flex min-h-[52px] flex-col justify-center rounded-xl border border-blue-300/30 bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3.5 text-white shadow-md shadow-blue-950/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-600/20"
          >
            <span className="text-base font-semibold leading-snug">{subject.title}</span>
            <span className="mt-1 text-sm text-blue-100">
              {subject.freeCount === 0
                ? `${subject.paperCount} paper${subject.paperCount === 1 ? "" : "s"} available`
                : `${subject.freeCount} free paper${subject.freeCount === 1 ? "" : "s"} · ${subject.paperCount} total`}
            </span>
            {subject.hasCurrentAffairs ? (
              <span className="mt-1 text-[11px] text-amber-100/90">
                Date-stamped archive — refresh before long-term use
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
