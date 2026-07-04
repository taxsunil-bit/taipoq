import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { buildSeoHead } from "@/lib/seo";

const CONTACT_EMAIL = "manasdixit5050@gmail.com";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildSeoHead({
      title: "Contact TAIPOQ — Feedback, Corrections & Support",
      description:
        "Contact TAIPOQ for feedback, vacancy corrections, technical issues and general questions about typing practice and mock tests.",
      path: "/contact",
    }),
  component: Contact,
});

function Contact() {
  return (
    <InfoPage title="Contact">
      <p>
        For feedback, suggestions, vacancy corrections, technical problems or privacy-related questions,
        you may contact TAIPOQ using the email below.
      </p>
      <InfoSection title="Email">
        <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=TAIPOQ%20Contact`}
            className="text-primary underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </InfoSection>
      <InfoSection title="Vacancy corrections">
        <p>
          To report incorrect dates, broken official links, wrong vacancy counts, expired notifications
          or verification concerns on job updates, email us with:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>The vacancy title and TAIPOQ listing link</li>
          <li>What appears incorrect</li>
          <li>The official source URL if available</li>
        </ul>
        <p className="mt-3">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=TAIPOQ%20Vacancy%20Correction`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Report a vacancy correction
          </a>
        </p>
      </InfoSection>
      <InfoSection title="Technical issues">
        <p>
          For typing test problems, Hindi font display issues, or page errors, include your browser,
          device and the page URL in your message.
        </p>
      </InfoSection>
      <InfoSection title="Project">
        <p className="text-foreground">TAIPOQ — Created by Manas Dixit</p>
        <p className="text-sm text-muted-foreground">No physical office address is listed for this independent project.</p>
      </InfoSection>
    </InfoPage>
  );
}
