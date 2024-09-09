import type { Question, QuestionSet } from "@/lib/question";
import { QuestionDifficultyCountBadge } from "./question-difficulty-count-badge";
import { IconBoxMultiple } from "@tabler/icons-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";

type Props = { questionSet: QuestionSet };

export const QuestionSetCard: React.FC<Props> = ({ questionSet }) => {
  const difficultyCountMap = questionSet.questions.reduce((acc, current) => {
    acc.set(current.difficulty, (acc.get(current.difficulty) || 0) + 1);
    return acc;
  }, new Map<Question["difficulty"], number>());

  return (
    <Link
      href={Routes.playQuestionSet({
        id: questionSet.id,
        title: questionSet.title,
        questionIds: questionSet.questions.map((q) => q.id),
      })}
      className="text-start w-full border rounded-lg p-4 grid grid-rows-[1fr_min-content] gap-4 shadow-lg transition-colors border-border hover:bg-gray-800"
    >
      <div className="font-bold grid grid-cols-[min-content_1fr] items-center gap-1 text-base">
        <IconBoxMultiple className="size-5" />
        {questionSet.title}
      </div>
      <div className="flex gap-2">
        {Array.from(difficultyCountMap.entries()).map(([difficulty, count]) => {
          return (
            <QuestionDifficultyCountBadge
              key={difficulty}
              difficulty={difficulty}
              count={count}
            />
          );
        })}
      </div>
    </Link>
  );
};
