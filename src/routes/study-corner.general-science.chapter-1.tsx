import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GS_CHAPTER_1 } from "@/content/generalScienceContent";

export const Route = createFileRoute("/study-corner/general-science/chapter-1")({
  head: () => ({
    meta: [{ title: "Biology Basics — General Science" }],
  }),
  component: Chapter1,
});

function Chapter1() {
  return <StudyChapterPage chapter={GS_CHAPTER_1 as never} />;
}
