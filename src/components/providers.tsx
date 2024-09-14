"use client";

import type { Question } from "@/lib/question";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { RouterProvider } from "react-aria-components";
import { QuestionSetsProvider } from "./use-question-sets";
import { IsServerProvider } from "./use-is-server";
import { TypeDefsProvider } from "./type-defs-provider";
import { QuestionsProvider } from "./questions-provider";

type Props = { questions: Question[] } & PropsWithChildren;

export const Providers: React.FC<Props> = ({ children, questions }) => {
  const router = useRouter();

  return (
    <IsServerProvider>
      <RouterProvider navigate={router.push}>
        <QuestionsProvider questions={questions}>
          <QuestionSetsProvider>
            <TypeDefsProvider>{children}</TypeDefsProvider>
          </QuestionSetsProvider>
        </QuestionsProvider>
      </RouterProvider>
    </IsServerProvider>
  );
};
