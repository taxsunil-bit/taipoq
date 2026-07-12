import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  computePublicVacancySummary,
  filterVerifiedPublicVacanciesBySector,
  loadVacanciesLive,
  resolveVacancyDataUpdatedIso,
  type VerifiedJobSector,
} from "@/lib/vacancies";
import { getPublishedVacanciesSnapshot } from "@/lib/vacanciesPublishedSnapshot";
import { formatDateDDMMYYYY } from "@/lib/upcomingExams";
import { cn } from "@/lib/utils";
import type { VacanciesPayload, VacancyItem } from "@/types/vacancy";

export const Route = createFileRoute("/upcoming-exams")({
  head: () => ({
    meta: [
      { title: "Open Government Jobs — TAIPOQ" },
      {
        name: "description",
        content:
          "Open government job advertisements with official source links and clear verification status.",
      },
    ],
  }),
  component: UpcomingExamsPage,
});

type SectorOption = { id: VerifiedJobSector; label: string; primary?: boolean };

const SECTOR_OPTIONS: SectorOption[] = [
  { id: "all", label: "All Open", primary: true },
  { id: "banking", label: "Banking Exams", primary: true },
  { id: "railway", label: "Railway", primary: true },
  { id: "upsc", label: "UPSC", primary: true },
  { id: "state_psc", label: "State PSC / PCS", primary: true },
  { id: "judicial", label: "Judicial Exams", primary: true },
  { id: "defence", label: "Defence", primary: true },
  { id: "law_legal", label: "Law / Legal" },
  { id: "medical", label: "Medical" },
  { id: "apprenticeships", label: "Apprenticeships" },
  { id: "specialist_experienced", label: "Specialist / Experienced" },
  { id: "technical_research", label: "Technical / Research" },
  { id: "insurance", label: "Insurance" },
  { id: "dsssb", label: "DSSSB / Delhi Govt" },
  { id: "contract_local", label: "Contract / Local" },
];

const PRIMARY_SECTOR_IDS = new Set(
  SECTOR_OPTIONS.filter((row) => row.primary).map((row) => row.id),
);

function getSectorResultsTitle(sector: VerifiedJobSector): string {
  if (sector === "all") return "All Open Government Jobs";
  const option = SECTOR_OPTIONS.find((row) => row.id === sector);
  return option ? `${option.label} Jobs` : "Open Government Jobs";
}

function formatListingCount(count: number): string {
  return count === 1 ? "1 open listing shown" : `${count} open listings shown`;
}

