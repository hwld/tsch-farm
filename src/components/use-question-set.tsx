import {
  defaultQuestionSetSummaries,
  validateQuestionSetSummary,
  type QuestionSet,
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

type QuestionSetsContext = {
  questionSets: QuestionSet[];
  addQuestionSetSummary: (summary: QuestionSetSummary) => void;
  updateQuestionSetSummary: (summary: QuestionSetSummary) => void;
  removeQuestionSetSummary: (id: string) => void;
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
    key: "question-set",
    defaultValue: defaultQuestionSetSummaries(allQuestions),
  });

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

  const addQuestionSetSummary = useCallback(
    (summary: QuestionSetSummary) => {
      if (questionSets.find((set) => set.id === summary.id)) {
        throw new Error("すでに存在する問題セット");
      }

      if (!validateQuestionSetSummary(summary, allQuestions)) {
        throw new Error("不正な問題セット");
      }

      // 開発時にuseEffectが2回実行される影響か、setStateが2回実行されてしまうので、更新関数を渡すのではなく、
      // 外側で新しい配列を作る
      const newSummaries = [...questionSetSummaries, summary];
      setQuestionSetSummaries(newSummaries);
    },
    [allQuestions, questionSetSummaries, questionSets, setQuestionSetSummaries]
  );

  const updateQuestionSetSummary = useCallback(
    (summary: QuestionSetSummary) => {
      if (!questionSets.find((set) => set.id === summary.id)) {
        throw new Error("存在しない問題セット");
      }

      if (!validateQuestionSetSummary(summary, allQuestions)) {
        throw new Error("不正な問題セット");
      }

      setQuestionSetSummaries((summaries) =>
        summaries.map((s) => {
          if (s.id === summary.id) {
            return summary;
          }
          return s;
        })
      );
    },
    [allQuestions, questionSets, setQuestionSetSummaries]
  );

  const removeQuestionSetSummary = useCallback(
    (id: string) => {
      setQuestionSetSummaries((sets) => sets.filter((s) => s.id !== id));
    },
    [setQuestionSetSummaries]
  );

  return (
    <QuestionSetsContext.Provider
      value={{
        questionSets,
        addQuestionSetSummary,
        updateQuestionSetSummary,
        removeQuestionSetSummary,
      }}
    >
      {children}
    </QuestionSetsContext.Provider>
  );
};
