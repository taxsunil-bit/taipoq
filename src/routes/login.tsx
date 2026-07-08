import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearUser, getUser, sanitizeStoredUser, saveUser } from "@/lib/storage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Local Profile — TAIPOQ" },
      {
        name: "description",
        content:
          "Set a display name for this browser. Your name and progress stay on this device — no online account or password is required.",
      },
    ],
  }),
  component: LocalProfilePage,
});

function LocalProfilePage() {
  const nameFieldId = useId();
  const statusId = useId();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    sanitizeStoredUser();
    const user = getUser();
    if (user?.name) setName(user.name);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Enter a display name.");
      setStatus("");
      return;
    }
    setNameError("");
    const existing = getUser();
    saveUser({
      name: trimmed,
      email: existing?.email,
    });
    setStatus("Profile saved in this browser.");
  }

  function handleClear() {
    if (
      !window.confirm(
        "Clear your local display name from this browser? Your typing test results and other saved progress will not be deleted.",
      )
    ) {
      return;
    }
    clearUser();
    setName("");
    setNameError("");
    setStatus("Local display name cleared.");
  }

  return (
    <PageShell>
      <PageHeader
        title="Local Profile"
        subtitle="Your name and progress are stored in this browser. No online account or password is required."
      />
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            TAIPOQ is under continuous development. Some learning features may change as the
            platform is improved.
          </p>
          <form className="space-y-4" onSubmit={handleSave} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor={nameFieldId}>Display name</Label>
              <Input
                id={nameFieldId}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="Your name for certificates and progress"
                autoComplete="name"
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? `${nameFieldId}-error` : undefined}
                required
              />
              {nameError ? (
                <p id={`${nameFieldId}-error`} className="text-sm text-destructive" role="alert">
                  {nameError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="min-h-11 flex-1" type="submit">
                Save profile
              </Button>
              <Button
                className="min-h-11 flex-1"
                type="button"
                variant="outline"
                onClick={handleClear}
              >
                Clear display name
              </Button>
            </div>
          </form>
          <p
            id={statusId}
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
