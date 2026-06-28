import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { Button } from "@/components/ui/button";
import { getLatestEligibleResult, getUser, type SavedResult } from "@/lib/storage";

export const Route = createFileRoute("/certificate")({
  head: () => ({ meta: [{ title: "Certificate — TAIPOQ" }] }),
  component: Certificate,
});

function Certificate() {
  const [result, setResult] = useState<SavedResult | null>(null);
  const [name, setName] = useState<string>("Student Name");
  useEffect(() => {
    setResult(getLatestEligibleResult(25, 90));
    const u = getUser();
    if (u?.name) setName(u.name);
  }, []);

  if (!result) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center">
          <h1 className="font-display text-2xl font-bold">No eligible certificate yet.</h1>
          <p className="mt-3 text-muted-foreground">
            Complete a test with <b>Net WPM ≥ 25</b> and <b>Accuracy ≥ 90%</b> to unlock your certificate.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild><Link to="/test">Take a Test</Link></Button>
            <Button asChild variant="outline"><Link to="/progress">View Progress</Link></Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const data = {
    name,
    language: result.language,
    mode: result.mode,
    grossWpm: result.grossWpm,
    netWpm: result.netWpm,
    accuracy: result.accuracy,
    duration: result.durationMin ? `${result.durationMin} min` : `${result.elapsedSec}s`,
    date: new Date(result.date).toLocaleDateString(),
    id: "TPQ-" + result.id,
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border-4 border-double border-primary/40 bg-card p-10 text-center shadow-sm print:shadow-none">
          <div className="flex justify-center">
            <TaipoqLogo variant="icon" width={56} height={56} className="h-14 w-14" />
          </div>
          <div className="mt-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">TAIPOQ</div>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">TAIPOQ Typing Certificate</h1>
          <p className="mt-4 text-muted-foreground">This is to certify that</p>
          <p className="mt-2 text-2xl font-semibold">{data.name}</p>
          <p className="mt-2 text-muted-foreground">has successfully completed the typing assessment.</p>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 text-left sm:grid-cols-4">
            <Field label="Language" value={data.language} />
            <Field label="Mode" value={data.mode} />
            <Field label="Gross WPM" value={data.grossWpm} />
            <Field label="Net WPM" value={data.netWpm} />
            <Field label="Accuracy" value={`${data.accuracy}%`} />
            <Field label="Duration" value={data.duration} />
            <Field label="Date" value={data.date} />
            <Field label="Certificate ID" value={data.id} />
          </div>
          <div className="mt-10 flex items-end justify-between">
            <div><div className="border-t pt-2 text-sm">Authorised Signatory</div></div>
            <div><div className="border-t pt-2 text-sm">TAIPOQ</div></div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          <Button onClick={() => window.print()}>Print Certificate</Button>
          <Button variant="outline" onClick={() => window.print()}>Download Certificate</Button>
          <Button asChild variant="ghost"><Link to="/progress">Back to Progress</Link></Button>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
