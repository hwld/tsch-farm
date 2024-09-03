import { readdir, readFile } from "fs/promises";
import path from "path";
import { z } from "zod";

const questionSchema = z.object({
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

export const getQuestions = async (): Promise<Question[]> => {
  const dirName = "questions";

  const fileNames = await readdir(dirName);

  const questionProimses = fileNames.map(
    async (name): Promise<Question | null> => {
      const file = await readFile(path.join(dirName, name));
      const json = JSON.parse(file.toString());

      const result = questionSchema.safeParse(json);
      if (result.error) {
        console.error(result.error);
        return null;
      }
      return result.data;
    }
  );

  const questions = (await Promise.all(questionProimses)).filter(
    (p) => p !== null
  );

  return questions;
};
