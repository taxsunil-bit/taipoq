import { createFileRoute } from "@tanstack/react-router";
import { SscCglPatternPracticePage } from "@/components/SscCglPatternPracticePage";
import { SSC_CGL_PATTERN_PRACTICE_META } from "@/content/sscCglPatternPracticeContent";

export const Route = createFileRoute("/study-corner/ssc-cgl-pattern-practice")({
  head: () => ({
    meta: [
      { title: SSC_CGL_PATTERN_PRACTICE_META.seoTitle },
      {
        name: "description",
        content: SSC_CGL_PATTERN_PRACTICE_META.seoDescription,
      },
    ],
  }),
  component: SscCglPatternPracticePage,
});
