import type { Question } from "@/lib/question";
import { QuestionDifficultyCountBadge } from "./question-difficulty-count-badge";
import { IconPlayerPlay, IconPlayerPlayFilled } from "@tabler/icons-react";

type Props = { questionList: Question[]; name: string };

export const QuestionListCard: React.FC<Props> = ({ name, questionList }) => {
  const difficultyCountMap = questionList.reduce((acc, current) => {
    acc.set(current.difficulty, (acc.get(current.difficulty) || 0) + 1);
    return acc;
  }, new Map<Question["difficulty"], number>());

  return (
    <div className="w-full border rounded-lg border-brand-500 p-4 text-brand-100 grid grid-rows-[1fr_min-content] gap-4 shadow-lg">
      <div className="grid grid-cols-[1fr_min-content]">
        <div className="font-bold text-lg">{name}</div>
        <button className="bg-brand-600 size-10 rounded-full grid place-items-center">
          <IconPlayerPlayFilled />
        </button>
      </div>
      <div className="flex gap-2">
        {Array.from(difficultyCountMap.entries()).map(([difficulty, count]) => {
          return (
            <QuestionDifficultyCountBadge
              difficulty={difficulty}
              count={count}
            />
          );
        })}
      </div>
    </div>
  );
};
