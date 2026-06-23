import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_2 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-2")({
  head: () => ({
    meta: [
      { title: "भारत का संविधान - मूलभूत सिद्धांत — पुस्तकालय / Library" },
      { name: "description", content: "भारत के संविधान के मूलभूत सिद्धांत — अध्याय 2।" },
    ],
  }),
  component: Chapter2,
});

function Chapter2() {
  return <StudyChapterPage chapter={GA_CHAPTER_2} />;
}
