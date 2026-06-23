import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { COMPUTER_CHAPTER_2 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/computer-basics/chapter-2")({
  head: () => ({
    meta: [
      { title: "Hardware — पुस्तकालय / Library" },
      {
        name: "description",
        content: "कम्प्यूटर Hardware, Input Hardware, Output Hardware, CPU और रख-रखाव — अध्याय 2।",
      },
    ],
  }),
  component: ComputerChapter2,
});

function ComputerChapter2() {
  return <StudyChapterPage chapter={COMPUTER_CHAPTER_2} />;
}
