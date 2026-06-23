import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { COMPUTER_CHAPTER_3 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/computer-basics/chapter-3")({
  head: () => ({
    meta: [
      { title: "Software — पुस्तकालय / Library" },
      {
        name: "description",
        content:
          "System Software, Application Software, Utility Software और Hardware सम्बन्ध — अध्याय 3।",
      },
    ],
  }),
  component: ComputerChapter3,
});

function ComputerChapter3() {
  return <StudyChapterPage chapter={COMPUTER_CHAPTER_3} />;
}
