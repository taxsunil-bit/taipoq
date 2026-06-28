import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "परीक्षा अभ्यास / Tests — TAIPOQ" },
      {
        name: "description",
        content:
          "Model Paper Test, Typing Speed Test, Current Affairs Test और General Science Test — एक स्थान पर।",
      },
    ],
  }),
  component: TestsHubPage,
});

type WorkingTestCard = {
  id: string;
  title: string;
  subtitleHi: string;
  to: string;
  search?: { mode: "Remington" };
};

type ComingSoonCard = {
  id: string;
  title: string;
  subtitleHi: string;
};

const WORKING_TESTS: WorkingTestCard[] = [
  {
    id: "model-paper-test",
    title: "Model Paper Test",
    subtitleHi: "पूर्ण प्रश्नपत्र अभ्यास",
    to: "/model-paper-test",
  },
  {
    id: "typing-speed-test",
    title: "Typing Speed Test",
    subtitleHi: "समय आधारित typing speed जाँच",
    to: "/test",
  },
  {
    id: "english-typing-practice",
    title: "English Typing Practice",
    subtitleHi: "English typing अभ्यास",
    to: "/english/practice",
  },
  {
    id: "hindi-typing-practice",
    title: "Hindi Typing Practice",
    subtitleHi: "KrutiDev / Remington अभ्यास",
    to: "/hindi/practice",
    search: { mode: "Remington" },
  },
  {
    id: "current-affairs-test",
    title: "Current Affairs Test",
    subtitleHi: "समसामयिक जानकारी अभ्यास",
    to: "/current-affairs-test",
  },
  {
    id: "general-science-test",
    title: "General Science Test",
    subtitleHi: "Physics, Chemistry, Biology और दैनिक विज्ञान अभ्यास",
    to: "/study-corner/general-science/model-test-01",
  },
];

const COMING_SOON_TESTS: ComingSoonCard[] = [
  {
    id: "ms-word-test",
    title: "MS Word Test",
    subtitleHi: "Microsoft Word परीक्षा अभ्यास",
  },
  {
    id: "excel-test",
    title: "Excel Test",
    subtitleHi: "Spreadsheet परीक्षा अभ्यास",
  },
  {
    id: "computer-basics-test",
    title: "Computer Basics Test",
    subtitleHi: "कम्प्यूटर मूलभूत ज्ञान अभ्यास",
  },
];

const TEST_CARD_BTN =
  "flex min-h-[52px] w-full flex-col items-start justify-center gap-0.5 rounded-xl px-4 py-3.5 text-left transition-transform active:scale-[0.98]";

function TestsHubPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-8 overflow-x-hidden p-4 font-hindi sm:p-6">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            परीक्षा अभ्यास / Tests
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Model Paper, Typing Test, Current Affairs और General Science Test — एक स्थान पर
          </p>
        </header>

        <Link
          to="/"
          className="inline-flex min-h-10 items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>

        <section aria-labelledby="working-tests-heading" className="space-y-3">
          <h2 id="working-tests-heading" className="text-lg font-bold text-foreground">
            उपलब्ध Tests
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WORKING_TESTS.map((card) => (
              <li key={card.id}>
                {"search" in card && card.search ? (
                  <Link
                    to={card.to}
                    search={card.search}
                    className={cn(
                      TEST_CARD_BTN,
                      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                    )}
                  >
                    <span className="text-base font-semibold leading-snug">{card.title}</span>
                    <span className="text-sm font-normal leading-snug text-primary-foreground/85">
                      {card.subtitleHi}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={card.to}
                    className={cn(
                      TEST_CARD_BTN,
                      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                    )}
                  >
                    <span className="text-base font-semibold leading-snug">{card.title}</span>
                    <span className="text-sm font-normal leading-snug text-primary-foreground/85">
                      {card.subtitleHi}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="coming-soon-heading" className="space-y-3">
          <h2 id="coming-soon-heading" className="text-lg font-bold text-foreground">
            Coming next
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COMING_SOON_TESTS.map((card) => (
              <li key={card.id}>
                <div
                  aria-disabled="true"
                  className={cn(
                    TEST_CARD_BTN,
                    "cursor-not-allowed border border-border bg-muted/40 opacity-70",
                  )}
                >
                  <span className="text-base font-semibold leading-snug text-muted-foreground">
                    {card.title}
                  </span>
                  <span className="text-sm leading-snug text-muted-foreground">{card.subtitleHi}</span>
                  <span className="mt-1 text-xs font-medium text-muted-foreground">शीघ्र उपलब्ध</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Model Paper पढ़ने के लिए{" "}
          <Link to="/model-paper" className="font-medium text-primary underline-offset-2 hover:underline">
            Model Paper
          </Link>{" "}
          और अध्ययन सामग्री के लिए{" "}
          <Link to="/study-corner" className="font-medium text-primary underline-offset-2 hover:underline">
            पुस्तकालय / Library
          </Link>{" "}
          खोलें।
        </p>
      </div>
    </PageShell>
  );
}
