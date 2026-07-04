import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — TAIPOQ" },
      {
        name: "description",
        content: "Terms of Use for TAIPOQ — guidelines for using this typing practice platform.",
      },
    ],
  }),
  component: Terms,
});

const POINTS = [
  "TAIPOQ is provided as a typing practice and learning tool.",
  "The platform does not guarantee selection in any job, exam, recruitment, or typing test.",
  "Users are responsible for verifying official typing test rules of their concerned recruitment authority.",
  "TAIPOQ may contain sample typing lessons and practice material for educational use.",
  "Users must not misuse the website, attempt to damage the service, copy content unfairly, or use it for illegal purposes.",
  "TAIPOQ may change, update, or remove features at any time.",
  "Current v1 is a prototype/demo and may have limitations.",
  "Continued use of the website means acceptance of these terms.",
] as const;

function Terms() {
  return (
    <InfoPage title="Terms of Use">
      <p>
        By using TAIPOQ, users agree to use the website for lawful learning, practice, and typing improvement purposes.
      </p>
      <InfoList items={POINTS} />
    </InfoPage>
  );
}
