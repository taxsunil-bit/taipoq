import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TAIPOQ" },
      {
        name: "description",
        content:
          "About TAIPOQ — a government-exam preparation platform with verified opportunities, trustworthy practice, and guided daily preparation.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <InfoPage title="About TAIPOQ">
      <p>
        TAIPOQ is a government-exam preparation platform created by Manas Dixit. It combines verified
        opportunities, trustworthy practice, and guided daily preparation — with progress saved locally
        in the current browser.
      </p>

      <InfoSection title="What TAIPOQ is">
        <p>TAIPOQ is organised around three pillars:</p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Verified Opportunities</span> — government
            job and exam information linked to official sources where available.
          </li>
          <li>
            <span className="font-medium text-foreground">Trustworthy Practice</span> — clearly
            labelled verified PYQs, original practice papers, subject tests, typing preparation, and
            Math Speed Lab.
          </li>
          <li>
            <span className="font-medium text-foreground">Guided Daily Preparation</span> — Daily
            Mission, local progress, and the next useful preparation step.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Supporting tools">
        <p>
          Typing practice and Math Speed Lab are preparation tools inside this wider platform. They are
          not the complete identity of TAIPOQ.
        </p>
      </InfoSection>

      <InfoSection title="Trust principles">
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Official-source links are shown where available; TAIPOQ is not a government body.</li>
          <li>Verified previous-year questions (PYQs) are clearly labelled.</li>
          <li>
            Official, adapted, and TAIPOQ-original practice content are distinguished so learners can
            see what they are practising.
          </li>
          <li>
            Vacancy and exam details are corrected when official sources change; always re-check the
            official notification before applying.
          </li>
          <li>
            TAIPOQ does not guarantee recruitment, selection, marks, or any examination outcome.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Local progress">
        <p>
          Display name and practice results may be stored locally in your browser on this device.
          Clearing browser data can remove saved progress. No online account or password is required.
          TAIPOQ does not submit job applications on your behalf.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
