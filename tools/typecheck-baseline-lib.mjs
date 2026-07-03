// Pure logic for the baseline-aware TypeScript gate (importable + testable).

import path from "node:path";

/** Files/areas that belong to the vacancy Update Safety System. */
export function isVacancySystemFile(relPath) {
  const p = String(relPath).replace(/\\/g, "/");
  return (
    /vacanc/i.test(p) ||
    p === "src/routes/upcoming-exams.tsx" ||
    p.startsWith("tools/")
  );
}

export function normalizeMessage(msg, root = "") {
  let out = String(msg);
  if (root) out = out.split(root).join("");
  return out.replace(/\r/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Parse `tsc --noEmit` output into normalized error signatures.
 * Diagnostics start with `path(line,col): error TSxxxx: msg`; subsequent
 * indented lines continue the same message.
 */
export function parseErrors(output, root = process.cwd()) {
  const lines = String(output).split("\n");
  const errors = [];
  const head = /^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.*)$/;
  let current = null;
  for (const raw of lines) {
    const m = head.exec(raw.trimEnd());
    if (m) {
      if (current) errors.push(current);
      const relPath = path.relative(root, path.resolve(root, m[1])).replace(/\\/g, "/");
      current = { file: relPath, code: m[4], message: m[5], _extra: [] };
    } else if (current && /^\s+/.test(raw) && raw.trim()) {
      current._extra.push(raw.trim());
    }
  }
  if (current) errors.push(current);
  return errors.map((e) => ({
    file: e.file,
    code: e.code,
    message: normalizeMessage([e.message, ...e._extra].join(" "), root),
  }));
}

export function signature(e) {
  return `${e.file}::${e.code}::${e.message}`;
}

function countBySig(list) {
  const m = new Map();
  for (const e of list) {
    const s = signature(e);
    const entry = m.get(s) ?? { count: 0, sample: e };
    entry.count += 1;
    m.set(s, entry);
  }
  return m;
}

/**
 * Compare current errors against a baseline as multisets.
 * @returns {{ newErrors, resolved, vacancyNewErrors, pass }}
 */
export function compare(baselineErrors, currentErrors) {
  const cur = countBySig(currentErrors);
  const base = countBySig(baselineErrors);
  const newErrors = [];
  for (const [sig, { count, sample }] of cur) {
    const baseN = base.get(sig)?.count ?? 0;
    for (let i = 0; i < count - baseN; i++) newErrors.push(sample);
  }
  const resolved = [];
  for (const [sig, { count, sample }] of base) {
    const curN = cur.get(sig)?.count ?? 0;
    for (let i = 0; i < count - curN; i++) resolved.push(sample);
  }
  const vacancyNewErrors = newErrors.filter((e) => isVacancySystemFile(e.file));
  return { newErrors, resolved, vacancyNewErrors, pass: newErrors.length === 0 && vacancyNewErrors.length === 0 };
}
