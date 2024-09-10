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

export type QuestionSet = { id: string; title: string; questions: Question[] };

export const questionSetSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  questionIds: z.array(z.number()),
});

export type QuestionSetSummary = z.infer<typeof questionSetSummarySchema>;

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
    { id: "0", title: "All", questionIds: questions.map((q) => q.id) },
    {
      id: "1",
      title: "Warm",
      questionIds: questionIdsByDifficulty(questions, "warm"),
    },
    {
      id: "2",
      title: "Easy",
      questionIds: questionIdsByDifficulty(questions, "easy"),
    },
    {
      id: "3",
      title: "Medium",
      questionIds: questionIdsByDifficulty(questions, "medium"),
    },
    {
      id: "4",
      title: "Hard",
      questionIds: questionIdsByDifficulty(questions, "hard"),
    },
    {
      id: "5",
      title: "Extreme",
      questionIds: questionIdsByDifficulty(questions, "extreme"),
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
