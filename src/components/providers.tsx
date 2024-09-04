"use client";

import type { Question } from "@/lib/question";
import { createContext, useContext, type PropsWithChildren } from "react";

const QuestionsContext = createContext<Question[] | undefined>(undefined);

export const useQuestions = (): Question[] => {
  const ctx = useContext(QuestionsContext);
  if (!ctx) {
    throw new Error("Providersが存在しません");
  }
  return ctx;
};

type Props = { value: Question[] } & PropsWithChildren;

export const Providers: React.FC<Props> = ({ children, value }) => {
  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
