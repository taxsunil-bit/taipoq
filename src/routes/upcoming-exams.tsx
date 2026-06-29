import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getVerifiedPublicVacancies,
  isVerifiedVacanciesEnabled,
  loadVacanciesPreview,
} from "@/lib/vacancies";
import {
  formatDateDDMMYYYY,
  formatDisplayDate,
  getPrepareLinkLabel,
  loadUpcomingExams,
  resolvePrepareLink,
} from "@/lib/upcomingExams";
import { cn } from "@/lib/utils";
import type { VacancyItem } from "@/types/vacancy";
import type { UpcomingExam } from "@/types/upcomingExams";

export const Route = createFileRoute("/upcoming-exams")({
  head: () => ({
    meta: [
      { title: "Upcoming Exams & Job Updates — TAIPOQ" },
      {
        name: "description",
        content:
          "Upcoming government exams and verified job updates with official source links and TAIPOQ preparation.",
      },
    ],
  }),
  component: UpcomingExamsPage,
});

type TypingFilter = "all" | "yes" | "no";

type ExamDisplay = {
  statusBadge: string;
  statusLine?: string;
  correctionLine?: string;
  correctionLabel?: string;
  notificationLine: string;
  lastDateLine: string;
  examLine: string;
  qualificationLine: string;
  showTyping: boolean;
  typingLine: string;
};

const compactBtn =
  "h-9 min-h-10 px-2.5 text-xs sm:h-9 sm:min-h-9 sm:px-3 sm:text-sm whitespace-nowrap";

const ctaBtn =
  "h-10 min-h-11 w-full px-4 text-sm sm:h-10 sm:min-h-10 sm:w-auto sm:min-w-[220px]";

const VAGUE_NOTIFICATION = "Official notification देखें";
const VAGUE_STATUS = "Official website check करें";

function hasExactDateHint(text: string): boolean {
  return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(text);
}

function isVagueExamWatchCard(exam: UpcomingExam): boolean {
  const notification = exam.notificationWindow.trim();
  const status = exam.status.trim();

  if (hasExactDateHint(notification) || hasExactDateHint(status)) {
    return false;
  }
  if (
    status.includes("समाप्त") ||
    status.includes("संशोधन") ||
    status.toLowerCase().includes("correction")
  ) {
    return false;
  }
  if (notification === VAGUE_NOTIFICATION || status === VAGUE_STATUS) {
    return true;
  }
  return notification.toLowerCase().includes("official calendar");
}

function shortenCalendarText(text: string, vague = false): string {
  const trimmed = text.trim();
  if (vague || !trimmed || trimmed === VAGUE_NOTIFICATION) {
    return "Official calendar देखें";
  }
  if (trimmed.toLowerCase().includes("official calendar")) {
    return "Official calendar देखें";
  }
  if (trimmed.length > 72) {
    return `${trimmed.slice(0, 69)}…`;
  }
  return trimmed;
}

function getExamDisplay(exam: UpcomingExam): ExamDisplay {
  if (exam.id === "ssc-cgl-2026") {
    return {
      statusBadge: "संशोधन अवधि",
      statusLine: "आवेदन समाप्त",
      correctionLine: "01/07/2026 से 03/07/2026",
      correctionLabel: "संशोधन अवधि",
      notificationLine: "आवेदन समाप्त",
      lastDateLine: "आवेदन समाप्त",
      examLine: "final dates ssc.gov.in पर देखें",
      qualificationLine: exam.qualification,
      showTyping: false,
      typingLine: "",
    };
  }

  const vague = isVagueExamWatchCard(exam);

  return {
    statusBadge: vague ? "Exam Watch" : exam.status,
    notificationLine: vague ? "तिथि घोषित नहीं" : shortenCalendarText(exam.notificationWindow),
    lastDateLine: vague
      ? "तिथि घोषित नहीं"
      : hasExactDateHint(exam.status)
        ? exam.status
        : "तिथि घोषित नहीं",
    examLine: shortenCalendarText(exam.examWindow, vague),
    qualificationLine: exam.qualification,
    showTyping: !vague,
    typingLine: exam.typingRequired,
  };
}

