import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "@/content/tests/currentAffairsToughPack02";
import { Pack02PaperHeader } from "./Pack02PaperHeader";
import { Pack02QuestionBlock } from "./Pack02QuestionBlock";

export function CurrentAffairsPack02ModelPaperView() {
  const pack = CURRENT_AFFAIRS_TOUGH_PACK_02;

  return (
    <div className="space-y-6 font-hindi">
      <Pack02PaperHeader pack={pack} mode="model" />
      <section aria-labelledby="pack02-all-questions" className="space-y-4">
        <h2 id="pack02-all-questions" className="text-lg font-bold text-slate-900">
          सभी प्रश्न (अध्ययन मोड)
        </h2>
        {pack.questions.map((question, index) => (
          <Pack02QuestionBlock
            key={question.id}
            question={question}
            questionIndex={index}
            totalQuestions={pack.totalQuestions}
            selectedIndex={null}
            revealAnswer
          />
        ))}
      </section>
    </div>
  );
}
