import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_5 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-5")({
  head: () => ({
    meta: [
      { title: "समसामयिक घटनाएँ / Current Affairs — पुस्तकालय / Library" },
      { name: "description", content: "समसामयिक घटनाएँ / Current Affairs की मूलभूत तैयारी — अध्याय 5।" },
    ],
  }),
  component: Chapter5,
});

function Chapter5() {
  return <StudyChapterPage chapter={GA_CHAPTER_5} />;
}
