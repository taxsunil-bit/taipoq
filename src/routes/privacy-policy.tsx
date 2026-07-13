import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Cookie, Link2, Mail, Shield, BarChart3, Eye, Settings2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  PRIVACY_POLICY_CONTACT_EMAIL,
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_SECTIONS,
} from "@/content/privacyPolicyContent";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — TAIPOQ" },
      {
        name: "description",
        content:
          "Privacy Policy for taipoq.com — cookies, analytics tools, and how browser-stored preparation data may be handled.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

const SECTION_ICONS: Record<string, typeof Shield> = {
  "information-we-collect": Eye,
  analytics: BarChart3,
  cookies: Cookie,
  "how-we-use": Settings2,
  pii: Shield,
  "third-party-links": Link2,
};

function PrivacyPolicy() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[800px] px-4 pb-16 pt-8 md:px-6 md:pt-12">
        <section className="mb-10 text-center md:text-left">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {PRIVACY_POLICY_INTRO}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span>Effective Date: {PRIVACY_POLICY_EFFECTIVE_DATE}</span>
          </div>
        </section>

        <div className="space-y-6">
          {PRIVACY_POLICY_SECTIONS.filter((s) => s.id !== "intro").map((section) => {
            const Icon = SECTION_ICONS[section.id] ?? Shield;
            return (
              <article
                key={section.id}
                className="rounded-xl border border-border bg-card p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                </div>

                {"paragraphs" in section &&
                  section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}

                {"list" in section && section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.id === "contact" && (
                  <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>
                        Email:{" "}
                        <a
                          href={`mailto:${PRIVACY_POLICY_CONTACT_EMAIL}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {PRIVACY_POLICY_CONTACT_EMAIL}
                        </a>
                      </span>
                    </p>
                    <p>
                      Website:{" "}
                      <a
                        href="https://www.taipoq.com"
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.taipoq.com
                      </a>
                    </p>
                    <p className="pt-2">
                      <Link
                        to="/contact"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Contact page
                      </Link>
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-sm italic text-muted-foreground">
          This page is for general information and should not be treated as legal advice.
        </p>
      </div>
    </PageShell>
  );
}
