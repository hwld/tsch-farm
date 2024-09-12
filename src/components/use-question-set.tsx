import { useQuestionSets } from "./use-question-sets";
import type { QuestionSet } from "@/lib/question";
import { useMemo } from "react";

type UseQuestionSetResult =
  | { status: "loading"; questionSet: undefined }
  | { status: "success"; questionSet: QuestionSet }
  | { status: "error"; questionSet: undefined };

export const useQuestionSet = (id: string): UseQuestionSetResult => {
  const { query } = useQuestionSets();

  const questionSet = useMemo(() => {
    return query.questionSets?.find((set) => set.id === id);
  }, [id, query.questionSets]);

  return query.status === "loading"
    ? { status: "loading", questionSet: undefined }
    : questionSet
    ? { status: "success", questionSet }
    : { status: "error", questionSet: undefined };
};
