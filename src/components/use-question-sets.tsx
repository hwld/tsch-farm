import {
  defaultQuestionSetSummaries,
  validateQuestionSetSummary,
  type QuestionSet,
  type QuestionSetFormData,
  type QuestionSetSummary,
} from "@/lib/question";
import { useLocalStorage } from "@mantine/hooks";
import { useQuestions } from "./providers";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useIsServer } from "./use-is-server";

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
    key: "question-sets",
    defaultValue: defaultQuestionSetSummaries(allQuestions),
  });

  const isServer = useIsServer();

  const questionSets = useMemo(() => {
    return questionSetSummaries.map((summary): QuestionSet => {
      return {
        ...summary,
        questions: summary.questionIds
          .map((id) => allQuestions.find((q) => q.id === id))
          .filter((q) => q !== undefined),
      };
    });
  }, [questionSetSummaries, allQuestions]);

  const addQuestionSet: QuestionSetsContext["addQuestionSet"] = useCallback(
    (data) => {
      const summary: QuestionSetSummary = {
        id: crypto.randomUUID(),
        isBuildIn: false,
        title: data.title,
        questionIds: data.questionIds.map((id) => id.value),
      };

      if (!validateQuestionSetSummary(summary, allQuestions)) {
        throw new Error("不正な問題セット");
      }

      // 開発時にuseEffectが2回実行される影響か、setStateが2回実行されてしまうので、更新関数を渡すのではなく、
      // 外側で新しい配列を作る
      const newSummaries = [...questionSetSummaries, summary];
      setQuestionSetSummaries(newSummaries);
    },
    [allQuestions, questionSetSummaries, setQuestionSetSummaries]
  );

  const updateQuestionSet: QuestionSetsContext["updateQuestionSet"] =
    useCallback(
      (data) => {
        const questionSet = questionSets.find((set) => set.id === data.id);
        if (!questionSet) {
          throw new Error("存在しない問題セット");
        }

        const newSummary: QuestionSetSummary = {
          id: questionSet.id,
          title: data.title,
          questionIds: data.questionIds.map((id) => id.value),
          isBuildIn: questionSet.isBuildIn,
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
      [allQuestions, questionSets, setQuestionSetSummaries]
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
          query: isServer
            ? { status: "loading", questionSets: undefined }
            : { status: "success", questionSets },
          addQuestionSet,
          updateQuestionSet,
          removeQuestionSet,
        }),
        [
          addQuestionSet,
          isServer,
          questionSets,
          removeQuestionSet,
          updateQuestionSet,
        ]
      )}
    >
      {children}
    </QuestionSetsContext.Provider>
  );
};
