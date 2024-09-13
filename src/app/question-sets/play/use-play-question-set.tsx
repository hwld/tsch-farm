import { useSearchParams } from "next/navigation";
import { useQuestions } from "../../../components/providers";
import { playQuestionSetQueryName } from "@/lib/routes";
import { questionSetSummarySchema, type QuestionSet } from "@/lib/question";
import { shuffle } from "@/lib/shuffle";
import { useMemo } from "react";
import { useQuestionSets } from "@/components/use-question-sets";
import { isUnorderedEqual } from "@/lib/utils";

type QuestionSetForPlay = QuestionSet & { isOwned: boolean };

// TODO: QuestionSetSummaryをparamsとして受け取るようにする
export const usePlayQuestionSet = (): QuestionSetForPlay => {
  const allQuestions = useQuestions();
  const {
    query: { questionSets },
  } = useQuestionSets();

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

    const set: QuestionSetForPlay = {
      id: query.id,
      title: query.title,
      questions: shuffle(questions),
      isBuildIn: query.isBuildIn,
      isPinned: query.isPinned,
      isOwned: !!questionSets?.find((mySet) => {
        return (
          mySet.title === query.title &&
          isUnorderedEqual(
            mySet.questions.map((q) => q.id),
            query.questionIds
          )
        );
      }),
    };

    return set;
  }, [allQuestions, queryRaw, questionSets]);

  return questionSet;
};
