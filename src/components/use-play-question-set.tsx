import { useSearchParams } from "next/navigation";
import { useQuestions } from "./providers";
import { playQuestionSetQueryName } from "@/lib/routes";
import { questionSetSummarySchema, type QuestionSet } from "@/lib/question";
import { shuffle } from "@/lib/shuffle";
import { useMemo } from "react";

export const usePlayQuestionSet = () => {
  const allQuestions = useQuestions();

  const queryRaw = useSearchParams().get(playQuestionSetQueryName);
  if (!queryRaw) {
    throw new Error("queryが存在しません");
  }

  const questionSet = useMemo(() => {
    const query = questionSetSummarySchema.parse(JSON.parse(queryRaw));

    const questions = query.questionIds.map((questionId) => {
      const q = allQuestions.find((q) => q.id === questionId);
      if (!q) {
        throw new Error("存在しない問題が含まれています");
      }
      return q;
    });

    const set: QuestionSet = {
      id: query.id,
      title: query.title,
      questions: shuffle(questions),
      isBuildIn: query.isBuildIn,
    };

    return set;
  }, [allQuestions, queryRaw]);

  return questionSet;
};
