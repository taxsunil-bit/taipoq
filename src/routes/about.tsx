import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildSeoHead({
      title: "About TAIPOQ — Independent Typing & Exam Practice Platform",
      description:
        "Learn about TAIPOQ — an independent educational platform for English and Hindi typing practice, mock tests and verified job updates.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <InfoPage title="About TAIPOQ">
      <p>
        TAIPOQ is an independent educational platform created by Manas Dixit for students and job
        aspirants preparing for typing tests, computer-based exams and general competition practice.
      </p>
      <p>
        TAIPOQ is <strong>not</strong> an official government website and is not affiliated with SSC,
        RRB, UPSC, DSSSB, NHAI or any recruitment board unless explicitly stated on a specific page.
      </p>
      <InfoSection title="What we provide">
        <ul className="list-disc space-y-2 pl-5">
          <li>English and Hindi (KrutiDev / Remington) typing practice and timed tests</li>
          <li>Mock tests and model papers including General Awareness, General Science and Current Affairs</li>
          <li>Study Corner resources for computer basics and subject preparation</li>
          <li>Verified government job updates with links to official sources</li>
          <li>Daily Mission tasks to encourage consistent practice</li>
        </ul>
      </InfoSection>
      <InfoSection title="Who it is for">
        <p>
          Typing learners, clerks, data-entry candidates, stenography aspirants, and anyone building
          speed and accuracy for job-related typing requirements.
        </p>
      </InfoSection>
      <InfoSection title="Current version">
        <p>
          TAIPOQ v1 is a public demo/prototype. Practice results and profile data may be stored locally
          in your browser unless a future version adds secure cloud storage.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
