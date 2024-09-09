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
