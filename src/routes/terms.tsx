import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildSeoHead({
      title: "Terms of Use — TAIPOQ",
      description: "Terms of Use for TAIPOQ — educational typing practice, mock tests and job update listings.",
      path: "/terms",
    }),
  component: Terms,
});

const POINTS = [
  "TAIPOQ is provided for educational practice and learning only.",
  "The platform does not guarantee selection in any job, exam, recruitment or typing test.",
  "Users must verify official typing test rules, keyboard layout, font requirements and qualifying standards with the concerned authority.",
  "Users must verify official vacancy notifications — TAIPOQ summaries may not reflect last-minute changes.",
  "Mock tests, model papers and study content are for practice; availability and content may change.",
  "Users must not misuse the website, attempt to damage the service, scrape content unfairly, or use the site for illegal purposes.",
  "TAIPOQ may change, update or remove features at any time.",
  "Current v1 is a prototype/demo and may have limitations.",
  "Continued use of the website means acceptance of these terms.",
] as const;

function Terms() {
  return (
    <InfoPage title="Terms of Use">
      <p>
        By using TAIPOQ, you agree to use the website for lawful learning, practice and information
        purposes only.
      </p>
      <InfoList items={POINTS} />
    </InfoPage>
  );
}
