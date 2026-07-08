import { T01_DIRECT_QUESTIONS } from "@/content/math-speed-lab";
import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import { MslDirectPracticeRunner } from "./MslDirectPracticeRunner";

export function MslT01DirectPracticeRunner() {
  return (
    <MslDirectPracticeRunner
      technique={T01_TECHNIQUE}
      questions={T01_DIRECT_QUESTIONS}
      lessonTo="/math-speed-lab/square-ending-5"
      answerLabel={(q) => `Exact value of ${q.operand} squared`}
      successFeedback={(q) => `Correct. ${q.operand}² = ${q.correctAnswer}.`}
      errorFeedback={(q, value) =>
        `Incorrect. Your answer ${value} is not equal to ${q.operand}². Try again, or reveal the method.`
      }
    />
  );
}
