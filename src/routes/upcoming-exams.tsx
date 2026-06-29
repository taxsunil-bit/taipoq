import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  filterVerifiedPublicVacanciesBySector,
  getVerifiedPublicVacancies,
  isVerifiedVacanciesEnabled,
  loadVacanciesPreview,
  type VerifiedJobSector,
} from "@/lib/vacancies";
import { formatDateDDMMYYYY, formatDisplayDate } from "@/lib/upcomingExams";
import { cn } from "@/lib/utils";
import type { VacancyItem } from "@/types/vacancy";

export const Route = createFileRoute("/upcoming-exams")({
  head: () => ({
    meta: [
      { title: "Open Government Jobs — TAIPOQ" },
      {
        name: "description",
        content:
          "Verified open government job advertisements with official source links and TAIPOQ preparation.",
      },
    ],
  }),
  component: UpcomingExamsPage,
});

const SECTOR_OPTIONS: { id: VerifiedJobSector; label: string }[] = [
  { id: "all", label: "All" },
  { id: "railway", label: "Railway" },
  { id: "banking", label: "Banking" },
  { id: "bank_specialist", label: "Bank Specialist" },
  { id: "insurance", label: "Insurance" },
  { id: "defence", label: "Defence" },
  { id: "drdo", label: "DRDO / R&D" },
  { id: "upsc", label: "UPSC" },
  { id: "dsssb", label: "DSSSB / Delhi Govt" },
  { id: "judicial", label: "Judicial Jobs" },
];

function UpcomingExamsPage() {
  const verifiedEnabled = isVerifiedVacanciesEnabled();
  const [vacancyItems, setVacancyItems] = useState<VacancyItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [verifiedLoading, setVerifiedLoading] = useState(verifiedEnabled);
  const [selectedSector, setSelectedSector] = useState<VerifiedJobSector>("all");

  useEffect(() => {
    if (!verifiedEnabled) {
      setVerifiedLoading(false);
      return;
    }

    let cancelled = false;
    loadVacanciesPreview().then((result) => {
      if (cancelled) return;
      setVacancyItems(result.payload.items);
      setLastUpdated(result.payload.lastUpdated);
      setVerifiedLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [verifiedEnabled]);

  const verifiedVacancies = useMemo(
    () => getVerifiedPublicVacancies(vacancyItems),
    [vacancyItems],
  );

  const sectorVerifiedJobs = useMemo(
    () => filterVerifiedPublicVacanciesBySector(vacancyItems, selectedSector),
    [vacancyItems, selectedSector],
  );

  const sectorCounts = useMemo(() => {
    const counts: Partial<Record<VerifiedJobSector, number>> = {
      all: verifiedVacancies.length,
    };
    for (const sector of SECTOR_OPTIONS) {
      if (sector.id === "all") continue;
      counts[sector.id] = filterVerifiedPublicVacanciesBySector(vacancyItems, sector.id).length;
    }
    return counts;
  }, [vacancyItems, verifiedVacancies.length]);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-3">
        <PageHeader
          title="Open Government Jobs"
          subtitle="Verified open advertisements only — exact application dates from official sources."
        />

        <Card className="border-amber-400/40 bg-amber-500/15">
          <CardContent className="space-y-1 p-2.5 text-[11px] leading-relaxed sm:p-3 sm:text-xs">
            <p className="font-semibold text-amber-50">Important disclaimer</p>
            <p className="text-amber-100/90">
              यह page केवल verified open job advertisements दिखाता है। आवेदन से पहले visitor
              स्वयं official website पर final दिनांक, योग्यता, fee और नियम check करें। TAIPOQ final
              eligibility या dates की जिम्मेदारी नहीं लेता।
            </p>
          </CardContent>
        </Card>

        {!verifiedEnabled ? (
          <Card className="border-border bg-card/80">
            <CardContent className="p-3 text-sm text-muted-foreground">
              Verified open jobs are not enabled in this build. Set VITE_SHOW_VERIFIED_VACANCIES=true.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                Open verified: {verifiedVacancies.length}
              </Badge>
              {lastUpdated ? (
                <span className="text-[10px] text-muted-foreground">
                  Updated {formatDateDDMMYYYY(lastUpdated) || formatDisplayDate(lastUpdated)}
                </span>
              ) : null}
            </div>

            <SectorChipBar
              options={SECTOR_OPTIONS}
              selected={selectedSector}
              onSelect={setSelectedSector}
              counts={sectorCounts}
            />

            {verifiedLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : sectorVerifiedJobs.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {sectorVerifiedJobs.map((item) => (
                  <VerifiedVacancyCard key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <Card className="border-border/70 bg-muted/10">
                <CardContent className="p-3 text-sm text-muted-foreground">
                  इस sector में अभी कोई verified open job नहीं है।
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}

function SectorChipBar({
  options,
  selected,
  onSelect,
  counts,
}: {
  options: { id: VerifiedJobSector; label: string }[];
  selected: VerifiedJobSector;
  onSelect: (sector: VerifiedJobSector) => void;
  counts: Partial<Record<VerifiedJobSector, number>>;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Job sectors"
    >
      {options.map((option) => {
        const isSelected = selected === option.id;
        const count = counts[option.id];
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
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
      })}
    </div>
  );
}