function UpcomingExamsPage() {
  const snapshot = getPublishedVacanciesSnapshot();
  const [vacancyItems, setVacancyItems] = useState<VacancyItem[]>(snapshot.items);
  const [payloadMeta, setPayloadMeta] = useState<Pick<VacanciesPayload, "lastUpdated">>({
    lastUpdated: snapshot.lastUpdated,
  });
  const [verifiedLoading, setVerifiedLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState<VerifiedJobSector>("all");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadVacanciesLive().then((result) => {
      if (cancelled) return;
      setVacancyItems(result.payload.items);
      setPayloadMeta({ lastUpdated: result.payload.lastUpdated });
      setVerifiedLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => computePublicVacancySummary(vacancyItems), [vacancyItems]);

  const filteredJobs = useMemo(
    () => filterVerifiedPublicVacanciesBySector(vacancyItems, selectedSector),
    [vacancyItems, selectedSector],
  );

  const sectorCounts = useMemo(() => {
    const counts: Partial<Record<VerifiedJobSector, number>> = {
      all: summary.displayed.length,
    };
    for (const sector of SECTOR_OPTIONS) {
      if (sector.id === "all") continue;
      counts[sector.id] = filterVerifiedPublicVacanciesBySector(vacancyItems, sector.id).length;
    }
    return counts;
  }, [vacancyItems, summary.displayed.length]);

  const dataUpdatedIso = useMemo(
    () => resolveVacancyDataUpdatedIso({ ...payloadMeta, source: "", items: vacancyItems }),
    [payloadMeta, vacancyItems],
  );
  const dataUpdatedLabel = dataUpdatedIso ? formatDateDDMMYYYY(dataUpdatedIso) : null;

  const showFullyVerifiedCount = summary.fullyVerified > 0;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-3">
        <PageHeader
          title="Open Government Jobs"
          subtitle="Open application windows with official source links. Verification and closing status are shown separately."
        />

        <Card className="border-[#FCD34D] bg-[#FFFBEB]">
          <CardContent className="space-y-1 p-2 text-[11px] leading-snug sm:p-3 sm:text-xs sm:leading-relaxed">
            <p className="font-semibold text-[#92400E]">Important disclaimer</p>
            <p className="text-[#78350F]">
              TAIPOQ checks each listing against official sources before publication. Recruitment
              authorities may later amend dates, eligibility or other conditions. Always confirm the
              latest notice on the official website before applying.
            </p>
          </CardContent>
        </Card>

        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm"
          aria-live="polite"
        >
          <Badge
            variant="outline"
            className="border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 font-semibold text-[#1D4ED8]"
          >
            Open listings: {summary.openListings}
          </Badge>
          {showFullyVerifiedCount ? (
            <Badge
              variant="outline"
              className="border-[#86EFAC] bg-[#F0FDF4] px-2 py-0.5 font-semibold text-[#15803D]"
            >
              Fully verified: {summary.fullyVerified}
            </Badge>
          ) : null}
          {summary.reviewPending > 0 ? (
            <Badge
              variant="outline"
              className="border-[#FCD34D] bg-[#FFFBEB] px-2 py-0.5 font-semibold text-[#B45309]"
            >
              {showFullyVerifiedCount ? "Review pending" : "Verification in progress"}:{" "}
              {summary.reviewPending}
            </Badge>
          ) : null}
          {dataUpdatedLabel ? (
            <span className="text-[#64748B]">Vacancy data updated: {dataUpdatedLabel}</span>
          ) : null}
        </div>

        <SectorFilterBar
          options={SECTOR_OPTIONS}
          selected={selectedSector}
          onSelect={setSelectedSector}
          counts={sectorCounts}
          moreOpen={moreFiltersOpen}
          onToggleMore={() => setMoreFiltersOpen((open) => !open)}
        />

        {verifiedLoading ? (
          <p className="text-sm text-muted-foreground">Loading open job listings…</p>
        ) : (
          <>
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {getSectorResultsTitle(selectedSector)}
              </h2>
              <p className="text-xs text-muted-foreground">
                {formatListingCount(filteredJobs.length)}
              </p>
            </div>

            {filteredJobs.length > 0 ? (
              <ul className="flex flex-col gap-3 pb-2">
                {filteredJobs.map((item) => (
                  <VerifiedVacancyCard key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <Card className="border-border/70 bg-muted/10">
                <CardContent className="p-3 text-sm text-muted-foreground">
                  No currently open listings match this filter.
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}

function SectorFilterBar({
  options,
  selected,
  onSelect,
  counts,
  moreOpen,
  onToggleMore,
}: {
  options: SectorOption[];
  selected: VerifiedJobSector;
  onSelect: (sector: VerifiedJobSector) => void;
  counts: Partial<Record<VerifiedJobSector, number>>;
  moreOpen: boolean;
  onToggleMore: () => void;
}) {
  const primaryOptions = options.filter(
    (option) =>
      PRIMARY_SECTOR_IDS.has(option.id) && (option.id === "all" || (counts[option.id] ?? 0) > 0),
  );
  const secondaryOptions = options.filter(
    (option) => !PRIMARY_SECTOR_IDS.has(option.id) && (counts[option.id] ?? 0) > 0,
  );

  return (
    <div className="space-y-2">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0"
        role="tablist"
        aria-label="Filter jobs by category"
      >
        {primaryOptions.map((option) => (
          <SectorFilterChip
            key={option.id}
            option={option}
            selected={selected}
            count={counts[option.id]}
            onSelect={onSelect}
          />
        ))}
        {secondaryOptions.length > 0 ? (
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-border/80 bg-muted/20 px-3 py-2 text-xs font-medium text-muted-foreground hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
            aria-expanded={moreOpen}
            aria-controls="vacancy-more-filters-mobile"
            onClick={onToggleMore}
          >
            More filters ({secondaryOptions.length})
          </button>
        ) : null}
      </div>

      {secondaryOptions.length > 0 ? (
        <div className="hidden md:block">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            More filters
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Additional job filters">
            {secondaryOptions.map((option) => (
              <SectorFilterChip
                key={option.id}
                option={option}
                selected={selected}
                count={counts[option.id]}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ) : null}

      {moreOpen && secondaryOptions.length > 0 ? (
        <div
          id="vacancy-more-filters-mobile"
          className="space-y-2 rounded-xl border border-border/70 bg-muted/10 p-3 md:hidden"
          role="group"
          aria-label="Additional job filters"
        >
          <div className="flex flex-wrap gap-2">
            {secondaryOptions.map((option) => (
              <SectorFilterChip
                key={option.id}
                option={option}
                selected={selected}
                count={counts[option.id]}
                onSelect={(id) => {
                  onSelect(id);
                  onToggleMore();
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectorFilterChip({
  option,
  selected,
  count,
  onSelect,
}: {
  option: SectorOption;
  selected: VerifiedJobSector;
  count: number | undefined;
  onSelect: (sector: VerifiedJobSector) => void;
}) {
  const isSelected = selected === option.id;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-pressed={isSelected}
      onClick={() => onSelect(option.id)}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-sm",
        isSelected
          ? "border-primary bg-primary/15 text-primary shadow-sm"
          : "border-border/80 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {option.label}
      {typeof count === "number" ? (
        <span
          className={cn(
            "ml-1 tabular-nums",
            isSelected ? "text-primary/80" : "text-muted-foreground/80",
          )}
        >
          ({count})
        </span>
      ) : null}
    </button>
  );
}
