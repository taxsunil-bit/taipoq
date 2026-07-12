import type { MslProgressState } from "./types";

/** Student-facing progress labels — internal machine states stay unchanged. */
export function formatMslProgressLabel(state: MslProgressState | string | undefined): string {
  switch (state) {
    case "not_started":
      return "Not started";
    case "learning":
    case "practising":
    case "review_required":
      return "In progress";
    case "proficient":
      return "Completed";
    case "mastered":
      return "Mastered";
    default:
      return state ? String(state).replace(/_/g, " ") : "Not started";
  }
}
