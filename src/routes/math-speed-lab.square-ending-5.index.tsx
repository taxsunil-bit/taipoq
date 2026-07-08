import { createFileRoute } from "@tanstack/react-router";
import { MslT01LessonView } from "@/components/math-speed-lab/MslT01LessonView";

export const Route = createFileRoute("/math-speed-lab/square-ending-5/")({
  head: () => ({
    meta: [
      { title: "Squares Ending in 5 — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Learn the ending-in-5 square identity with guided examples and ordinary verification.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT01LessonPage,
});

function MslT01LessonPage() {
  return <MslT01LessonView />;
}
