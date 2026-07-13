import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — TAIPOQ" },
      {
        name: "description",
        content:
          "Disclaimer for TAIPOQ — vacancy updates, PYQs, practice tests, Math Speed Lab, typing results, and local browser data.",
      },
    ],
  }),
  component: Disclaimer,
});

const POINTS = [
  "TAIPOQ is not an official government recruitment website and is not affiliated with any examination authority or recruitment board.",
  "Vacancy information may change. Always verify final recruitment details, dates, fees, and eligibility on official sources.",
  "TAIPOQ does not submit applications on your behalf.",
  "External official links are outside TAIPOQ’s control; their availability and content may change without notice.",
  "Previous-year questions (PYQs) may be adapted for digital practice while preserving provenance. Explanations are for learning and are not official publications of the examination body.",
  "TAIPOQ-original practice papers are not official PYQs.",
  "Current-affairs content is date-sensitive; refresh and verify before long-term use.",
  "Math Speed Lab methods are educational calculation techniques and are not examination-body endorsements.",
  "Typing speed, accuracy, and other practice results are indicators for self-improvement, not official certificates unless an authority accepts them.",
  "Local browser-stored progress and profile data may be cleared by the browser or the user.",
  "TAIPOQ does not guarantee job selection, exam success, or official acceptance of any practice result.",
] as const;

function Disclaimer() {
  return (
    <InfoPage title="Disclaimer">
      <p>
        TAIPOQ is an educational preparation platform. Use it to practise and organise study — and
        always confirm critical recruitment facts on official sources.
      </p>
      <InfoList items={POINTS} />
    </InfoPage>
  );
}
