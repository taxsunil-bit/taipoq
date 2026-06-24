import { readFileSync } from "fs";
import { execSync } from "child_process";

const j = JSON.parse(readFileSync("public/data/upcoming-exams.json", "utf8"));
const active = j.exams.filter((e) => e.active);
const urls = [...new Set(active.map((e) => e.officialSourceUrl))];

for (const u of urls) {
  try {
    const code = execSync(
      `curl -s -o NUL -w "%{http_code}" -L --max-time 20 -A "Mozilla/5.0" "${u}"`,
      { encoding: "utf8" },
    ).trim();
    const ok = code.startsWith("2") || code === "307";
    console.log(`${ok ? "OK" : "FAIL"} ${code} ${u}`);
  } catch {
    console.log(`FAIL ERR ${u}`);
  }
}
