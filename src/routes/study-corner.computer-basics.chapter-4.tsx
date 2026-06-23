import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { COMPUTER_CHAPTER_4 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/computer-basics/chapter-4")({
  head: () => ({
    meta: [
      { title: "Memory और Storage — पुस्तकालय / Library" },
      {
        name: "description",
        content: "RAM, ROM, Hard Disk, SSD और Memory-Storage अंतर — अध्याय 4।",
      },
    ],
  }),
  component: ComputerChapter4,
});

function ComputerChapter4() {
  return <StudyChapterPage chapter={COMPUTER_CHAPTER_4} />;
}
