import type { QuestionSetSummary } from "./question";
import type { Equal, Expect } from "./utils";

export const questionSetSummariesKey = "question-set-summaries";

export const APP_CONFIG: AppConfig = {
  version: 1,
  migrationConfig: [
    {
      key: questionSetSummariesKey,
      migrations: {},
    },
  ],
};

type AppConfig = {
  /**
   * localStorageのデータを変更したいときにversionを1つ上げる
   */
  version: number;

  migrationConfig: {
    key: string;
    /**
     * ```
     *  {
     *    1: (data: SchemaV1): SchemaV2 => ({...data, property: false}),
     *    2: (data: SchemaV2): SchemaV3 => ({...data, property2: false})
     *  }
     * ```
     * のようなオブジェクトを渡すと、
     * - versionが1のアプリを起動すると、1、2の順で実行される
     * - versionが2のアプリを起動すると、2が実行される
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    migrations: { [Key in number]: (...args: any) => any };
  }[];
};

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
