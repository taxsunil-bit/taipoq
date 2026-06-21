import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser, saveUser } from "@/lib/storage";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — TAIPOQ" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const u = getUser();
    if (u) { setName(u.name); setEmail(u.email ?? ""); }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveUser({ name: name.trim() || "Student", email: email.trim() || undefined });
    navigate({ to: "/progress" });
  }

  return (
    <PageShell>
      <PageHeader title={mode === "login" ? "Login" : "Register"} subtitle="Prototype only — name is stored locally." />
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <div role="note" className="mb-4 rounded-md border border-amber-500/60 bg-amber-500/15 p-3 text-xs font-medium text-amber-100 dark:text-amber-100">
            This is a <b>local demo login</b>. Your name is saved only in this browser. Password login is not active yet.
          </div>
          <div className="mb-4 flex rounded-md border p-1 text-sm">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded px-3 py-1.5 ${mode === "login" ? "bg-primary text-primary-foreground" : ""}`}>Login</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded px-3 py-1.5 ${mode === "register" ? "bg-primary text-primary-foreground" : ""}`}>Register</button>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
            <Button className="w-full" type="submit">{mode === "login" ? "Login" : "Register"}</Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
