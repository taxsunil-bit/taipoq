import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GS_CHAPTER_4 } from "@/content/generalScienceContent";

export const Route = createFileRoute("/study-corner/general-science/chapter-4")({
  head: () => ({
    meta: [{ title: "Everyday Science & Environment — General Science" }],
  }),
  component: Chapter4,
});

function Chapter4() {
  return <StudyChapterPage chapter={GS_CHAPTER_4 as never} />;
}
