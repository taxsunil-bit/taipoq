import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GS_CHAPTER_2 } from "@/content/generalScienceContent";

export const Route = createFileRoute("/study-corner/general-science/chapter-2")({
  head: () => ({
    meta: [{ title: "Physics Basics — General Science" }],
  }),
  component: Chapter2,
});

function Chapter2() {
  return <StudyChapterPage chapter={GS_CHAPTER_2 as never} />;
}
