/**
 * Reference-counted document body scroll lock for modals/overlays.
 * Prevents nested locks from restoring a stale "hidden" overflow value.
 */

let lockCount = 0;
let storedOverflow: string | undefined;

function applyLock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    storedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function releaseLock() {
  if (typeof document === "undefined") return;
  if (lockCount <= 0) {
    lockCount = 0;
    return;
  }
  lockCount -= 1;
  if (lockCount === 0) {
    if (storedOverflow !== undefined && storedOverflow !== "") {
      document.body.style.overflow = storedOverflow;
    } else {
      document.body.style.removeProperty("overflow");
    }
    storedOverflow = undefined;
  }
}

/** Lock body scroll; call returned function to release (safe to call multiple times). */
export function lockBodyScroll(): () => void {
  applyLock();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    releaseLock();
  };
}

function hasVisibleModalDialog(): boolean {
  if (typeof document === "undefined") return false;
  return [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].some((el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const opacity = Number.parseFloat(style.opacity);
    if (!Number.isNaN(opacity) && opacity <= 0.01) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

/** Clears all locks and inline overflow when no modal should be holding scroll. */
export function forceReleaseAllBodyScrollLocks(): void {
  if (typeof document === "undefined") return;
  lockCount = 0;
  storedOverflow = undefined;
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("overflow");
}

/**
 * Reconcile stale document scroll locks after route changes or overlay teardown.
 * Safe to call when no visible modal dialog remains.
 */
export function reconcileBodyScrollLock(): void {
  if (typeof document === "undefined") return;
  if (hasVisibleModalDialog()) return;
  if (lockCount > 0 || document.body.style.overflow === "hidden") {
    forceReleaseAllBodyScrollLocks();
  }
}

/** For diagnostics/tests only. */
export function bodyScrollLockState(): { lockCount: number; overflow: string } {
  if (typeof document === "undefined") {
    return { lockCount, overflow: "" };
  }
  return { lockCount, overflow: document.body.style.overflow };
}
