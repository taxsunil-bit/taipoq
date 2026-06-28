import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GS_CHAPTER_3 } from "@/content/generalScienceContent";

export const Route = createFileRoute("/study-corner/general-science/chapter-3")({
  head: () => ({
    meta: [{ title: "Chemistry Basics — General Science" }],
  }),
  component: Chapter3,
});

function Chapter3() {
  return <StudyChapterPage chapter={GS_CHAPTER_3 as never} />;
}
