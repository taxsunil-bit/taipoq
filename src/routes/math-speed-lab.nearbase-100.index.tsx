import { createFileRoute } from "@tanstack/react-router";
import { MslT03LessonView } from "@/components/math-speed-lab/MslT03LessonView";

export const Route = createFileRoute("/math-speed-lab/nearbase-100/")({
  head: () => ({
    meta: [
      { title: "Near-Base Multiplication (Base 100) — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Learn Base 100 Model A near-base multiplication with carry and ordinary verification.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT03LessonPage,
});

function MslT03LessonPage() {
  return <MslT03LessonView />;
}
