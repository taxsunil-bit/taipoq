import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getParagraphs, updateParagraph, type Difficulty, type HindiMode, type Language, type SavedParagraph } from "@/lib/storage";

export const Route = createFileRoute("/admin/edit-paragraph/$id")({
  head: () => ({ meta: [{ title: "Edit Paragraph — TAIPOQ Admin" }] }),
  component: EditParagraph,
});

function EditParagraph() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState<SavedParagraph | null>(null);
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState<Language>("English");
  const [hindiMode, setHindiMode] = useState<HindiMode>("Remington");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [duration, setDuration] = useState("5");
  const [text, setText] = useState("");
  const [active, setActive] = useState<"Active" | "Inactive">("Active");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const p = getParagraphs().find(x => x.id === id);
    if (!p) { setErr("Paragraph not found."); return; }
    setLoaded(p);
    setTitle(p.title);
    setLang(p.language);
    setHindiMode(p.hindiMode ?? "Remington");
    setDifficulty(p.difficulty);
    setDuration(String(p.durationMin));
    setText(p.text);
    setActive(p.active ? "Active" : "Inactive");
  }, [id]);

  function save() {
    if (!title.trim() || !text.trim()) { setErr("Title and paragraph text are required."); return; }
    updateParagraph(id, {
      title: title.trim(),
      language: lang,
      hindiMode: lang === "Hindi" ? "Remington" : undefined,
      difficulty,
      durationMin: Number(duration),
      text: text.trim(),
      active: active === "Active",
    });
    navigate({ to: "/admin" });
  }

  if (!loaded && err) {
    return (
      <PageShell>
        <PageHeader title="Edit Paragraph" />
        <p className="text-destructive">{err}</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate({ to: "/admin" })}>Back to Admin</Button>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Edit Typing Paragraph" subtitle="Update an existing paragraph." />
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>

          <Field label="Language">
            <Group value={lang} onChange={(v) => setLang(v as Language)} options={["English", "Hindi"]} />
          </Field>
          {lang === "Hindi" && (
            <Field label="Hindi Mode">
              <Group value={hindiMode} onChange={(v) => setHindiMode(v as HindiMode)} options={["Remington"]} />
            </Field>
          )}
          <Field label="Difficulty">
            <Group value={difficulty} onChange={(v) => setDifficulty(v as Difficulty)} options={["Beginner", "Intermediate", "Advanced", "Legal Practice"]} />
          </Field>
          <Field label="Duration (minutes)">
            <Group value={duration} onChange={setDuration} options={["1","3","5","10","15"]} />
          </Field>

          <div className="space-y-1.5">
            <Label>Paragraph Text</Label>
            <Textarea rows={8} value={text} onChange={e => setText(e.target.value)} className={lang === "Hindi" ? "font-kruti text-lg" : ""} />
          </div>

          <Field label="Status">
            <Group value={active} onChange={(v) => setActive(v as "Active" | "Inactive")} options={["Active", "Inactive"]} />
          </Field>

          {err && <p className="rounded bg-destructive/20 px-3 py-2 text-sm text-destructive">{err}</p>}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={save}>Update</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function Group({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            value === o ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
          }`}>{o}</button>
      ))}
    </div>
  );
}
