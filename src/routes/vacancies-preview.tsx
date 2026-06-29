import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VacancyPreviewCard } from "@/components/VacancyPreviewCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countVacanciesByStatus, loadVacanciesPreview } from "@/lib/vacancies";
import { formatDisplayDate } from "@/lib/upcomingExams";
import type { VacancyItem, VacancySourceType, VacancyStatus } from "@/types/vacancy";
import { VACANCY_SOURCE_TYPES, VACANCY_STATUSES } from "@/types/vacancy";

export const Route = createFileRoute("/vacancies-preview")({
  head: () => ({
    meta: [
      { title: "Vacancy Preview — Internal Review — TAIPOQ" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Internal preview of TAIPOQ vacancy cards. Not for public vacancy publication.",
      },
    ],
  }),
  component: VacanciesPreviewPage,
});

function VacanciesPreviewPage() {
  const [items, setItems] = useState<VacancyItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [source, setSource] = useState("");
  const [loadError, setLoadError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VacancyStatus>("all");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<"all" | VacancySourceType>("all");
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadVacanciesPreview().then((result) => {
      if (cancelled) return;
      setItems(result.payload.items);
      setLastUpdated(result.payload.lastUpdated);
      setSource(result.payload.source);
      setLoadError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => countVacanciesByStatus(items), [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeOnly && !item.active) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (sourceTypeFilter !== "all" && item.sourceType !== sourceTypeFilter) return false;

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = [
          item.title,
          item.organisation,
          item.category,
          item.statusLabel,
          item.trustNote,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [items, activeOnly, statusFilter, sourceTypeFilter, query]);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Vacancy Preview — Internal Review"
          subtitle="Direct URL only. This page is not linked from Home, Nav, or Footer."
          accent="english"
        />

        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">
              This is a preview-only internal review page.
            </p>
            <p className="mt-2">
              Do not treat <code className="text-xs">verification_pending</code> records as live
              vacancies. The public site still uses{" "}
              <code className="text-xs">/upcoming-exams</code> with{" "}
              <code className="text-xs">upcoming-exams.json</code>.
            </p>
          </CardContent>
        </Card>

        {loadError ? (
          <Card className="border-border bg-card/80">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Could not load preview data: {loadError}
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-border bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <SummaryStat label="Total" value={counts.total} />
            <SummaryStat label="Active flag" value={counts.active} />
            <SummaryStat label="verification_pending" value={counts.verification_pending} />
            <SummaryStat label="correction_window" value={counts.correction_window} />
            <SummaryStat label="archive" value={counts.archive} />
            <SummaryStat label="preparation_only*" value={counts.preparation_only} />
            <SummaryStat label="with applyUrl" value={counts.withApplyUrl} />
            <SummaryStat
              label="Data updated"
              value={lastUpdated ? formatDisplayDate(lastUpdated) : "—"}
            />
          </CardContent>
          {source ? (
            <CardContent className="pt-0 text-xs text-muted-foreground">Source: {source}</CardContent>
          ) : null}
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vacancy-preview-search">Search</Label>
              <Input
                id="vacancy-preview-search"
                placeholder="Title, organisation, category, status label..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <FilterSelect
              id="vacancy-status-filter"
              label="Status"
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as "all" | VacancyStatus)}
              options={[
                { value: "all", label: "All statuses" },
                ...VACANCY_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
            <FilterSelect
              id="vacancy-source-filter"
              label="Source type"
              value={sourceTypeFilter}
              onChange={(v) => setSourceTypeFilter(v as "all" | VacancySourceType)}
              options={[
                { value: "all", label: "All source types" },
                ...VACANCY_SOURCE_TYPES.map((s) => ({ value: s, label: s })),
              ]}
            />
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="vacancy-active-only"
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="h-4 w-4 rounded border border-input"
              />
              <Label htmlFor="vacancy-active-only" className="cursor-pointer font-normal">
                Show active only (active flag = true)
              </Label>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
          {items.length} preview records
        </p>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading preview data…</p>
        ) : filtered.length === 0 ? (
          <Card className="border-border bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No preview records match your filters.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4">
            {filtered.map((item) => (
              <li key={item.id}>
                <VacancyPreviewCard item={item} />
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-muted-foreground">
          * preparation_only count includes items with isPreparationOnly flag or preparation_only
          status.
        </p>
      </div>
    </PageShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
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
