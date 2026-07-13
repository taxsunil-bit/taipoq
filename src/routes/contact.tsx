import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TAIPOQ" },
      {
        name: "description",
        content:
          "Contact TAIPOQ for vacancy corrections, PYQ attribution, test issues, Math Speed Lab, typing, accessibility, and technical support.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <InfoPage title="Contact">
      <p>
        For feedback, suggestions, corrections, collaboration, privacy-related questions, or
        technical issues related to TAIPOQ, users may contact us at:
      </p>
      <InfoSection title="Project">
        <p className="text-foreground">TAIPOQ</p>
      </InfoSection>
      <InfoSection title="Created by">
        <p className="text-foreground">Manas Dixit</p>
      </InfoSection>
      <InfoSection title="Correction and support topics">
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Vacancy correction</li>
          <li>Official-source correction</li>
          <li>PYQ attribution or adaptation issue</li>
          <li>Test-question issue</li>
          <li>Current-affairs issue</li>
          <li>Math Speed Lab issue</li>
          <li>Typing or keyboard mapping issue</li>
          <li>Accessibility or technical issue</li>
        </ul>
      </InfoSection>
      <p>
        Please include the page URL, what looks wrong, and any official-source reference when
        reporting a correction.
      </p>
      <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
        Email:{" "}
        <a
          href="mailto:manasdixit5050@gmail.com"
          className="text-primary underline-offset-4 hover:underline"
        >
          manasdixit5050@gmail.com
        </a>
      </p>
    </InfoPage>
  );
}
