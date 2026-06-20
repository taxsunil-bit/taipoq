import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteParagraph, getParagraphs, getResults, updateParagraph, type SavedParagraph, type SavedResult } from "@/lib/storage";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Panel — TAIPOQ" }] }),
  component: Admin,
});

function Admin() {
  const [paragraphs, setParagraphs] = useState<SavedParagraph[]>([]);
  const [results, setResults] = useState<SavedResult[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setParagraphs(getParagraphs());
    setResults(getResults());
  }, [tick]);

  function toggleActive(p: SavedParagraph) { updateParagraph(p.id, { active: !p.active }); setTick(t => t + 1); }
  function remove(p: SavedParagraph) {
    if (confirm(`Delete paragraph "${p.title}"?`)) { deleteParagraph(p.id); setTick(t => t + 1); }
  }

  return (
    <PageShell>
      <PageHeader title="Admin Panel" subtitle="Manage paragraphs, view user results." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Typing Paragraph</CardTitle>
            <CardDescription>Create a new paragraph for lessons or tests.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild size="sm"><Link to="/admin/add-paragraph">Add Paragraph</Link></Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate Certificate</CardTitle>
            <CardDescription>Issue typing certificates.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild size="sm" variant="outline"><Link to="/certificate">Open</Link></Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Paragraphs</CardTitle>
            <CardDescription>{paragraphs.length} paragraph(s) in local storage.</CardDescription>
          </CardHeader>
          <CardContent><Button size="sm" variant="outline" onClick={() => setTick(t => t + 1)}>Refresh</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Results</CardTitle>
            <CardDescription>{results.length} test(s) recorded locally.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild size="sm" variant="outline"><Link to="/progress">View Progress</Link></Button></CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Paragraphs</CardTitle>
          <CardDescription>Active paragraphs appear automatically in the Typing Test when language, mode, difficulty, and duration match.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {paragraphs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No paragraphs yet. <Link className="underline" to="/admin/add-paragraph">Add one</Link>.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paragraphs.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className={p.language === "Hindi" ? "font-hindi" : ""}>{p.title}</TableCell>
                    <TableCell>{p.language}</TableCell>
                    <TableCell>{p.hindiMode ?? "—"}</TableCell>
                    <TableCell>{p.difficulty}</TableCell>
                    <TableCell>{p.durationMin} min</TableCell>
                    <TableCell>
                      <span className={`rounded px-2 py-0.5 text-xs ${p.active ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild size="sm" variant="ghost"><Link to="/admin/edit-paragraph/$id" params={{ id: p.id }}>Edit</Link></Button>
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(p)}>{p.active ? "Deactivate" : "Activate"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(p)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Latest submissions saved in local storage.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Acc</TableHead>
                  <TableHead>Mistakes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.slice(0, 20).map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                    <TableCell className={r.language === "Hindi" ? "font-hindi" : ""}>{r.title}</TableCell>
                    <TableCell>{r.language}</TableCell>
                    <TableCell>{r.mode}</TableCell>
                    <TableCell>{r.durationMin ? `${r.durationMin}m` : "—"}</TableCell>
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
    </PageShell>
  );
}
