import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  filterVerifiedPublicVacanciesBySector,
  getVerifiedPublicVacancies,
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

type SectorGroupDef = { id: Exclude<VerifiedJobSector, "all">; label: string };

const SECTOR_GROUP_ORDER: SectorGroupDef[] = [
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

const SECTOR_JUMP_OPTIONS: { id: VerifiedJobSector; label: string }[] = [
  { id: "all", label: "All" },
  ...SECTOR_GROUP_ORDER,
];

type SectorJobGroup = SectorGroupDef & { items: VacancyItem[] };

function UpcomingExamsPage() {
  const [vacancyItems, setVacancyItems] = useState<VacancyItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const [verifiedLoading, setVerifiedLoading] = useState(true);
  const [activeJump, setActiveJump] = useState<VerifiedJobSector>("all");

  useEffect(() => {
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
  }, []);

  const verifiedVacancies = useMemo(
    () => getVerifiedPublicVacancies(vacancyItems),
    [vacancyItems],
  );

  const sectorGroups = useMemo((): SectorJobGroup[] => {
    return SECTOR_GROUP_ORDER.map((sector) => ({
      ...sector,
      items: filterVerifiedPublicVacanciesBySector(vacancyItems, sector.id),
    })).filter((group) => group.items.length > 0);
  }, [vacancyItems]);

  const sectorCounts = useMemo(() => {
    const counts: Partial<Record<VerifiedJobSector, number>> = {
      all: verifiedVacancies.length,
    };
    for (const sector of SECTOR_GROUP_ORDER) {
      counts[sector.id] = filterVerifiedPublicVacanciesBySector(vacancyItems, sector.id).length;
    }
    return counts;
  }, [vacancyItems, verifiedVacancies.length]);

  function handleSectorJump(sector: VerifiedJobSector) {
    setActiveJump(sector);

    if (sector === "all") {
      document.getElementById("open-jobs-by-sector")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    document.getElementById(`sector-${sector}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-3">
        <PageHeader
          title="Open Government Jobs"
          subtitle="Only verified open advertisements with exact application dates."
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

        <SectorJumpChipBar
          options={SECTOR_JUMP_OPTIONS}
          active={activeJump}
          onJump={handleSectorJump}
          counts={sectorCounts}
        />

        {verifiedLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : sectorGroups.length > 0 ? (
          <div id="open-jobs-by-sector" className="space-y-6">
            {sectorGroups.map((group) => (
              <SectorJobSection key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <Card className="border-border/70 bg-muted/10">
            <CardContent className="p-3 text-sm text-muted-foreground">
              अभी कोई verified open job नहीं है।
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}

function SectorJobSection({ group }: { group: SectorJobGroup }) {
  return (
    <section
      id={`sector-${group.id}`}
      aria-labelledby={`sector-heading-${group.id}`}
      className="scroll-mt-20 space-y-2"
    >
      <div className="flex items-baseline justify-between gap-2 border-b border-border/70 pb-1.5">
        <h2
          id={`sector-heading-${group.id}`}
          className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
        >
          {group.label}
        </h2>
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {group.items.length} open
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {group.items.map((item) => (
          <VerifiedVacancyCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function SectorJumpChipBar({
  options,
  active,
  onJump,
  counts,
}: {
  options: { id: VerifiedJobSector; label: string }[];
  active: VerifiedJobSector;
  onJump: (sector: VerifiedJobSector) => void;
  counts: Partial<Record<VerifiedJobSector, number>>;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="navigation"
      aria-label="Jump to job sector"
    >
      {options.map((option) => {
        const isActive = active === option.id;
        const count = counts[option.id];
        return (
          <button
            key={option.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onJump(option.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/15 text-primary shadow-sm"
                : "border-border/80 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {option.label}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "ml-1 tabular-nums",
                  isActive ? "text-primary/80" : "text-muted-foreground/80",
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
