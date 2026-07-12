/**
 * TAIPOQ Calm Focus design tokens — single source for product accents.
 * CSS mirrors these values in styles.css for utility classes.
 */

export const TQ = {
  primary: "#1D4ED8",
  primaryHover: "#1E40AF",
  heroPale: "#EFF6FF",
  textMain: "#0F172A",
  textSecondary: "#475569",
  pageBg: "#F8FAFC",
  cardBg: "#FFFFFF",
  border: "#E2E8F0",
  accents: {
    tests: "#2563EB",
    pyqs: "#4F46E5",
    msl: "#0F766E",
    mission: "#D97706",
    jobs: "#15803D",
    progress: "#7C3AED",
    error: "#DC2626",
  },
  pale: {
    tests: "#EFF6FF",
    pyqs: "#EEF2FF",
    msl: "#F0FDFA",
    mission: "#FFFBEB",
    jobs: "#F0FDF4",
    progress: "#F5F3FF",
    error: "#FEF2F2",
  },
} as const;

export type ProductAccent = keyof typeof TQ.accents;
