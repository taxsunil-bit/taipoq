import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoList } from "@/components/InfoPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — TAIPOQ" },
      {
        name: "description",
        content: "Privacy Policy for TAIPOQ v1 — how typing practice data is handled in this public demo.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

const POINTS = [
  "TAIPOQ v1 is a public demo/prototype.",
  "The app may store typing results, progress, and practice data in the user's own browser using localStorage.",
  "This locally stored data remains on the user's device/browser and is not centrally collected by TAIPOQ in the current version.",
  "TAIPOQ does not currently require real account login for public demo use.",
  "TAIPOQ does not currently sell personal data.",
  "If third-party services such as Vercel, analytics tools, or advertising platforms are used in future, their own privacy policies may apply.",
  "Users can clear locally stored data by clearing browser site data/localStorage.",
  "Future versions may add secure login, database storage, analytics, or advertisements, and this policy may be updated accordingly.",
] as const;

function PrivacyPolicy() {
  return (
    <InfoPage title="Privacy Policy">
      <p>This Privacy Policy explains how TAIPOQ handles user information.</p>
      <InfoList items={POINTS} />
      <p className="text-sm italic">
        This page is for general information and should not be treated as legal advice.
      </p>
    </InfoPage>
  );
}
