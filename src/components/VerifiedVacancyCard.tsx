import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatVacancyStatusLabel, isHttpsUrl } from "@/lib/vacancies";
import { formatDateDDMMYYYY, getPrepareLinkLabel, resolvePrepareLink } from "@/lib/upcomingExams";
import type { VacancyItem } from "@/types/vacancy";
import { cn } from "@/lib/utils";

type VerifiedVacancyCardProps = {
  item: VacancyItem;
};

const compactBtn =
  "h-9 min-h-10 px-2.5 text-xs sm:h-9 sm:min-h-9 sm:px-3 sm:text-sm whitespace-nowrap";

const VAGUE_EXAM_FRAGMENTS = [
  "official notice देखें",
  "official advertisement देखें",
  "official calendar देखें",
  "घोषित नहीं",
  "तिथि घोषित नहीं",
] as const;

function isMeaningfulDetailText(value: string | undefined): boolean {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  return !VAGUE_EXAM_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

function CompactLine({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <p className="text-xs leading-snug">
      <span className="text-muted-foreground">{label}: </span>
      <span className={emphasize ? "font-semibold text-foreground" : "text-foreground"}>{value}</span>
    </p>
  );
}

function PreparationLinkButton({ href, className }: { href: string; className?: string }) {
  const prepare = resolvePrepareLink(href);
  const label = getPrepareLinkLabel(href);
  const text = label === "Prepare" ? "तैयारी करें" : label;

  if (prepare.external) {
    return (
      <a
        href={prepare.to}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
      >
        तैयारी करें
      </a>
    );
  }

  if (prepare.to === "/test" && "search" in prepare) {
    return (
      <Link
        to="/test"
        search={prepare.search}
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
      >
        {text}
      </Link>
    );
  }

  return (
    <Link
      to={prepare.to}
      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
    >
      {text}
    </Link>
  );
}

export function VerifiedVacancyCard({ item }: VerifiedVacancyCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (item.status === "verification_pending" || item.isPreparationOnly) {
    return null;
  }

  const showSource = isHttpsUrl(item.sourceUrl);
  const showNotice = isHttpsUrl(item.officialNoticeUrl);
  const statusPill = formatVacancyStatusLabel(item.status);
  const startDate = formatDateDDMMYYYY(item.applicationStartDate);
  const endDate = formatDateDDMMYYYY(item.applicationEndDate);
  const primaryPrepLink = item.preparationLinks[0];
  const examLine = isMeaningfulDetailText(item.examWindowText) ? item.examWindowText.trim() : undefined;
  const noticeLine = isMeaningfulDetailText(item.notificationWindowText)
    ? item.notificationWindowText.trim()
    : undefined;

  return (
    <li>
      <Card className="border-emerald-500/20 bg-card/80 shadow-sm">
        <CardContent className="space-y-2 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-emerald-400/40 bg-emerald-500/15 px-1.5 py-0 text-[11px] font-medium text-emerald-300"
            >
              Verified Open Job
            </Badge>
            <Badge
              variant="outline"
              className="border-border/80 bg-muted/25 px-1.5 py-0 text-[11px] font-medium text-foreground"
            >
              {statusPill}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
            <p className="text-[11px] text-muted-foreground">
              {item.organisation}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>

          {endDate ? (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs leading-snug">
              <span className="text-muted-foreground">अंतिम तिथि: </span>
              <span className="font-semibold text-emerald-100">{endDate}</span>
            </p>
          ) : null}

          <div className="space-y-0.5">
            {startDate ? <CompactLine label="आवेदन आरम्भ" value={startDate} emphasize /> : null}
            {endDate ? <CompactLine label="अंतिम तिथि" value={endDate} emphasize /> : null}
            {noticeLine ? <CompactLine label="सूचना" value={noticeLine} /> : null}
            {examLine ? <CompactLine label="परीक्षा / चयन" value={examLine} /> : null}
            <CompactLine label="रिक्तियाँ" value={item.vacanciesText} />
            <CompactLine label="योग्यता" value={item.qualificationShort} />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {showSource ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
              >
                Official Source
              </a>
            ) : null}

            {primaryPrepLink ? <PreparationLinkButton href={primaryPrepLink} /> : null}

            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn)}
              aria-expanded={expanded}
            >
              {expanded ? "Details छिपाएँ" : "Details देखें"}
            </button>

            {showNotice && item.officialNoticeUrl ? (
              <a
                href={item.officialNoticeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), compactBtn)}
              >
                Official Notice
              </a>
            ) : null}
          </div>

          {expanded ? (
            <div className="space-y-2 border-t border-border/50 pt-2">
              <div className="space-y-0.5">
                {startDate ? (
                  <CompactLine label="आवेदन प्रारम्भ" value={startDate} emphasize />
                ) : null}
                {endDate ? <CompactLine label="अंतिम तिथि" value={endDate} emphasize /> : null}
                {item.correctionStartDate && item.correctionEndDate ? (
                  <CompactLine
                    label="संशोधन"
                    value={`${formatDateDDMMYYYY(item.correctionStartDate)} से ${formatDateDDMMYYYY(item.correctionEndDate)}`}
                    emphasize
                  />
                ) : null}
                <CompactLine label="आयु सीमा" value={item.ageLimitShort} />
                <CompactLine label="शुल्क" value={item.feeShort} />
                <CompactLine label="चयन प्रक्रिया" value={item.selectionProcessShort} />
                <CompactLine label="सूचना अवधि" value={item.notificationWindowText} />
                <CompactLine label="परीक्षा / चयन तिथि" value={item.examWindowText} />
              </div>

              <p className="rounded border border-border/50 bg-muted/15 p-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Trust note: </span>
                {item.trustNote}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {showNotice && item.officialNoticeUrl ? (
                  <a
                    href={item.officialNoticeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
                  >
                    Official Notice
                  </a>
                ) : null}

                {showSource ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
                  >
                    Official Source
                  </a>
                ) : null}

                {item.preparationLinks.map((href) => (
                  <PreparationLinkButton key={href} href={href} />
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </li>
  );
}
