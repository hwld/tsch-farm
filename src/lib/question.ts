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

export type QuestionSet = { title: string; questions: Question[] };

export const questionSetQuerySchema = z.object({
  title: z.string(),
  questionIds: z.array(z.number()),
});

export type QuestionSetQuery = z.infer<typeof questionSetQuerySchema>;
