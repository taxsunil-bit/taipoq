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
        For feedback, suggestions, corrections, or collaboration related to TAIPOQ, users may contact the TAIPOQ team through the official contact method that may be provided in a future version.
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
      <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        Contact details may be added in a future version.
      </p>
    </InfoPage>
  );
}
