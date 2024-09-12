import { z } from "zod";

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  difficulty: z.union([
    z.literal("warm"),
    z.literal("easy"),
    z.literal("medium"),
    z.literal("hard"),
    z.literal("extreme"),
  ]),
  code: z.string(),
});

export type Question = z.infer<typeof questionSchema>;

export type QuestionSet = {
  id: string;
  title: string;
  questions: Question[];
  isBuildIn: boolean;
};

export const questionSetSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  questionIds: z.array(z.number()),
  isBuildIn: z.boolean(),
});

export type QuestionSetSummary = z.infer<typeof questionSetSummarySchema>;

export const questionSetFormSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  // react-hook-formの都合でnumber[]ではなく、{ value:number }[]を使う
  // https://github.com/orgs/react-hook-form/discussions/11592#discussioncomment-8692187
  questionIds: z
    .array(z.object({ value: z.number() }))
    .min(1, "問題を選択してください"),
});

export type QuestionSetForm = z.infer<typeof questionSetFormSchema>;

export const defaultQuestionSetSummaries = (
  questions: Question[]
): QuestionSetSummary[] => {
  const questionIdsByDifficulty = (
    allQuestions: Question[],
    difficulty: Question["difficulty"]
  ) => {
    return allQuestions
      .filter((q) => q.difficulty === difficulty)
      .map((q) => q.id);
  };

  return [
    {
      id: "0",
      title: "All",
      questionIds: questions.map((q) => q.id),
      isBuildIn: true,
    },
    {
      id: "1",
      title: "Warm",
      questionIds: questionIdsByDifficulty(questions, "warm"),
      isBuildIn: true,
    },
    {
      id: "2",
      title: "Easy",
      questionIds: questionIdsByDifficulty(questions, "easy"),
      isBuildIn: true,
    },
    {
      id: "3",
      title: "Medium",
      questionIds: questionIdsByDifficulty(questions, "medium"),
      isBuildIn: true,
    },
    {
      id: "4",
      title: "Hard",
      questionIds: questionIdsByDifficulty(questions, "hard"),
      isBuildIn: true,
    },
    {
      id: "5",
      title: "Extreme",
      questionIds: questionIdsByDifficulty(questions, "extreme"),
      isBuildIn: true,
    },
  ];
};

/**
 * 難易度が易しい順に並び替えられた[Difficulty, Count][]を返す
 */
export const getSortedDifficultyCountEntries = (questionSet: QuestionSet) => {
  const difficultyCountMap = questionSet.questions.reduce((acc, current) => {
    acc.set(current.difficulty, (acc.get(current.difficulty) || 0) + 1);
    return acc;
  }, new Map<Question["difficulty"], number>());

  const difficultyOrder: Question["difficulty"][] = [
    "warm",
    "easy",
    "medium",
    "hard",
    "extreme",
  ];

  return Array.from(difficultyCountMap.entries()).sort(([d1], [d2]) => {
    return difficultyOrder.indexOf(d1) - difficultyOrder.indexOf(d2);
  });
};

export const validateQuestionSetSummary = (
  summary: QuestionSetSummary,
  allQuestions: Question[]
): boolean => {
  if (summary.questionIds.length === 0) {
    return false;
  }

  if (summary.title.length === 0) {
    return false;
  }

  const allQuestionIds = allQuestions.map((q) => q.id);
  if (!summary.questionIds.every((id) => allQuestionIds.includes(id))) {
    return false;
  }

  return true;
};
