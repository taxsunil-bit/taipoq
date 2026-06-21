import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { compareTexts, computeStats, buildMistakes, normalize } from "@/lib/typing-utils";
import type { LiveStats, MistakeRow } from "@/lib/typing-utils";

export type FinalResult = LiveStats & {
  mistakeList: MistakeRow[];
  typed: string;
  target: string;
};

export type TypingScreenProps = {
  title: string;
  target: string;
  language: "en" | "hi";
  script?: "unicode" | "kruti";  // kruti = font-encoded ASCII, no NFC/grapheme
  durationMin?: number;          // if set → countdown test
  backspaceAllowed?: boolean;    // default true
  mistakeHighlight?: boolean;    // default true
  onSubmit?: (r: FinalResult) => void;
  onNext?: () => void;
};

export function TypingScreen({
  title,
  target: rawTarget,
  language,
  script = "unicode",
  durationMin,
  backspaceAllowed = true,
  mistakeHighlight = true,
  onSubmit,
  onNext,
}: TypingScreenProps) {
  // KrutiDev/Remington text is font-encoded ASCII — do NOT normalize or grapheme-split.
  const isKruti = script === "kruti";
  const cmpLang: "en" | "hi" = isKruti ? "en" : language;
  const target = useMemo(() => (isKruti ? (rawTarget ?? "") : normalize(rawTarget)), [rawTarget, isKruti]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const totalSec = durationMin ? durationMin * 60 : null;

  useEffect(() => { inputRef.current?.focus(); }, [target]);

  useEffect(() => {
    if (!startedAt || submitted) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [startedAt, submitted]);

  const elapsedSec = startedAt ? (now - startedAt) / 1000 : 0;
  const remainingSec = totalSec != null ? Math.max(0, totalSec - elapsedSec) : null;

  const stats = useMemo(
    () => computeStats(target, typed, elapsedSec, cmpLang),
    [target, typed, elapsedSec, cmpLang]
  );

  const compare = useMemo(
    () => compareTexts(target, typed, cmpLang),
    [target, typed, cmpLang]
  );

  // Auto-submit when timer ends
  useEffect(() => {
    if (totalSec != null && startedAt && !submitted && remainingSec === 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec, submitted, startedAt, totalSec]);

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    const final: FinalResult = {
      ...stats,
      mistakeList: buildMistakes(target, typed, cmpLang),
      typed,
      target,
    };
    onSubmit?.(final);
  }

  function restart() {
    setTyped("");
    setStartedAt(null);
    setNow(Date.now());
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (submitted || (totalSec != null && remainingSec === 0)) return;
    const val = e.target.value;
    if (!backspaceAllowed) {
      // Only allow strict append: new value must start with previous typed value.
      if (val.length < typed.length || !val.startsWith(typed)) return;
    }
    if (!startedAt && val.length > 0) setStartedAt(Date.now());
    setTyped(isKruti ? val : normalize(val));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (submitted) return;
    if (!backspaceAllowed) {
      const blocked = ["Backspace", "Delete"];
      if (blocked.includes(e.key)) { e.preventDefault(); return; }
      // Block select-all / cut / paste shortcuts that would replace typed text
      if ((e.ctrlKey || e.metaKey) && ["a", "x", "v", "z", "y"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    }
  }

  function blockPasteCut(e: React.SyntheticEvent) {
    // Always prevent paste/cut/drop during typing tests and practice to keep results honest.
    e.preventDefault();
  }

  const fontClass = isKruti
    ? "font-kruti text-2xl leading-relaxed"
    : language === "hi"
    ? "font-hindi text-2xl leading-relaxed"
    : "text-xl leading-relaxed";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Card>
          <CardContent className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
            {totalSec != null ? (
              <Stat label="Time Left" value={formatTime(remainingSec ?? totalSec)} accent={remainingSec != null && remainingSec <= 10 ? "danger" : undefined} />
            ) : (
              <Stat label="Time" value={`${stats.elapsedSec}s`} />
            )}
            <Stat label="Gross WPM" value={stats.grossWpm} />
            <Stat label="Net WPM" value={stats.netWpm} />
            <Stat label="Accuracy" value={`${stats.accuracy}%`} />
            <Stat label="Mistakes" value={stats.mistakes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Target Text — {title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`select-none rounded-md bg-muted/40 p-4 ${fontClass}`}>
              {compare.map((c, i) => {
                let cls = "text-muted-foreground";
                if (mistakeHighlight) {
                  if (c.status === "correct") cls = "text-success";
                  else if (c.status === "wrong") cls = "text-destructive bg-destructive/15 rounded-sm";
                }
                const isCaret = i === typed.length;
                return (
                  <span key={i} className={`${cls} ${isCaret ? "border-b-2 border-primary" : ""}`}>
                    {c.expected === " " && c.status === "wrong" ? "·" : c.expected}
                  </span>
                );
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Your Typing</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              ref={inputRef}
              value={typed}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={blockPasteCut}
              onCut={blockPasteCut}
              onDrop={(e) => e.preventDefault()}
              disabled={submitted}
              placeholder={language === "hi" ? "यहाँ टाइप करें..." : "Start typing here..."}
              className={`w-full resize-none rounded-md border bg-background p-4 outline-none focus:ring-2 focus:ring-ring ${fontClass}`}
              rows={5}
              autoFocus
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={restart}>Restart</Button>
              <Button onClick={submit} disabled={submitted || typed.length === 0}>Submit</Button>
              {onNext && <Button variant="secondary" onClick={onNext}>Next Lesson</Button>}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Backspace: <b className="text-foreground">{backspaceAllowed ? "Allowed" : "Disabled"}</b></span>
              <span>Mistake Highlight: <b className="text-foreground">{mistakeHighlight ? "On" : "Off"}</b></span>
              {totalSec != null && <span>Duration: <b className="text-foreground">{durationMin} min</b></span>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Home Row · Finger Map</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-primary/40 bg-primary/10 p-2">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-primary">Left Hand</div>
                <div className="grid grid-cols-4 gap-1 text-center font-mono text-sm font-bold">
                  {[
                    { k: "A", finger: "Little" },
                    { k: "S", finger: "Ring" },
                    { k: "D", finger: "Middle" },
                    { k: "F", finger: "Index", bump: true },
                  ].map((key) => (
                    <div key={key.k} title={`Left ${key.finger}`} className="relative rounded border border-primary/30 bg-background/60 px-1 py-1.5">
                      {key.k}
                      {key.bump && <span className="absolute bottom-0.5 left-1/2 h-1 w-2 -translate-x-1/2 rounded-full bg-destructive" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">Right Hand</div>
                <div className="grid grid-cols-4 gap-1 text-center font-mono text-sm font-bold">
                  {[
                    { k: "J", finger: "Index", bump: true },
                    { k: "K", finger: "Middle" },
                    { k: "L", finger: "Ring" },
                    { k: ";", finger: "Little" },
                  ].map((key) => (
                    <div key={key.k} title={`Right ${key.finger}`} className="relative rounded border border-amber-500/30 bg-background/60 px-1 py-1.5">
                      {key.k}
                      {key.bump && <span className="absolute bottom-0.5 left-1/2 h-1 w-2 -translate-x-1/2 rounded-full bg-destructive" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-md border border-success/40 bg-success/10 px-2 py-1.5 text-center font-mono text-[11px] font-semibold tracking-widest">
              SPACEBAR — Both Thumbs
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <b className="text-foreground">F</b> &amp; <b className="text-foreground">J</b> have small bumps (red dot) — keep both index fingers there.
            </p>
            <div className="border-t pt-2 text-xs text-muted-foreground">
              Current character:{" "}
              <span className={`ml-1 inline-block rounded bg-primary/20 px-2 py-0.5 font-semibold text-foreground ${isKruti ? "font-kruti" : language === "hi" ? "font-hindi" : ""}`}>
                {compare[typed.length]?.expected ?? "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Mistakes ({stats.mistakes})</CardTitle></CardHeader>
          <CardContent className="max-h-64 space-y-1 overflow-auto text-sm">
            {stats.mistakes === 0 && <p className="text-muted-foreground">No mistakes yet.</p>}
            {buildMistakes(target, typed, cmpLang).slice(0, 30).map((e, i) => (
              <div key={i} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                <span>#{e.position}</span>
                <span className={isKruti ? "font-kruti" : language === "hi" ? "font-hindi" : ""}>
                  <span className="text-success">{e.expected || "∅"}</span> → <span className="text-destructive">{e.typed || "∅"}</span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: "danger" }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`truncate text-lg font-semibold ${accent === "danger" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
