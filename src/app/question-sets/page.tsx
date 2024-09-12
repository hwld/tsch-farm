"use client";

import { QuestionSetCard } from "@/components/question-set-card";
import { useQuestionSets } from "@/components/use-question-sets";
import { Routes } from "@/lib/routes";
import { IconPlus, IconStack2 } from "@tabler/icons-react";
import Link from "next/link";

const QuestionSetsPage: React.FC = () => {
  const {
    query: { status, questionSets },
  } = useQuestionSets();

  return (
    <div className="grid p-10 grid-cols-[1fr_auto]">
      <div className="gap-4 grid grid-rows-[auto_1fr]">
        <div className="text-base grid grid-cols-[auto,1fr] gap-2">
          <IconStack2 /> 問題セット
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] auto-rows-min gap-2 relative">
          {status === "success" && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSetsPage;
