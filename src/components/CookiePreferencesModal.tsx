import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type CookiePreferencesModalProps = {
  open: boolean;
  analyticsEnabled: boolean;
  onAnalyticsChange: (enabled: boolean) => void;
  onClose: () => void;
  onSave: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
};

export function CookiePreferencesModal({
  open,
  analyticsEnabled,
  onAnalyticsChange,
  onClose,
  onSave,
  onAcceptAll,
  onRejectAll,
}: CookiePreferencesModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close cookie preferences"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 z-10 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="cookie-preferences-title" className="font-display text-xl font-semibold text-foreground">
              Cookie Preferences
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Manage how taipoq.com uses cookies. Necessary cookies are always active. Analytics cookies help us
              understand traffic and improve the website.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">Necessary Cookies</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required for basic website functionality and cannot be disabled from this panel.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Always Active
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="analytics-cookies" className="font-medium text-foreground">
                  Analytics Cookies
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Used with analytics tools to understand website traffic, page performance and general usage trends.
                </p>
              </div>
              <Switch
                id="analytics-cookies"
                checked={analyticsEnabled}
                onCheckedChange={onAnalyticsChange}
                aria-label="Enable analytics cookies"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button type="button" className="w-full" onClick={onSave}>
            Save Preferences
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="flex-1" onClick={onAcceptAll}>
              Accept All
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onRejectAll}>
              Reject All
            </Button>
          </div>
          <p className="text-center text-sm">
            <Link to="/privacy-policy" className="text-primary underline-offset-4 hover:underline" onClick={onClose}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
