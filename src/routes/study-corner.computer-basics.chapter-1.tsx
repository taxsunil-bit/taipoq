import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { COMPUTER_CHAPTER_1 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/computer-basics/chapter-1")({
  head: () => ({
    meta: [
      { title: "कम्प्यूटर का मूलभूत ज्ञान — पुस्तकालय / Library" },
      { name: "description", content: "कम्प्यूटर, हार्डवेयर, सॉफ्टवेयर और परीक्षा प्रश्न।" },
    ],
  }),
  component: ComputerChapter1,
});

function ComputerChapter1() {
  return <StudyChapterPage chapter={COMPUTER_CHAPTER_1} />;
}
