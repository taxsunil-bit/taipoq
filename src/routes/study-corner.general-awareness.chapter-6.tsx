import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_6 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-6")({
  head: () => ({
    meta: [
      { title: "सामान्य विज्ञान - मूलभूत ज्ञान — पुस्तकालय / Library" },
      { name: "description", content: "सामान्य विज्ञान का मूलभूत ज्ञान — अध्याय 6।" },
    ],
  }),
  component: Chapter6,
});

function Chapter6() {
  return <StudyChapterPage chapter={GA_CHAPTER_6} />;
}
