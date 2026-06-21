import { createFileRoute } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { InfoPage, InfoList, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/typing-tips")({
  head: () => ({
    meta: [
      { title: "Typing Tips — TAIPOQ" },
      {
        name: "description",
        content: "Practical English and Hindi KrutiDev typing tips for students and job aspirants.",
      },
    ],
  }),
  component: TypingTips,
});

const SPEED_TIPS = [
  "Practice daily for 15 to 30 minutes.",
  "Focus on accuracy before speed.",
  "Avoid looking at the keyboard.",
  "Use correct finger placement.",
  "Practice with timed tests.",
  "Review mistakes after every test.",
] as const;

const ENGLISH_TIPS = [
  "Start with home row practice.",
  "Practice common words and sentences.",
  "Use punctuation and number practice.",
  "Gradually move to paragraph typing.",
] as const;

const HINDI_TIPS = [
  "Install and use the correct KrutiDev font.",
  "Learn key mapping step by step.",
  "Practice vowels, consonants, matras, and common words.",
  "Do not mix Unicode Hindi text with KrutiDev encoded text during KrutiDev practice.",
  "Verify the typing layout required by the job or exam.",
] as const;

const TEST_TIPS = [
  "Check keyboard layout.",
  "Check font requirement.",
  "Check test duration.",
  "Check backspace/error rules.",
  "Practice in the same mode as the actual test.",
] as const;

function TypingTips() {
  return (
    <InfoPage title="Typing Tips" subtitle="Simple guidance for regular typing practice and test preparation.">
      <JobTypingSpeedGuide variant="full" />
      <InfoSection title="How to Improve Typing Speed">
        <InfoList items={SPEED_TIPS} />
      </InfoSection>
      <InfoSection title="English Typing Tips">
        <InfoList items={ENGLISH_TIPS} />
      </InfoSection>
      <InfoSection title="Hindi KrutiDev / Remington Typing Tips">
        <InfoList items={HINDI_TIPS} />
      </InfoSection>
      <InfoSection title="Before a Typing Test">
        <InfoList items={TEST_TIPS} />
      </InfoSection>
    </InfoPage>
  );
}
