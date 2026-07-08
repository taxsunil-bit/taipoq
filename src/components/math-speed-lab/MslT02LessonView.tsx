import { T02_TECHNIQUE } from "@/content/math-speed-lab/techniques/t02-complements-10n";
import { MslLessonView } from "./MslLessonView";

export function MslT02LessonView() {
  return (
    <MslLessonView
      technique={T02_TECHNIQUE}
      practiceTo="/math-speed-lab/complements-10n/practice/direct"
      formulaAriaLabel="Identity: complement equals base minus n; verification: n plus complement equals base"
      formulaDisplay={<>Identity: complement = base − n · check n + complement = base</>}
    />
  );
}
