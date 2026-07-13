import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TAIPOQ" },
      {
        name: "description",
        content:
          "About TAIPOQ — a mobile-first government exam preparation platform with verified jobs, PYQs, practice tests, Daily Mission, Math Speed Lab, current affairs, typing practice, and local progress.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <InfoPage title="About TAIPOQ">
      <p>
        TAIPOQ is a mobile-first government-exam preparation platform created by Manas Dixit. It
        helps aspirants practise with clear tools for tests, verified job updates, calculation
        skills, current affairs, and typing — with progress saved locally in the browser.
      </p>
      <p>Current modules include:</p>
      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
        <li>Verified government-job vacancy updates with official-source links</li>
        <li>Clearly labelled verified previous-year questions (PYQs)</li>
        <li>TAIPOQ-original practice tests and subject papers</li>
        <li>Daily Mission for a focused daily practice loop</li>
        <li>Math Speed Lab for reliable calculation techniques</li>
        <li>Current-affairs practice packs</li>
        <li>English and Hindi typing preparation</li>
        <li>Local profile and browser-stored progress</li>
      </ul>
      <p>
        Typing practice is an important preparation module on TAIPOQ, not the entire product
        identity. Always verify final recruitment rules, dates, and eligibility on official sources.
      </p>
      <InfoSection title="Mission">
        <p>
          Our mission is to make structured exam preparation simple, trustworthy, and accessible —
          with honest labelling of verified content, original practice, and educational techniques.
        </p>
      </InfoSection>
      <InfoSection title="Local progress">
        <p>
          Display name and practice results may be stored locally in your browser. Clearing browser
          data can remove saved progress. TAIPOQ does not submit job applications on your behalf.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
