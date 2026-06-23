import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_3 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-3")({
  head: () => ({
    meta: [
      { title: "भारत का इतिहास - मूलभूत विचार — पुस्तकालय / Library" },
      { name: "description", content: "भारत के इतिहास के मूलभूत विचार — अध्याय 3।" },
    ],
  }),
  component: Chapter3,
});

function Chapter3() {
  return <StudyChapterPage chapter={GA_CHAPTER_3} />;
}
