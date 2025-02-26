"use client";

import { IconPlus, IconStack2 } from "@tabler/icons-react";
import Link from "next/link";
import { QuestionSetCard } from "../../../components/question-set-card";
import { useQuestionSets } from "../../../components/use-question-sets";
import { Routes } from "../../../lib/routes";
import { PageHeader } from "../../../components/page-header";
import { useMemo } from "react";
import { Skeleton } from "../../../components/skeleton";

const QuestionSetsPage: React.FC = () => {
  const {
    query: { status, questionSets },
  } = useQuestionSets();

  const questionSetsContent = useMemo(() => {
    if (status === "loading") {
      return [...new Array(7)].map((_, i) => {
        return (
          <div key={i} className="w-full h-[100px]">
            <Skeleton />
          </div>
        );
      });
    }

    if (status === "success") {
      return (
        <>
          <Link
            href={Routes.createQuestionSet()}
            className="border rounded-lg border-brand-400 transition-colors bg-brand-500/20 text-brand-400 grid place-items-center place-content-center gap-2 hover:bg-brand-500/30 outline-none data-[focus-visible]:ring-2 ring-brand-300 py-6 h-min"
          >
            <IconPlus className="size-10" />
            <p>問題セットを作成する</p>
          </Link>
          {questionSets.map((set) => {
            return <QuestionSetCard key={set.id} questionSet={set} />;
          })}
        </>
      );
    }
  }, [questionSets, status]);

  return (
    <>
      <h1>
        <PageHeader icon={IconStack2}>問題セット</PageHeader>
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] auto-rows-min gap-2 relative">
        {questionSetsContent}
      </div>
    </>
  );
};

export default QuestionSetsPage;
