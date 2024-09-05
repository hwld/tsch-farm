import { useSearchParams } from "next/navigation";
import { useQuestions } from "./providers";
import { playQuestionSetQueryName } from "@/lib/routes";
import { questionSetQuerySchema, type QuestionSet } from "@/lib/question";
import { shuffle } from "@/lib/shuffle";
import { useMemo } from "react";

export class QuestionNotFound extends Error {
  static {
    this.prototype.name = "QuestionNotFound";
  }
}

export const usePlayQuestionSet = () => {
  const allQuestions = useQuestions();

  const queryRaw = useSearchParams().get(playQuestionSetQueryName);
  if (!queryRaw) {
    throw new Error("queryが存在しません");
  }

  const questionSet = useMemo(() => {
    const query = questionSetQuerySchema.parse(JSON.parse(queryRaw));

    const questions = query.questionIds.map((questionId) => {
      const q = allQuestions.find((q) => q.id === questionId);
      if (!q) {
        throw new QuestionNotFound("存在しない問題が含まれています");
      }
      return q;
    });

    const set: QuestionSet = {
      title: query.title,
      questions: shuffle(questions),
    };

    return set;
  }, [allQuestions, queryRaw]);

  return questionSet;
};