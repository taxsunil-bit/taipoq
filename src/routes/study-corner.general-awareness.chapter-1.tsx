import { createFileRoute } from "@tanstack/react-router";
import { StudyChapterPage } from "@/components/StudyChapterPage";
import { GA_CHAPTER_1 } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness/chapter-1")({
  head: () => ({
    meta: [
      { title: "सामान्य जागरूकता क्या है? — पुस्तकालय / Library" },
      { name: "description", content: "सामान्य जागरूकता का परिचय और नौकरी परीक्षा में उपयोगिता।" },
    ],
  }),
  component: Chapter1,
});

function Chapter1() {
  return <StudyChapterPage chapter={GA_CHAPTER_1} />;
}
