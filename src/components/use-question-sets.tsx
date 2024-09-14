import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useLocalStorage } from "./use-local-storage";
import { useQuestions } from "./questions-provider";
import {
  defaultQuestionSetSummaries,
  validateQuestionSetSummary,
  type QuestionSet,
  type QuestionSetFormData,
  type QuestionSetSummary,
} from "../lib/question";
import { questionSetSummariesKey } from "../lib/app-config";

type QuestionSetsContext = {
  query:
    | { status: "success"; questionSets: QuestionSet[] }
    | { status: "loading"; questionSets: undefined };
  addQuestionSet: (data: QuestionSetFormData) => void;
  updateQuestionSet: (data: QuestionSetFormData & { id: string }) => void;
  removeQuestionSet: (id: string) => void;
};

const QuestionSetsContext = createContext<QuestionSetsContext | undefined>(
  undefined
);

export const useQuestionSets = () => {
  const ctx = useContext(QuestionSetsContext);
  if (!ctx) {
    throw new Error("QuestionSetsProviderが存在しません");
  }

  return ctx;
};

export const QuestionSetsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const allQuestions = useQuestions();

  const [questionSetSummaries, setQuestionSetSummaries] = useLocalStorage<
    QuestionSetSummary[]
  >({
    key: questionSetSummariesKey,
    defaultValue: defaultQuestionSetSummaries(allQuestions),
  });

  const questionSetsQuery = useMemo((): QuestionSetsContext["query"] => {
    if (questionSetSummaries.status === "loading") {
      return { status: "loading", questionSets: undefined };
    }

    const data = questionSetSummaries.data.map((summary): QuestionSet => {
      return {
        ...summary,
        questions: summary.questionIds
          .map((id) => allQuestions.find((q) => q.id === id))
          .filter((q) => q !== undefined),
      };
    });

    return { status: "success", questionSets: data };
  }, [questionSetSummaries, allQuestions]);

  const addQuestionSet: QuestionSetsContext["addQuestionSet"] = useCallback(
    (data) => {
      if (questionSetSummaries.status === "loading") {
        return;
      }

      const summary: QuestionSetSummary = {
        id: crypto.randomUUID(),
        isBuildIn: false,
        title: data.title,
        questionIds: data.questionIds.map((id) => id.value),
        isPinned: data.isPinned,
      };

      if (!validateQuestionSetSummary(summary, allQuestions)) {
        throw new Error("不正な問題セット");
      }

      // 開発時にuseEffectが2回実行される影響か、setStateが2回実行されてしまうので、更新関数を渡すのではなく、
      // 外側で新しい配列を作る
      const newSummaries = [...questionSetSummaries.data, summary];
      setQuestionSetSummaries(newSummaries);
    },
    [allQuestions, questionSetSummaries, setQuestionSetSummaries]
  );

  const updateQuestionSet: QuestionSetsContext["updateQuestionSet"] =
    useCallback(
      (data) => {
        if (questionSetsQuery.status === "loading") {
          return;
        }

        const questionSet = questionSetsQuery.questionSets.find(
          (set) => set.id === data.id
        );
        if (!questionSet) {
          throw new Error("存在しない問題セット");
        }

        const newSummary: QuestionSetSummary = {
          id: questionSet.id,
          title: data.title,
          questionIds: data.questionIds.map((id) => id.value),
          isBuildIn: questionSet.isBuildIn,
          isPinned: data.isPinned,
        };

        if (!validateQuestionSetSummary(newSummary, allQuestions)) {
          throw new Error("不正な問題セット");
        }

        setQuestionSetSummaries((summaries) =>
          summaries.map((s) => {
            if (s.id === newSummary.id) {
              return newSummary;
            }
            return s;
          })
        );
      },
      [allQuestions, questionSetsQuery, setQuestionSetSummaries]
    );

  const removeQuestionSet: QuestionSetsContext["removeQuestionSet"] =
    useCallback(
      (id) => {
        setQuestionSetSummaries((sets) => sets.filter((s) => s.id !== id));
      },
      [setQuestionSetSummaries]
    );

  return (
    <QuestionSetsContext.Provider
      value={useMemo(
        (): QuestionSetsContext => ({
          // ビルド中のレンダリングと、ハイドレーション中はローディング状態にしておく
          query: questionSetsQuery,
          addQuestionSet,
          updateQuestionSet,
          removeQuestionSet,
        }),
        [
          addQuestionSet,
          questionSetsQuery,
          removeQuestionSet,
          updateQuestionSet,
        ]
      )}
    >
      {children}
    </QuestionSetsContext.Provider>
  );
};
