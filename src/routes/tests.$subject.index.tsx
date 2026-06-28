import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TestCard } from "@/components/tests/TestCard";
import { PageShell } from "@/components/PageShell";
import { getSubjectBySlug, getSubjectTitle } from "@/content/tests/subjects";
import { canAccessPaper } from "@/lib/tests/testAccess";
import { getPapersForSubject } from "@/lib/tests/testGenerator";

export const Route = createFileRoute("/tests/$subject/")({
  head: ({ params }) => ({
    meta: [{ title: `${getSubjectTitle(params.subject)} Tests — TAIPOQ` }],
  }),
  component: SubjectTestsPage,
});

function SubjectTestsPage() {
  const { subject } = Route.useParams();
  const meta = getSubjectBySlug(subject);
  if (!meta) throw notFound();

  const papers = getPapersForSubject(subject);
  const freeFirst = [...papers].sort((a, b) => {
    const aFree = canAccessPaper(a) ? 0 : 1;
    const bFree = canAccessPaper(b) ? 0 : 1;
    return aFree - bFree;
  });

  const isCA = meta.hasCurrentAffairs;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <header className="space-y-2">
          <Link to="/tests" className="text-sm text-muted-foreground hover:text-foreground">
            ← All Tests
          </Link>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{meta.title}</h1>
          <p className="text-muted-foreground">
            {meta.freeCount} free · {meta.paperCount} paper{meta.paperCount === 1 ? "" : "s"}
          </p>
          {isCA ? (
            <p className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-sm text-amber-100/90">
              Current Affairs questions are date-stamped. Refresh before long-term use.
            </p>
          ) : null}
        </header>

        <ul className="space-y-3">
          {freeFirst.map((paper) => (
            <li key={paper.paperId}>
              <TestCard paper={paper} subjectSlug={subject} />
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
