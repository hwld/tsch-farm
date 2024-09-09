import {
  defaultQuestionSetSummaries,
  type QuestionSet,
  type QuestionSetSummary,
} from "@/lib/question";
import { useLocalStorage } from "@mantine/hooks";
import { useQuestions } from "./providers";
import { useCallback, useMemo } from "react";

export const useQuestionSets = () => {
  const questions = useQuestions();

  const [questionSetSummaries, setQuestionSets] = useLocalStorage<
    QuestionSetSummary[]
  >({
    key: "question-set",
    defaultValue: defaultQuestionSetSummaries(questions),
  });

  const questionSets = useMemo(() => {
    return questionSetSummaries.map((summary): QuestionSet => {
      return {
        ...summary,
        questions: summary.questionIds
          .map((id) => questions.find((q) => q.id === id))
          .filter((q) => q !== undefined),
      };
    });
  }, [questionSetSummaries, questions]);

  const addQuestionSet = useCallback(() => {}, []);

  const updateQuestionSet = useCallback(() => {}, []);

  const removeQuestionSet = useCallback(() => {}, []);

  return {
    questionSets,
    addQuestionSet,
    updateQuestionSet,
    removeQuestionSet,
  };
};
