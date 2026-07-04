import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoSection } from "@/components/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TAIPOQ" },
      {
        name: "description",
        content: "Learn about TAIPOQ — English and Hindi typing practice for students and job aspirants, created by Manas Dixit.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <InfoPage title="About TAIPOQ">
      <p>
        TAIPOQ is a smart English and Hindi typing practice platform created by Manas Dixit for students and job aspirants. It helps candidates practice typing anytime, anywhere, especially for typing-based job requirements.
      </p>
      <p>
        TAIPOQ currently supports English typing practice and Hindi KrutiDev/Remington typing practice. It is designed to help learners improve speed, accuracy, confidence, and regular practice discipline.
      </p>
      <p>
        This platform is intended for students, beginners, typing learners, clerks, data entry candidates, stenography aspirants, and other job aspirants who need regular typing practice.
      </p>
      <InfoSection title="Mission">
        <p>Our mission is to make typing practice simple, accessible, and useful for job preparation.</p>
      </InfoSection>
      <InfoSection title="Current Version">
        <p>
          TAIPOQ v1 is a public demo/prototype. Results and saved practice data may be stored locally in the user&apos;s browser unless a secure database is added in a future version.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
