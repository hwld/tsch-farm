import { type QuestionSet, type QuestionSetSummary } from "./question";

export const fromAppQueryName = "from-app";
export const playQuestionSetQueryName = "query";

export const Routes = {
  home: () => `/` as const,

  questionSets: () => "/question-sets" as const,

  createQuestionSet: () =>
    `/question-sets/create?${fromAppQueryName}=true` as const,

  playQuestionSet: (data: QuestionSet | QuestionSetSummary) => {
    const query = new URLSearchParams();

    if ("questions" in data) {
      query.set(
        playQuestionSetQueryName,
        JSON.stringify({
          id: data.id,
          title: data.title,
          questionIds: data.questions.map((q) => q.id),
          isBuildIn: data.isBuildIn,
        } satisfies QuestionSetSummary)
      );
    } else {
      query.set(
        playQuestionSetQueryName,
        JSON.stringify({
          id: data.id,
          title: data.title,
          questionIds: data.questionIds,
          isBuildIn: data.isBuildIn,
        } satisfies QuestionSetSummary)
      );
    }

    return `/question-sets/play?${query.toString()}` as const;
  },

  playQuestion: (questionId: string) => {
    const query = new URLSearchParams();
    query.set("id", questionId);

    return `/question/play?${query.toString()}` as const;
  },
} as const;

export type Route = ReturnType<(typeof Routes)[keyof typeof Routes]>;

/**
 *  SearchParamsを消す
 */
export const pathName = (route: Route): string => {
  const dummyDomain = "http://example.com";
  const url = new URL(`${dummyDomain}${route}`);

  return url.pathname;
};
