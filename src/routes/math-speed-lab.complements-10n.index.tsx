import { createFileRoute } from "@tanstack/react-router";
import { MslT02LessonView } from "@/components/math-speed-lab/MslT02LessonView";

export const Route = createFileRoute("/math-speed-lab/complements-10n/")({
  head: () => ({
    meta: [
      { title: "Complements to Powers of Ten — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Learn complements to 100 and 1000 with guided examples, zero-ending caution, and ordinary verification.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT02LessonPage,
});

function MslT02LessonPage() {
  return <MslT02LessonView />;
}
