"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  analyzeTypingText,
  EXTRA_LABEL,
  MISSING_LABEL,
  resolveAnalysisLang,
  SPACE_LABEL,
  type TypingAnalysis,
} from "@/lib/typingAnalysis";
import type { SavedResult } from "@/lib/storage";
import { cn } from "@/lib/utils";

type TypingImprovementAnalysisProps = {
  result: SavedResult;
};

function formatPair(expected: string, actual: string): string {
  return `${expected} → ${actual}`;
}

function CategoryTile({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <div className="rounded-lg border border-border/70 bg-muted/15 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function TypingImprovementAnalysis({ result }: TypingImprovementAnalysisProps) {
  const [copied, setCopied] = useState(false);

  const analysis = useMemo<TypingAnalysis | null>(() => {
    if (!result.targetText || !result.typedText) return null;
    const lang = result.analysisLang ?? resolveAnalysisLang(result);
    return analyzeTypingText(result.targetText, result.typedText, {
      lang,
      accuracy: result.accuracy,
      netWpm: result.netWpm,
      targetWpm: result.targetWpm,
      passed: result.passed,
    });
  }, [result]);

  if (!analysis) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Typing Improvement Analysis / टंकण सुधार विश्लेषण</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed mistake analysis is available for newer results. Take another test to see weak words and practice suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (analysis.totalMismatches === 0 && analysis.categories.incorrectWords === 0) {
    return (
      <Card className="mt-6 border-emerald-500/30 bg-emerald-500/5">
        <CardHeader>
          <CardTitle>Typing Improvement Analysis / टंकण सुधार विश्लेषण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-foreground">{analysis.recommendation.message}</p>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
            Exact match — no detected weaknesses
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const isHindi = result.language === "Hindi";
  const isKruti = isHindi && result.mode === "Remington";
  const fontClass = isKruti ? "font-kruti" : isHindi ? "font-hindi" : "";

  async function copyPractice() {
    if (!analysis?.focusedPracticeText) return;
    try {
      await navigator.clipboard.writeText(analysis.focusedPracticeText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const { categories } = analysis;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Typing Improvement Analysis / टंकण सुधार विश्लेषण</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm leading-relaxed text-foreground">{analysis.recommendation.message}</p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Mistake analysis — review points</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <CategoryTile label="Incorrect words" value={categories.incorrectWords} />
            <CategoryTile label="Missing content" value={categories.missingContent} />
            <CategoryTile label="Extra content" value={categories.extraContent} />
            <CategoryTile label="Spacing" value={categories.spacing} />
            <CategoryTile label="Punctuation" value={categories.punctuation} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Detected patterns: {analysis.totalMismatches} character-level review points (separate from canonical mistake count).
          </p>
        </div>

        {analysis.weakWords.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Weak Words</h3>
            <ul className="space-y-1.5">
              {analysis.weakWords.map((row, i) => (
                <li
                  key={`${row.expected}-${row.actual}-${i}`}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/10 px-3 py-2 text-sm",
                    fontClass,
                  )}
                >
                  <span aria-label={`Expected ${row.expected}, typed ${row.actual}`}>
                    {formatPair(row.expected, row.actual)}
                  </span>
                  <Badge variant="outline">×{row.count}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.weakCharacters.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Weak Character Patterns</h3>
            <ul className="space-y-1.5">
              {analysis.weakCharacters.map((row, i) => (
                <li
                  key={`${row.expected}-${row.actual}-${i}`}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/10 px-3 py-2 text-sm",
                    fontClass,
                  )}
                >
                  <span aria-label={`Character pattern expected ${row.expected}, typed ${row.actual}`}>
                    {formatPair(
                      row.expected === SPACE_LABEL ? "Space" : row.expected,
                      row.actual === SPACE_LABEL ? "Space" : row.actual,
                    )}
                  </span>
                  <Badge variant="outline">×{row.count}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.repeatedPatterns.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Repeated Patterns</h3>
            <ul className="flex flex-wrap gap-2">
              {analysis.repeatedPatterns.map((pattern) => (
                <Badge key={pattern} variant="secondary">
                  {pattern}
                </Badge>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.focusedPracticeText ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Focused Practice</h3>
            <pre
              className={cn(
                "overflow-x-auto whitespace-pre-wrap rounded-md border border-border/70 bg-muted/10 p-3 text-sm leading-relaxed",
                fontClass,
              )}
            >
              {analysis.focusedPracticeText}
            </pre>
            <Button type="button" variant="outline" size="sm" onClick={copyPractice}>
              {copied ? "Copied" : "Copy Practice Text"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { MISSING_LABEL, EXTRA_LABEL, SPACE_LABEL };
