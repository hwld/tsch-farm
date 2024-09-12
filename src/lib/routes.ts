import { type QuestionSet, type QuestionSetSummary } from "./question";

/**
 * アプリ内から遷移されたかを表すクエリの名前
 */
export const isNavigatedfromAppQueryName = "from-app";

export const playQuestionSetQueryName = "query";

export const Routes = {
  home: () => `/` as const,

  questionSets: () => "/question-sets" as const,

  createQuestionSet: () =>
    `/question-sets/create?${isNavigatedfromAppQueryName}=true` as const,

  updateQuestionSet: (id: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append("id", id);
    searchParams.append(isNavigatedfromAppQueryName, "true");

    return `/question-sets/update?${searchParams.toString()}` as const;
  },

  playQuestionSet: (data: QuestionSet | QuestionSetSummary) => {
    const searchParams = new URLSearchParams();

    if ("questions" in data) {
      searchParams.set(
        playQuestionSetQueryName,
        JSON.stringify({
          id: data.id,
          title: data.title,
          questionIds: data.questions.map((q) => q.id),
          isBuildIn: data.isBuildIn,
        } satisfies QuestionSetSummary)
      );
    } else {
      searchParams.set(
        playQuestionSetQueryName,
        JSON.stringify({
          id: data.id,
          title: data.title,
          questionIds: data.questionIds,
          isBuildIn: data.isBuildIn,
        } satisfies QuestionSetSummary)
      );
    }

    return `/question-sets/play?${searchParams.toString()}` as const;
  },

  playQuestion: (questionId: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("id", questionId);

    return `/question/play?${searchParams.toString()}` as const;
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
