import {
  getSortedDifficultyCountEntries,
  type Question,
  type QuestionSet,
} from "@/lib/question";
import { QuestionDifficultyCountBadge } from "./question-difficulty-count-badge";
import { IconBoxMultiple } from "@tabler/icons-react";
import { Routes } from "@/lib/routes";
import { Link } from "react-aria-components";

type Props = { questionSet: QuestionSet };

export const QuestionSetCard: React.FC<Props> = ({ questionSet }) => {
  const difficultyCountEntries = getSortedDifficultyCountEntries(questionSet);

  return (
    <Link
      href={Routes.playQuestionSet({
        id: questionSet.id,
        title: questionSet.title,
        questionIds: questionSet.questions.map((q) => q.id),
      })}
      className="text-start w-full border rounded-lg p-4 grid grid-rows-[1fr_auto] gap-4 shadow-lg transition-colors border-border hover:bg-gray-800 outline-none data-[focus-visible]:ring-2 ring-brand-300"
    >
      <div className="font-bold grid grid-cols-[auto_1fr] items-start gap-1">
        <IconBoxMultiple className="size-5" />
        <p className="break-all leading-none text-base mt-[2px]">
          {questionSet.title}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {difficultyCountEntries.map(([difficulty, count]) => {
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
