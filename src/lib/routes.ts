import { type QuestionSetSummary } from "./question";

export const playQuestionSetQueryName = "query";

export const Routes = {
  home: () => `/` as const,

  questionSets: () => "/question-sets" as const,

  createQuestionSet: () => "/question-sets/create" as const,

  playQuestionSet: (questionSetQuery: QuestionSetSummary) => {
    const query = new URLSearchParams();
    query.set(playQuestionSetQueryName, JSON.stringify(questionSetQuery));

    return `/question-sets/play?${query.toString()}` as const;
  },

  playQuestion: (questionId: string) => {
    const query = new URLSearchParams();
    query.set("id", questionId);

    return `/question/play?${query.toString()}` as const;
  },
} as const;
