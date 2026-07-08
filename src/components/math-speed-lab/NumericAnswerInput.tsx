import { useId, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeExactPositiveInteger } from "@/lib/math-speed-lab/normalizeAnswer";
import { cn } from "@/lib/utils";

type NumericAnswerInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmitValid: (normalizedValue: number, raw: string) => void;
  onSubmitInvalid?: (reason: string) => void;
  disabled?: boolean;
  feedback?: string | null;
  feedbackTone?: "neutral" | "success" | "error";
  submitLabel?: string;
  inputId?: string;
};

/**
 * Exact-integer answer field for Math Speed Lab.
 * type="text" + inputMode="numeric" — no spinner / float behaviour.
 */
export function NumericAnswerInput({
  label,
  value,
  onChange,
  onSubmitValid,
  onSubmitInvalid,
  disabled = false,
  feedback = null,
  feedbackTone = "neutral",
  submitLabel = "Submit answer",
  inputId,
}: NumericAnswerInputProps) {
  const autoId = useId();
  const id = inputId ?? autoId;
  const feedbackId = `${id}-feedback`;
  const hintId = `${id}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    if (disabled) return;
    const parsed = normalizeExactPositiveInteger(value);
    if (!parsed.ok) {
      inputRef.current?.setAttribute("aria-invalid", "true");
      onSubmitInvalid?.(parsed.reason);
      return;
    }
    inputRef.current?.setAttribute("aria-invalid", "false");
    onSubmitValid(parsed.value, value);
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  const toneClass =
    feedbackTone === "success"
      ? "text-emerald-700 dark:text-emerald-300"
      : feedbackTone === "error"
        ? "text-red-700 dark:text-red-300"
        : "text-muted-foreground";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          {label}
        </label>
        <p id={hintId} className="text-sm text-muted-foreground">
          Enter an exact positive whole number. Digits only — no decimals or signs.
        </p>
        <Input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          enterKeyHint="done"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby={`${hintId} ${feedbackId}`}
          aria-invalid={feedbackTone === "error" ? true : undefined}
          className="min-h-11 text-base md:text-base"
        />
      </div>
      <Button
        type="submit"
        disabled={disabled}
        className="min-h-11 w-full touch-manipulation sm:w-auto"
      >
        {submitLabel}
      </Button>
      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn("min-h-6 text-sm font-medium", toneClass)}
      >
        {feedback}
      </div>
    </form>
  );
}
