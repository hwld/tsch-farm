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

export const QuestionsProvider: React.FC<
  { questions: Question[] } & PropsWithChildren
> = ({ questions, children }) => {
  return (
    <QuestionsContext.Provider value={questions}>
      {children}
    </QuestionsContext.Provider>
  );
};
