import { T02_DIRECT_QUESTIONS } from "@/content/math-speed-lab";
import { T02_TECHNIQUE } from "@/content/math-speed-lab/techniques/t02-complements-10n";
import { MslDirectPracticeRunner } from "./MslDirectPracticeRunner";

export function MslT02DirectPracticeRunner() {
  return (
    <MslDirectPracticeRunner
      technique={T02_TECHNIQUE}
      questions={T02_DIRECT_QUESTIONS}
      lessonTo="/math-speed-lab/complements-10n"
      answerLabel={(q) => `Exact complement of ${q.operand} to ${q.base}`}
      successFeedback={(q) =>
        `Correct. Complement of ${q.operand} to ${q.base} is ${q.correctAnswer}.`
      }
      errorFeedback={(q, value) =>
        `Incorrect. Your answer ${value} is not the complement of ${q.operand} to ${q.base}. Try again, or reveal the method.`
      }
    />
  );
}
