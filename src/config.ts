import { defineAppConfig } from "./lib/app-config";
import type { QuestionSetSummary } from "./lib/question";
import type { Equal, Expect } from "./lib/utils";

export const questionSetSummariesKey = "question-set-summaries";

export const APP_CONFIG = defineAppConfig({
  version: 1,
  migrationConfig: [
    {
      key: questionSetSummariesKey,
      migrations: {},
    },
  ],
});

// 型が変わったときにエラーにして、versionを上げてmigrationsを書くように伝える
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CHECKER1 = Expect<
  Equal<
    QuestionSetSummary,
    {
      id: string;
      title: string;
      questionIds: number[];
      isBuildIn: boolean;
      isPinned: boolean;
    }
  >
>;
