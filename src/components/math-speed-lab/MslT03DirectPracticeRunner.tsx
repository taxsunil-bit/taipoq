import { T03_DIRECT_QUESTIONS } from "@/content/math-speed-lab";
import { T03_TECHNIQUE } from "@/content/math-speed-lab/techniques/t03-nearbase-100";
import { MslDirectPracticeRunner } from "./MslDirectPracticeRunner";

export function MslT03DirectPracticeRunner() {
  return (
    <MslDirectPracticeRunner
      technique={T03_TECHNIQUE}
      questions={T03_DIRECT_QUESTIONS}
      lessonTo="/math-speed-lab/nearbase-100"
      answerLabel={(q) => `Exact product of ${q.leftOperand} × ${q.rightOperand}`}
      successFeedback={(q) => `Correct. ${q.leftOperand} × ${q.rightOperand} = ${q.correctAnswer}.`}
      errorFeedback={(q, value) =>
        `Incorrect. Your answer ${value} is not equal to ${q.leftOperand} × ${q.rightOperand}. Try again, or reveal the method.`
      }
    />
  );
}
