import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — TAIPOQ" },
      {
        name: "description",
        content:
          "Terms of Use for TAIPOQ — verified vacancies, practice tests, PYQs, Daily Mission, typing, Math Speed Lab, and browser-local progress.",
      },
    ],
  }),
  component: Terms,
});

const POINTS = [
  "TAIPOQ is an educational government-exam preparation platform. It is not an official government recruitment website and is not affiliated with any examination authority.",
  "The platform may include verified vacancy discovery with official-source outbound links, practice tests, labelled PYQs, adapted digital-practice content, original TAIPOQ practice material, Daily Mission, typing practice, Math Speed Lab, and browser-local profile/progress.",
  "“Verified” describes TAIPOQ’s internal publication checks for listed information. It does not mean TAIPOQ is a government entity or that a vacancy is guaranteed accurate forever.",
  "“Official-source linked” means TAIPOQ points to an external official page or document when available. Those third-party websites remain outside TAIPOQ’s control.",
  "Users must verify final recruitment details — dates, fees, eligibility, and application steps — from the official notification before acting.",
  "Verified PYQs may be adapted for digital practice while preserving provenance. TAIPOQ-original practice papers are not official PYQs.",
  "Math Speed Lab methods are educational calculation techniques and are not examination-body endorsements.",
  "Profile name and progress are stored in the current browser on this device. No online account or password is required. Clearing browser data may remove locally stored progress.",
  "TAIPOQ does not promise selection, score, employment, or official acceptance of any practice result.",
  "Users must not misuse the website, attempt to damage the service, copy content unfairly, or use it for illegal purposes.",
  "TAIPOQ may change, update, or remove features at any time. Continued use of the website means acceptance of these terms.",
] as const;

function Terms() {
  return (
    <InfoPage title="Terms of Use">
      <p>
        By using TAIPOQ, users agree to use the website for lawful learning and exam preparation
        purposes.
      </p>
      <InfoList items={POINTS} />
    </InfoPage>
  );
}
