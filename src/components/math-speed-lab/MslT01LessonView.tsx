import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import { MslLessonView } from "./MslLessonView";

export function MslT01LessonView() {
  return (
    <MslLessonView
      technique={T01_TECHNIQUE}
      practiceTo="/math-speed-lab/square-ending-5/practice/direct"
      formulaAriaLabel="Identity: open parenthesis 10 a plus 5 close parenthesis squared equals 100 a times open parenthesis a plus 1 close parenthesis plus 25"
      formulaDisplay={
        <>
          Identity: (10a + 5)<sup>2</sup> = 100a(a + 1) + 25
        </>
      }
    />
  );
}
