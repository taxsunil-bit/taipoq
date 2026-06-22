import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TAIPOQ" },
      {
        name: "description",
        content: "Contact information and feedback guidance for TAIPOQ, the typing practice platform for job aspirants.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <InfoPage title="Contact">
      <p>
        For feedback, suggestions, corrections, collaboration, privacy-related questions, or technical issues related to TAIPOQ, users may contact us at:
      </p>
      <InfoSection title="Project">
        <p className="text-foreground">TAIPOQ</p>
      </InfoSection>
      <InfoSection title="Created by">
        <p className="text-foreground">Manas Dixit</p>
      </InfoSection>
      <p>
        If you find any typing error, incorrect Hindi KrutiDev mapping, or technical issue, please share details so the platform can be improved.
      </p>
      <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
        Email:{" "}
        <a href="mailto:manasdixit5050@gmail.com" className="text-primary underline-offset-4 hover:underline">
          manasdixit5050@gmail.com
        </a>
      </p>
    </InfoPage>
  );
}
