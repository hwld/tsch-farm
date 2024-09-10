"use client";

import { QuestionSetCard } from "@/components/question-set-card";
import { useQuestionSets } from "@/components/use-question-set";
import { Routes } from "@/lib/routes";
import { IconPlus, IconStack2 } from "@tabler/icons-react";
import { Link } from "react-aria-components";

const QuestionSetsPage: React.FC = () => {
  const { questionSets } = useQuestionSets();

  return (
    <div className="grid place-items-center p-10 grid-cols-[1fr_auto]">
      <div className="size-full flex flex-col gap-4">
        <div className="text-base grid grid-cols-[auto,1fr] gap-2">
          <IconStack2 /> 問題セット
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-2">
          <Link
            href={Routes.createQuestionSet()}
            className="border rounded-lg border-brand-400 transition-colors bg-brand-500/20 text-brand-400 grid place-items-center place-content-center gap-2 hover:bg-brand-500/30 outline-none data-[focus-visible]:ring-2 ring-brand-300 py-6"
          >
            <IconPlus className="size-10" />
            <p>問題セットを作成する</p>
          </Link>
          {questionSets.map((set) => {
            return <QuestionSetCard key={set.id} questionSet={set} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionSetsPage;