import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — TAIPOQ" },
      {
        name: "description",
        content:
          "Terms of Use for TAIPOQ — guidelines for using this government exam preparation platform.",
      },
    ],
  }),
  component: Terms,
});

const POINTS = [
  "TAIPOQ is provided as an educational preparation platform for government exams and related skills practice.",
  "Modules may include verified job updates, practice tests, labelled PYQs, Daily Mission, Math Speed Lab, current affairs, typing practice, and locally stored progress.",
  "The platform does not guarantee selection in any job, exam, or recruitment process.",
  "Users are responsible for verifying official rules, notifications, and eligibility with the concerned recruitment authority.",
  "Verified PYQs may be adapted for digital practice while preserving provenance; original practice papers are not official PYQs.",
  "Math Speed Lab methods are educational techniques and are not examination-body endorsements.",
  "Users must not misuse the website, attempt to damage the service, copy content unfairly, or use it for illegal purposes.",
  "TAIPOQ may change, update, or remove features at any time.",
  "Continued use of the website means acceptance of these terms.",
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