function UpcomingExamsPage() {
  const verifiedEnabled = isVerifiedVacanciesEnabled();
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [fromFallback, setFromFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  const [verifiedVacancies, setVerifiedVacancies] = useState<VacancyItem[]>([]);
  const [verifiedLoading, setVerifiedLoading] = useState(verifiedEnabled);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
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

  useEffect(() => {
    if (!verifiedEnabled) return;

    let cancelled = false;
    loadVacanciesPreview().then((result) => {
      if (cancelled) return;
      setVerifiedVacancies(getVerifiedPublicVacancies(result.payload.items));
      setVerifiedLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [verifiedEnabled]);

  const activeExams = useMemo(() => exams.filter((e) => e.active), [exams]);

  const departments = useMemo(
    () => [...new Set(activeExams.map((e) => e.department))].sort(),
    [activeExams],
  );

  const statuses = useMemo(
    () => [...new Set(activeExams.map((e) => e.status))].sort(),
    [activeExams],
  );

  const filteredExams = useMemo(() => {
    return activeExams.filter((exam) => {
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
  }, [activeExams, department, status, typingFilter, query]);

  const datedExamCards = useMemo(
    () => filteredExams.filter((exam) => !isVagueExamWatchCard(exam)),
    [filteredExams],
  );

  const watchlistExamCards = useMemo(
    () => filteredExams.filter((exam) => isVagueExamWatchCard(exam)),
    [filteredExams],
  );

  const watchlistCount = watchlistExamCards.length;
  const datedUpdateCount = datedExamCards.length;

  const filtersActive =
    query.trim() !== "" ||
    department !== "all" ||
    status !== "all" ||
    typingFilter !== "all";

  const listLoading = loading || (verifiedEnabled && verifiedLoading);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-3">
        <PageHeader
          title="Upcoming Exams & Job Updates"
          subtitle="Official links और preparation — final details official website पर verify करें।"
        />

        <Card className="border-amber-400/40 bg-amber-500/15">
          <CardContent className="space-y-1 p-2.5 text-[11px] leading-relaxed sm:p-3 sm:text-xs">
            <p className="font-semibold text-amber-50">Important disclaimer</p>
            <p className="text-amber-100/90">
              यह page अभ्यास-दिशा और official links के लिए है। आवेदन से पहले visitor स्वयं official
              website पर final दिनांक, योग्यता, fee और नियम check करें। TAIPOQ final eligibility या
              dates की जिम्मेदारी नहीं लेता।
            </p>
          </CardContent>
        </Card>

        {fromFallback && !loading ? (
          <p className="text-[11px] text-muted-foreground">
            Data source unavailable. Showing saved exam list.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {verifiedEnabled ? (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
              Verified: {verifiedVacancies.length}
            </Badge>
          ) : null}
          <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
            Exam updates: {datedUpdateCount}
          </Badge>
          {lastUpdated ? (
            <span className="text-[10px] text-muted-foreground">
              Updated {formatDateDDMMYYYY(lastUpdated) || formatDisplayDate(lastUpdated)}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="text-[10px] text-muted-foreground underline-offset-2 hover:underline"
            aria-expanded={filtersOpen}
          >
            Filters
          </button>
        </div>

        {listLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : datedExamCards.length === 0 &&
          watchlistCount === 0 &&
          (!verifiedEnabled || verifiedVacancies.length === 0) ? (
          <Card className="border-border bg-card/80">
            <CardContent className="p-3 text-sm text-muted-foreground">
              No exams match your filters. Try clearing filters or check back later.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            <ul className="flex flex-col gap-2">
              {verifiedEnabled
                ? verifiedVacancies.map((item) => (
                    <VerifiedVacancyCard key={item.id} item={item} />
                  ))
                : null}
              {datedExamCards.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </ul>

            {watchlistCount > 0 ? (
              <OtherExamUpdatesSection
                count={watchlistCount}
                open={watchlistOpen}
                onToggle={() => setWatchlistOpen((value) => !value)}
                exams={watchlistExamCards}
              />
            ) : null}
          </div>
        )}

        {filtersOpen ? (
          <Card className="border-border/60 bg-card/50 shadow-none">
            <CardContent className="grid gap-2 p-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="exam-search" className="text-xs">
                  Search
                </Label>
                <Input
                  id="exam-search"
                  className="h-8 text-sm"
                  placeholder="Exam name, department…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <FilterSelect
                id="department-filter"
                label="Department"
                value={department}
                onChange={setDepartment}
                options={[
                  { value: "all", label: "All departments" },
                  ...departments.map((d) => ({ value: d, label: d })),
                ]}
              />
              <FilterSelect
                id="status-filter"
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "All statuses" },
                  ...statuses.map((s) => ({ value: s, label: s })),
                ]}
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
              {filtersActive ? (
                <p className="text-[11px] text-muted-foreground sm:col-span-2">
                  Filters active — list may differ from default view.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}

function OtherExamUpdatesSection({
  count,
  open,
  onToggle,
  exams,
}: {
  count: number;
  open: boolean;
  onToggle: () => void;
  exams: UpcomingExam[];
}) {
  return (
    <section className="rounded-xl border border-border/80 bg-muted/10 p-3 sm:p-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">अन्य परीक्षा सूचनाएँ</h2>
        <p className="text-xs text-muted-foreground">
          SSC, Railway, Banking, Defence और अन्य exam calendar links.
        </p>
        <p className="text-[11px] text-muted-foreground">{count} exam updates available.</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={cn(
          buttonVariants({ variant: open ? "secondary" : "default", size: "sm" }),
          ctaBtn,
          "mt-3",
        )}
        aria-expanded={open}
      >
        {open ? "सूचनाएँ छिपाएँ" : `सभी ${count} सूचनाएँ दिखाएँ`}
      </button>

      {open ? (
        <ul className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} watchlist />
          ))}
        </ul>
      ) : null}
    </section>
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
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

function ExamCard({ exam, watchlist = false }: { exam: UpcomingExam; watchlist?: boolean }) {
  const prepare = resolvePrepareLink(exam.prepareLink);
  const prepareLabel = getPrepareLinkLabel(exam.prepareLink);
  const display = getExamDisplay(exam);
  const vagueDates = watchlist;

  return (
    <li>
      <Card
        className={cn(
          "border-border/70 bg-card/80 shadow-sm",
          watchlist && "border-dashed bg-card/60",
        )}
      >
        <CardContent className="space-y-2 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="px-1.5 py-0 text-[11px] font-normal">
              {exam.department}
            </Badge>
            <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-medium text-foreground">
              {display.statusBadge}
            </Badge>
          </div>

          <h3 className="text-sm font-semibold leading-snug text-foreground">{exam.examName}</h3>

          <div className="space-y-0.5 text-xs leading-snug">
            {display.statusLine ? (
              <p>
                <span className="text-muted-foreground">स्थिति: </span>
                <span className="font-medium text-foreground">{display.statusLine}</span>
              </p>
            ) : null}
            {display.correctionLine ? (
              <p>
                <span className="text-muted-foreground">
                  {display.correctionLabel ?? "संशोधन"}:{" "}
                </span>
                <span className="font-semibold text-foreground">{display.correctionLine}</span>
              </p>
            ) : null}
            <p>
              <span className="text-muted-foreground">सूचना: </span>
              <span className={vagueDates ? "text-muted-foreground" : "text-foreground"}>
                {display.notificationLine}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">अंतिम तिथि: </span>
              <span
                className={
                  vagueDates ? "text-muted-foreground" : "font-semibold text-foreground"
                }
              >
                {display.lastDateLine}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">परीक्षा: </span>
              <span className={vagueDates ? "text-muted-foreground" : "text-foreground"}>
                {display.examLine}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">योग्यता: </span>
              {display.qualificationLine}
            </p>
            {display.showTyping ? (
              <p>
                <span className="text-muted-foreground">Typing: </span>
                {display.typingLine}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <a
              href={exam.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
            >
              Official Source
            </a>

            {prepare.external ? (
              <a
                href={prepare.to}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn)}
              >
                Prepare
              </a>
            ) : prepare.to === "/test" && "search" in prepare ? (
              <Link
                to="/test"
                search={prepare.search}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn)}
              >
                {prepareLabel}
              </Link>
            ) : (
              <Link
                to={prepare.to}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn)}
              >
                Prepare
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
