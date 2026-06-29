import { upcomingExamsFallback } from "@/data/upcomingExamsFallback";
import type { UpcomingExam, UpcomingExamsPayload } from "@/types/upcomingExams";

const DATA_URL =
  (import.meta.env.VITE_UPCOMING_EXAMS_DATA_URL as string | undefined)?.trim() ||
  "/data/upcoming-exams.json";

const REQUIRED_FIELDS = [
  "id",
  "examName",
  "department",
  "qualification",
  "notificationWindow",
  "examWindow",
  "typingRequired",
  "status",
  "officialSourceLabel",
  "officialSourceUrl",
  "prepareLink",
  "preparationFocus",
  "lastChecked",
  "active",
] as const;

function parseActive(value: string | boolean | undefined): boolean {
  if (typeof value === "boolean") return value;
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "y";
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
}

function rowToExam(row: Record<string, unknown>): UpcomingExam | null {
  for (const field of REQUIRED_FIELDS) {
    if (row[field] === undefined || row[field] === null || String(row[field]).trim() === "") {
      return null;
    }
  }

  return {
    id: String(row.id).trim(),
    examName: String(row.examName).trim(),
    department: String(row.department).trim(),
    qualification: String(row.qualification).trim(),
    notificationWindow: String(row.notificationWindow).trim(),
    examWindow: String(row.examWindow).trim(),
    typingRequired: String(row.typingRequired).trim(),
    status: String(row.status).trim(),
    officialSourceLabel: String(row.officialSourceLabel).trim(),
    officialSourceUrl: String(row.officialSourceUrl).trim(),
    prepareLink: String(row.prepareLink).trim(),
    preparationFocus: String(row.preparationFocus).trim(),
    lastChecked: String(row.lastChecked).trim(),
    active: parseActive(row.active as string | boolean),
  };
}

function normalizePayload(raw: unknown): UpcomingExamsPayload {
  if (Array.isArray(raw)) {
    const exams = raw
      .map((row) => rowToExam(row as Record<string, unknown>))
      .filter((e): e is UpcomingExam => e !== null && e.active);
    return { exams, lastUpdated: deriveLastUpdated(exams) };
  }

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const list = Array.isArray(obj.exams) ? obj.exams : [];
    const exams = list
      .map((row) => rowToExam(row as Record<string, unknown>))
      .filter((e): e is UpcomingExam => e !== null && e.active);
    const lastUpdated =
      typeof obj.lastUpdated === "string" && obj.lastUpdated.trim()
        ? obj.lastUpdated.trim()
        : deriveLastUpdated(exams);
    return { exams, lastUpdated };
  }

  return { exams: [], lastUpdated: undefined };
}

function deriveLastUpdated(exams: UpcomingExam[]): string | undefined {
  if (!exams.length) return undefined;
  return exams
    .map((e) => e.lastChecked)
    .sort((a, b) => b.localeCompare(a))[0];
}

function parseRemoteText(text: string, contentType: string | null): UpcomingExamsPayload {
  const trimmed = text.trim();
  if (!trimmed) return { exams: [] };

  const isJson =
    contentType?.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (isJson) {
    return normalizePayload(JSON.parse(trimmed) as unknown);
  }

  const rows = parseCsv(trimmed);
  const exams = rows
    .map((row) => rowToExam(row))
    .filter((e): e is UpcomingExam => e !== null && e.active);

  const metaUpdated = rows.find((r) => r.lastUpdated)?.lastUpdated;
  return {
    exams,
    lastUpdated: metaUpdated?.trim() || deriveLastUpdated(exams),
  };
}

export type UpcomingExamsLoadResult = {
  payload: UpcomingExamsPayload;
  fromFallback: boolean;
  error?: string;
};

export async function loadUpcomingExams(): Promise<UpcomingExamsLoadResult> {
  const url = DATA_URL;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "text/csv, application/json, text/plain, */*" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const payload = parseRemoteText(text, response.headers.get("content-type"));

    if (!payload.exams.length) {
      throw new Error("Remote source returned no active exams");
    }

    return { payload, fromFallback: false };
  } catch (error) {
    return {
      payload: upcomingExamsFallback,
      fromFallback: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function formatDisplayDate(isoLike: string | undefined): string {
  if (!isoLike) return "—";
  const parsed = Date.parse(isoLike);
  if (Number.isNaN(parsed)) return isoLike;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed));
}

/** UI-only: ISO YYYY-MM-DD → DD/MM/YYYY */
export function formatDateDDMMYYYY(isoLike: string | undefined): string {
  if (!isoLike?.trim()) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoLike.trim());
  if (!match) return isoLike.trim();
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export type PrepareLinkTarget =
  | { to: "/test"; search: { language: "english" | "hindi" } }
  | { to: "/study-corner" }
  | { to: "/study-corner/general-awareness" }
  | { to: "/study-corner/ssc-cgl-pattern-practice" }
  | { to: string; external?: boolean };

export function resolvePrepareLink(prepareLink: string): PrepareLinkTarget {
  const link = prepareLink.trim();
  if (link.includes("language=english")) {
    return { to: "/test", search: { language: "english" } };
  }
  if (link.includes("language=hindi")) {
    return { to: "/test", search: { language: "hindi" } };
  }
  if (link.startsWith("/study-corner/ssc-cgl-pattern-practice")) {
    return { to: "/study-corner/ssc-cgl-pattern-practice" };
  }
  if (link.startsWith("/study-corner/general-awareness")) {
    return { to: "/study-corner/general-awareness" };
  }
  if (link.startsWith("/study-corner")) {
    return { to: "/study-corner" };
  }
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return { to: link, external: true };
  }
  return { to: link };
}

export function getPrepareLinkLabel(prepareLink: string): string {
  if (prepareLink.includes("language=english")) return "English Typing Practice";
  if (prepareLink.includes("language=hindi")) return "Hindi Typing Practice";
  if (prepareLink.includes("ssc-cgl-pattern-practice")) return "SSC CGL Pattern Practice";
  if (prepareLink.includes("general-awareness")) return "General Awareness Library";
  if (prepareLink.includes("study-corner")) return "Library / Study Material";
  return "Prepare on TAIPOQ";
}
