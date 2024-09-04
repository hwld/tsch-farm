import { useSearchParams } from "next/navigation";
import { questionSetQuerySchema, type QuestionSetQuery } from "./question";

const playQuestionSetQueryName = "query";

export const Routes = {
  home: () => `/` as const,
  playQuestionSet: (questionSetQuery: QuestionSetQuery) => {
    const query = new URLSearchParams();
    query.set(playQuestionSetQueryName, JSON.stringify(questionSetQuery));

    return `/question-set/play?${query.toString()}` as const;
  },

  playQuestion: (questionId: string) => {
    const query = new URLSearchParams();
    query.set("id", questionId);

    return `/question/play?${query.toString()}` as const;
  },
} as const;

export const usePlayQuestionSetQuery = () => {
  const queryRaw = useSearchParams().get(playQuestionSetQueryName);
  if (!queryRaw) {
    throw new Error("queryが存在しません");
  }

  return questionSetQuerySchema.parse(JSON.parse(queryRaw));
};
