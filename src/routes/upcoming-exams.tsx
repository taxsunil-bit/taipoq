import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatDisplayDate,
  getPrepareLinkLabel,
  loadUpcomingExams,
  resolvePrepareLink,
} from "@/lib/upcomingExams";
import { cn } from "@/lib/utils";
import type { UpcomingExam } from "@/types/upcomingExams";

export const Route = createFileRoute("/upcoming-exams")({
  head: () => ({
    meta: [
      { title: "Upcoming Exams — TAIPOQ" },
      {
        name: "description",
        content:
          "Human-verified upcoming government exam list with official source links and TAIPOQ typing and study preparation.",
      },
    ],
  }),
  component: UpcomingExamsPage,
});

type TypingFilter = "all" | "yes" | "no";

function UpcomingExamsPage() {
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [fromFallback, setFromFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [typingFilter, setTypingFilter] = useState<TypingFilter>("all");

  useEffect(() => {
    let cancelled = false;
    loadUpcomingExams().then((result) => {
      if (cancelled) return;
      setExams(result.payload.exams);
      setLastUpdated(result.payload.lastUpdated);
      setFromFallback(result.fromFallback);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(
    () => [...new Set(exams.map((e) => e.department))].sort(),
    [exams],
  );

  const statuses = useMemo(
    () => [...new Set(exams.map((e) => e.status))].sort(),
    [exams],
  );

  const filtered = useMemo(() => {
    return exams.filter((exam) => {
      if (department !== "all" && exam.department !== department) return false;
      if (status !== "all" && exam.status !== status) return false;

      if (typingFilter === "yes") {
        const t = exam.typingRequired.toLowerCase();
        if (!t.includes("yes") && !t.startsWith("yes")) return false;
      }
      if (typingFilter === "no") {
        const t = exam.typingRequired.toLowerCase();
        if (t.includes("yes")) return false;
      }

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = [
          exam.examName,
          exam.department,
          exam.qualification,
          exam.preparationFocus,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [exams, department, status, typingFilter, query]);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Upcoming Exams"
          subtitle="Human-verified exam list with official source links. Always confirm dates and eligibility on the official notification before applying."
        />

        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="space-y-2 p-5 text-sm leading-relaxed text-amber-100">
            <p className="font-semibold text-amber-50">Important disclaimer</p>
            <p>
              यह page केवल अभ्यास-दिशा और official link देने के लिए है। आवेदन करने से पहले
              visitor स्वयं official website पर जाकर final दिनांक, योग्यता, fee, syllabus, admit
              card, answer key, result, vacancy count, reservation, physical test, document
              verification और नियम अवश्य check करें।
            </p>
            <p className="text-amber-100/90">
              TAIPOQ final date, fee, eligibility, syllabus, admit card, answer key, result,
              vacancy count, reservation, physical test, document verification, or rules की
              जिम्मेदारी नहीं लेता।
            </p>
          </CardContent>
        </Card>

        {fromFallback && !loading && (
          <Card className="border-border bg-card/80">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Data source unavailable. Showing saved exam list.
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>
            Last Updated:{" "}
            <strong className="text-foreground">{formatDisplayDate(lastUpdated)}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
            {exams.length} active exams
          </span>
        </div>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Filter exams</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="exam-search">Search</Label>
              <Input
                id="exam-search"
                placeholder="Search exam name, department, qualification..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <FilterSelect
              id="department-filter"
              label="Department"
              value={department}
              onChange={setDepartment}
              options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]}
            />
            <FilterSelect
              id="status-filter"
              label="Status"
              value={status}
              onChange={setStatus}
              options={[{ value: "all", label: "All statuses" }, ...statuses.map((s) => ({ value: s, label: s }))]}
            />
            <FilterSelect
              id="typing-filter"
              label="Typing required"
              value={typingFilter}
              onChange={(v) => setTypingFilter(v as TypingFilter)}
              options={[
                { value: "all", label: "All" },
                { value: "yes", label: "Typing required" },
                { value: "no", label: "No typing / study only" },
              ]}
            />
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading exam list…</p>
        ) : filtered.length === 0 ? (
          <Card className="border-border bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No exams match your filters. Try clearing filters or check back after the data source
              is updated.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4">
            {filtered.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExamCard({ exam }: { exam: UpcomingExam }) {
  const prepare = resolvePrepareLink(exam.prepareLink);
  const prepareLabel = getPrepareLinkLabel(exam.prepareLink);
  const actionButtonClass =
    "h-auto min-h-11 max-w-full whitespace-normal break-words text-center";

  return (
    <li>
      <Card className="border-border bg-card/80">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl leading-snug">{exam.examName}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{exam.department}</p>
            </div>
            <Badge variant="outline">{exam.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="Qualification" value={exam.qualification} />
            <InfoItem label="Notification window" value={exam.notificationWindow} />
            <InfoItem label="Exam window" value={exam.examWindow} />
            <InfoItem label="Typing required" value={exam.typingRequired} />
            <InfoItem label="Preparation focus" value={exam.preparationFocus} className="sm:col-span-2" />
            <InfoItem
              label="Last Checked"
              value={formatDisplayDate(exam.lastChecked)}
            />
          </dl>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={exam.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), actionButtonClass)}
            >
              Official Source — {exam.officialSourceLabel}
            </a>

            {prepare.external ? (
              <a
                href={prepare.to}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), actionButtonClass)}
              >
                {prepareLabel}
              </a>
            ) : prepare.to === "/test" && "search" in prepare ? (
              <Link
                to="/test"
                search={prepare.search}
                className={cn(buttonVariants({ size: "lg" }), actionButtonClass)}
              >
                {prepareLabel}
              </Link>
            ) : (
              <Link
                to={prepare.to as "/study-corner" | "/study-corner/general-awareness"}
                className={cn(buttonVariants({ size: "lg" }), actionButtonClass)}
              >
                {prepareLabel}
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </li>
  );
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}
