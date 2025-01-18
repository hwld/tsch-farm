import { useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { useQuestions } from "../../../components/questions-provider";
import { useQuestionSets } from "../../../components/use-question-sets";
import {
  type QuestionSet,
  questionSetSummarySchema,
} from "../../../lib/question";
import { playQuestionSetQueryName } from "../../../lib/routes";
import { shuffle } from "../../../lib/shuffle";
import { isUnorderedEqual } from "../../../lib/utils";

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

  // SSR時とHydration時にはtrueになるようにしてハイドレーションエラーを回避する
  const isSSR = useSyncExternalStore(
    () => () => {},
    () => false,
    () => true
  );

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
      // ハイドレーションエラーを防ぐためにSSR時には空にする
      questions: isSSR ? [] : shuffle(questions),
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
  }, [allQuestions, isSSR, queryRaw, questionSets]);

  return questionSet;
};
