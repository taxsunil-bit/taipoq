import { useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll, reconcileBodyScrollLock } from "@/lib/body-scroll-lock";
import { cn } from "@/lib/utils";

const SESSION_KEY = "taipoq_welcome_motivation_seen";
const WELCOME_IMAGE = "/images/taipoq-welcome-motivation.png";
const DURATION_SEC = 15;
const EXIT_MS = 250;

function shouldSkipWelcomeRoute(pathname: string): boolean {
  if (pathname === "/test" || pathname.startsWith("/test/")) return true;
  if (pathname.includes("/typing-test")) return true;
  if (pathname.includes("/typing-practice/test")) return true;
  return false;
}

function hasSeenWelcome(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

function markWelcomeSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore storage errors
  }
}

export function WelcomeMotivationOverlay() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [countdown, setCountdown] = useState(DURATION_SEC);
  const [reducedMotion, setReducedMotion] = useState(false);
  const closeRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const close = useCallback(() => {
    if (closeRef.current) return;
    closeRef.current = true;
    markWelcomeSeen();
    setClosing(true);
    window.setTimeout(() => setVisible(false), EXIT_MS);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(mq.matches);
    updateMotion();
    mq.addEventListener("change", updateMotion);

    const currentPath = window.location.pathname;
    if (currentPath !== "/" || shouldSkipWelcomeRoute(currentPath) || hasSeenWelcome()) {
      return () => mq.removeEventListener("change", updateMotion);
    }

    setVisible(true);
    setCountdown(DURATION_SEC);
    closeRef.current = false;

    return () => mq.removeEventListener("change", updateMotion);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (previousPathRef.current !== null && previousPathRef.current !== pathname && visible) {
      close();
    }
    previousPathRef.current = pathname;
  }, [pathname, mounted, visible, close]);

  useEffect(() => {
    if (!visible && !closing) {
      reconcileBodyScrollLock();
    }
  }, [visible, closing]);

  useEffect(() => {
    if (!visible || closing) return;

    const countdownId = window.setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const autoCloseId = window.setTimeout(() => {
      close();
    }, DURATION_SEC * 1000);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    const unlockScroll = lockBodyScroll();

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(autoCloseId);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [visible, closing, close]);

  useEffect(() => {
    return () => {
      reconcileBodyScrollLock();
    };
  }, []);

  if (!mounted || !visible) return null;

  const progressPercent = (countdown / DURATION_SEC) * 100;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 sm:p-6",
        closing ? "taipoq-welcome-exit" : "taipoq-welcome-backdrop-in",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="TAIPOQ welcome motivation"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-[920px] flex-col items-center">
        <button
          type="button"
          onClick={close}
          className="absolute -top-1 right-0 z-20 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15 sm:text-sm"
          aria-label="Skip welcome overlay"
        >
          Skip
        </button>

        <div
          className={cn(
            "taipoq-welcome-glow relative w-[94vw] max-w-[920px]",
            !reducedMotion && "taipoq-welcome-glow-pulse",
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-amber-400/35 bg-slate-950/90 shadow-2xl shadow-amber-950/40",
              !closing && !reducedMotion && "taipoq-welcome-card-in",
              closing && "opacity-90",
            )}
          >
            <div className="relative max-h-[82vh] sm:max-h-[88vh]">
              <img
                src={WELCOME_IMAGE}
                alt="TAIPOQ motivational welcome"
                className="mx-auto block h-auto max-h-[82vh] w-full max-w-full object-contain sm:max-h-[88vh]"
                width={920}
                height={520}
                decoding="async"
              />
            </div>

            <div className="border-t border-amber-500/20 bg-slate-950/95 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-center text-xs text-amber-100/90 sm:text-sm">
                Opening TAIPOQ in {countdown} second{countdown === 1 ? "" : "s"}...
              </p>
              <div
                className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-amber-950/80"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Welcome overlay progress"
              >
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400",
                    !reducedMotion && visible && !closing && "taipoq-welcome-progress-bar",
                  )}
                  style={
                    reducedMotion
                      ? { width: `${progressPercent}%`, transition: "width 1s linear" }
                      : undefined
                  }
                />
              </div>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-950/30 transition-all hover:from-amber-500 hover:to-amber-400 sm:py-3"
              >
                Continue to TAIPOQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
