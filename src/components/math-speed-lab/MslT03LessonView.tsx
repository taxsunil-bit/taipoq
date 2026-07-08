import { T03_TECHNIQUE } from "@/content/math-speed-lab/techniques/t03-nearbase-100";
import { MslLessonView } from "./MslLessonView";

export function MslT03LessonView() {
  return (
    <MslLessonView
      technique={T03_TECHNIQUE}
      practiceTo="/math-speed-lab/nearbase-100/practice/direct"
      formulaAriaLabel="Identity: n times m equals 100 times open parenthesis n minus d 2 close parenthesis plus d 1 times d 2, Model A base 100"
      formulaDisplay={<>Identity: n × m = 100(n − d2) + d1 × d2 (Model A)</>}
    />
  );
}
