import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getResults, getUser, type SavedResult } from "@/lib/storage";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "My Progress — TAIPOQ" }] }),
  component: Progress,
});

function Progress() {
  const [all, setAll] = useState<SavedResult[]>([]);
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    setAll(getResults());
    setUserName(getUser()?.name ?? "");
  }, []);

  const english = all.filter(r => r.language === "English");
  const hindi = all.filter(r => r.language === "Hindi");
  const bestEn = english.reduce((m, r) => Math.max(m, r.netWpm), 0);
  const bestHi = hindi.reduce((m, r) => Math.max(m, r.netWpm), 0);
  const avgAcc = all.length ? Math.round(all.reduce((s, r) => s + r.accuracy, 0) / all.length) : 0;
  const totalSec = all.reduce((s, r) => s + r.elapsedSec, 0);
  const certs = all.filter(r => r.netWpm >= 25 && r.accuracy >= 90).length;
  const weakEn = topKeys(english, 8);
  const weakHi = topKeys(hindi, 8);

  return (
    <PageShell>
      <PageHeader
        title={userName ? `Welcome back, ${userName}` : "Welcome to TAIPOQ"}
        subtitle="Your typing progress at a glance."
      />

      {all.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-lg font-semibold">No test result yet.</p>
            <p className="text-muted-foreground">Take a typing test to see progress.</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild><Link to="/test">Take a Test</Link></Button>
              <Button asChild variant="outline"><Link to="/english/lessons">English Lessons</Link></Button>
              <Button asChild variant="outline"><Link to="/hindi/lessons">Hindi Lessons</Link></Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="English Best Speed" value={`${bestEn} WPM`} />
            <Stat label="Hindi Best Speed" value={`${bestHi} WPM`} />
            <Stat label="Average Accuracy" value={`${avgAcc}%`} />
            <Stat label="Total Practice Time" value={fmtTime(totalSec)} />
            <Stat label="Tests Completed" value={all.length} />
            <Stat label="Certificates Earned" value={certs} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline"><Link to="/english/practice">Continue English Lesson</Link></Button>
            <Button asChild variant="outline"><Link to="/hindi/practice">Continue Hindi Lesson</Link></Button>
            <Button asChild><Link to="/test">Take Test</Link></Button>
            <Button asChild variant="secondary"><Link to="/certificate">View Certificate</Link></Button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <RecentTable title="Last 10 English Tests" rows={english.slice(0, 10)} />
            <RecentTable title="Last 10 Hindi Tests" rows={hindi.slice(0, 10)} hindi />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Weak English Keys</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {weakEn.length === 0 && <p className="text-sm text-muted-foreground">Not enough data yet.</p>}
                {weakEn.map(k => <kbd key={k} className="rounded border bg-muted px-3 py-1 text-sm">{k === " " ? "␣" : k}</kbd>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weak Hindi Letters / Matras</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2 font-hindi">
                {weakHi.length === 0 && <p className="font-sans text-sm text-muted-foreground">Not enough data yet.</p>}
                {weakHi.map(k => <kbd key={k} className="rounded border bg-muted px-3 py-1 text-base">{k}</kbd>)}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </PageShell>
  );
}

function topKeys(rows: SavedResult[], n: number): string[] {
  const counts = new Map<string, number>();
  for (const r of rows) for (const m of r.mistakeList) if (m.expected) counts.set(m.expected, (counts.get(m.expected) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
}

function fmtTime(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function RecentTable({ title, rows, hindi }: { title: string; rows: SavedResult[]; hindi?: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tests yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Acc</TableHead>
                <TableHead>Mistakes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell className={hindi ? "font-hindi" : ""}>{r.title}</TableCell>
                  <TableCell>{r.grossWpm}</TableCell>
                  <TableCell>{r.netWpm}</TableCell>
                  <TableCell>{r.accuracy}%</TableCell>
                  <TableCell>{r.mistakes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
