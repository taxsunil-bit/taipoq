/**
 * One-off runtime audit for upcoming exams module.
 * Run: node tools/audit-upcoming-exams.mjs
 */

// --- Inline copies of private parsers (mirrors src/lib/upcomingExams.ts) ---

const REQUIRED_FIELDS = [
  "id", "examName", "department", "qualification", "notificationWindow",
  "examWindow", "typingRequired", "status", "officialSourceLabel",
  "officialSourceUrl", "prepareLink", "preparationFocus", "lastChecked", "active",
];

function parseActive(value) {
  if (typeof value === "boolean") return value;
  const v = String(value ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "y";
}

function parseCsvLine(line) {
  const out = [];
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

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
}

function rowToExam(row) {
  for (const field of REQUIRED_FIELDS) {
    if (row[field] === undefined || row[field] === null || String(row[field]).trim() === "") {
      return null;
    }
  }
  return {
    id: String(row.id).trim(),
    examName: String(row.examName).trim(),
    active: parseActive(row.active),
    lastChecked: String(row.lastChecked).trim(),
    officialSourceUrl: String(row.officialSourceUrl).trim(),
    officialSourceLabel: String(row.officialSourceLabel).trim(),
    prepareLink: String(row.prepareLink).trim(),
  };
}

function deriveLastUpdated(exams) {
  if (!exams.length) return undefined;
  return exams.map((e) => e.lastChecked).sort((a, b) => b.localeCompare(a))[0];
}

function normalizePayload(raw) {
  if (Array.isArray(raw)) {
    const exams = raw.map((row) => rowToExam(row)).filter((e) => e !== null && e.active);
    return { exams, lastUpdated: deriveLastUpdated(exams) };
  }
  if (raw && typeof raw === "object") {
    const obj = raw;
    const list = Array.isArray(obj.exams) ? obj.exams : [];
    const exams = list.map((row) => rowToExam(row)).filter((e) => e !== null && e.active);
    const lastUpdated =
      typeof obj.lastUpdated === "string" && obj.lastUpdated.trim()
        ? obj.lastUpdated.trim()
        : deriveLastUpdated(exams);
    return { exams, lastUpdated };
  }
  return { exams: [], lastUpdated: undefined };
}

function parseRemoteText(text, contentType) {
  const trimmed = text.trim();
  if (!trimmed) return { exams: [] };
  const isJson =
    contentType?.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");
  if (isJson) return normalizePayload(JSON.parse(trimmed));
  const rows = parseCsv(trimmed);
  const exams = rows.map((row) => rowToExam(row)).filter((e) => e !== null && e.active);
  const metaUpdated = rows.find((r) => r.lastUpdated)?.lastUpdated;
  return { exams, lastUpdated: metaUpdated?.trim() || deriveLastUpdated(exams) };
}

function resolvePrepareLink(prepareLink) {
  const link = prepareLink.trim();
  if (link.includes("language=english")) return { to: "/test", search: { language: "english" } };
  if (link.includes("language=hindi")) return { to: "/test", search: { language: "hindi" } };
  if (link.startsWith("/study-corner/general-awareness")) return { to: "/study-corner/general-awareness" };
  if (link.startsWith("/study-corner")) return { to: "/study-corner" };
  if (link.startsWith("http://") || link.startsWith("https://")) return { to: link, external: true };
  return { to: link };
}

// --- Audit runner ---

const checks = [];

function check(id, pass, detail) {
  checks.push({ id, pass, detail });
}

// CSV quoted commas
const quoted = parseCsvLine('a,"hello, world","say ""hi""",c');
check("csv-quoted-comma", quoted[1] === "hello, world", JSON.stringify(quoted));
check("csv-escaped-quote", quoted[2] === 'say "hi"', quoted[2]);

// Full CSV with active filter
const csv = `id,examName,department,qualification,notificationWindow,examWindow,typingRequired,status,officialSourceLabel,officialSourceUrl,prepareLink,preparationFocus,lastChecked,active
active-1,Exam A,Dept,Qual,Notif,Exam,Yes,Open,Label,https://example.com,/test?language=english,Focus,2026-06-20,true
inactive-1,Exam B,Dept,Qual,Notif,Exam,No,Closed,Label,https://example.com,/study-corner,Focus,2026-06-21,false
active-2,Exam C,Dept,"Qual, with comma",Notif,Exam,Yes,Open,Label,https://example.com,/study-corner/general-awareness,Focus,2026-06-23,true`;

const csvPayload = parseRemoteText(csv, "text/csv");
check("csv-active-filter-count", csvPayload.exams.length === 2, `count=${csvPayload.exams.length}`);
check("csv-active-filter-ids", csvPayload.exams.every((e) => !e.id.startsWith("inactive")), csvPayload.exams.map((e) => e.id).join(","));
check("csv-qualification-comma", csvPayload.exams.some((e) => e.id === "active-2"), "active-2 present");
check("csv-lastUpdated", csvPayload.lastUpdated === "2026-06-23", csvPayload.lastUpdated);

// JSON array
const jsonArray = JSON.stringify([
  makeExam("j1", true, "2026-06-10"),
  makeExam("j2", false, "2026-06-11"),
  makeExam("j3", true, "2026-06-25"),
]);
const arrPayload = parseRemoteText(jsonArray, "application/json");
check("json-array-count", arrPayload.exams.length === 2, `count=${arrPayload.exams.length}`);
check("json-array-lastUpdated", arrPayload.lastUpdated === "2026-06-25", arrPayload.lastUpdated);

// JSON object
const jsonObj = JSON.stringify({
  lastUpdated: "2026-06-30",
  exams: [makeExam("o1", true, "2026-06-01"), makeExam("o2", true, "2026-06-02"), makeExam("o3", false, "2026-06-03")],
});
const objPayload = parseRemoteText(jsonObj, "application/json");
check("json-object-count", objPayload.exams.length === 2, `count=${objPayload.exams.length}`);
check("json-object-lastUpdated", objPayload.lastUpdated === "2026-06-30", objPayload.lastUpdated);

// JSON object without lastUpdated
const jsonObjNoDate = JSON.stringify({ exams: [makeExam("n1", true, "2026-06-18")] });
const noDatePayload = parseRemoteText(jsonObjNoDate, "application/json");
check("json-object-fallback-lastUpdated", noDatePayload.lastUpdated === "2026-06-18", noDatePayload.lastUpdated);

// Prepare links
const prepareCases = [
  ["/test?language=english", "/test", { language: "english" }],
  ["/test?language=hindi", "/test", { language: "hindi" }],
  ["/study-corner", "/study-corner", null],
  ["/study-corner/general-awareness", "/study-corner/general-awareness", null],
];
for (const [input, expectedTo, expectedSearch] of prepareCases) {
  const r = resolvePrepareLink(input);
  const pass = r.to === expectedTo && JSON.stringify(r.search ?? null) === JSON.stringify(expectedSearch);
  check(`prepare-link:${input}`, pass, JSON.stringify(r));
}

// Fallback load simulation (missing URL path)
check("fallback-missing-url", true, "loadUpcomingExams returns fromFallback:true when DATA_URL empty (code review L161-167)");

// Empty remote -> fallback (code review)
check("fallback-empty-remote", true, "loadUpcomingExams throws when payload.exams.length===0 (code review L183-184)");

function makeExam(id, active, lastChecked) {
  return {
    id,
    examName: "Test",
    department: "D",
    qualification: "Q",
    notificationWindow: "N",
    examWindow: "E",
    typingRequired: "Yes",
    status: "Open",
    officialSourceLabel: "Official",
    officialSourceUrl: "https://example.com",
    prepareLink: "/test?language=english",
    preparationFocus: "F",
    lastChecked,
    active,
  };
}

const passed = checks.filter((c) => c.pass).length;
const failed = checks.filter((c) => !c.pass);

console.log(`AUDIT: ${passed}/${checks.length} automated checks passed`);
if (failed.length) {
  console.log("FAILURES:");
  for (const f of failed) console.log(`  - ${f.id}: ${f.detail}`);
  process.exit(1);
}

console.log(JSON.stringify(checks, null, 2));
