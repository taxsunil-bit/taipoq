import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll } from "@/lib/body-scroll-lock";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "taipoq_tough_mock_popup_dismissed_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const DESKTOP_QUERY = "(min-width: 1024px)";
const SHOW_DELAY_MS = 800;

function shouldShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const dismissed = Number(raw);
    if (Number.isNaN(dismissed)) return true;
    return Date.now() - dismissed >= COOLDOWN_MS;
  } catch {
    return false;
  }
}

function dismissPopup(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore storage errors
  }
}

export function ToughMockChallengePopup() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop || !shouldShowPopup()) return;
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isDesktop]);

  const close = useCallback(() => {
    dismissPopup();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const unlockScroll = lockBodyScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!mounted || !isDesktop || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] hidden lg:block" aria-hidden={!open}>
      <button
        type="button"
        className="tough-popup-overlay absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close challenge popup"
        onClick={close}
      />
      <div className="pointer-events-none relative flex min-h-full items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tough-challenge-title"
          aria-describedby="tough-challenge-body"
          className="tough-popup-modal pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-300/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-black/50 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-lg leading-none text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/90">
            Hard Mock Test Challenge
          </p>
          <h2
            id="tough-challenge-title"
            className="tough-popup-heading mt-2 font-hindi text-2xl font-bold leading-snug text-white sm:text-3xl"
          >
            क्या आप कठिन Mock Test के लिए तैयार हैं?
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {["30 प्रश्न", "30 मिनट", "Tough Level", "Current Affairs"].map((badge) => (
              <span
                key={badge}
                className="tough-popup-badge rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100"
              >
                {badge}
              </span>
            ))}
          </div>

          <div id="tough-challenge-body" className="mt-5 space-y-2 font-hindi text-sm leading-relaxed text-slate-200 sm:text-base">
            <p className="font-medium text-white">
              सिर्फ पढ़ना काफी नहीं है।
              <br />
              अब कठिन Mock Test देकर अपनी तैयारी जाँचिए।
            </p>
            <p className="text-xs text-slate-400 sm:text-sm">
              Submit करने के बाद score, सही उत्तर और short explanation दिखेगा।
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              to="/mock-test/current-affairs-pack-02"
              onClick={close}
              className={cn(
                "tough-popup-cta inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30",
              )}
            >
              Challenge स्वीकार करें
            </Link>
            <Link
              to="/model-paper/current-affairs-pack-02"
              onClick={close}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              पहले Model Paper देखें
            </Link>
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-3 w-full text-center text-sm text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            अभी नहीं
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
