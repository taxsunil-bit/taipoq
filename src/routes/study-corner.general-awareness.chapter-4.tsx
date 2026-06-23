import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_4 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-4")({
  head: () => ({
    meta: [
      { title: "भारत का भूगोल - मूलभूत विषय — पुस्तकालय / Library" },
      { name: "description", content: "भारत के भूगोल के मूलभूत विषय — अध्याय 4।" },
    ],
  }),
  component: Chapter4,
});

function Chapter4() {
  return <StudyChapterPage chapter={GA_CHAPTER_4} />;
}
