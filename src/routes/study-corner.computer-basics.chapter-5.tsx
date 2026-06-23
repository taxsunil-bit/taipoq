import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { COMPUTER_CHAPTER_5 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/computer-basics/chapter-5")({
  head: () => ({
    meta: [
      { title: "Internet और Email — पुस्तकालय / Library" },
      {
        name: "description",
        content: "Internet, Browser, Search Engine, Email और Internet सुरक्षा — अध्याय 5।",
      },
    ],
  }),
  component: ComputerChapter5,
});

function ComputerChapter5() {
  return <StudyChapterPage chapter={COMPUTER_CHAPTER_5} />;
}
