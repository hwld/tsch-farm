import { writeFile } from "fs/promises";
import { getQuestionsMeta, type QuestionMeta } from "./get-questions-meta";
import { getQuestionCode } from "./get-question-code";

export type Question = QuestionMeta & { code: string };

const loadQuestions = async () => {
  const questionsMeta = await getQuestionsMeta();
  const questions = (
    await Promise.all(
      questionsMeta.map(async (q): Promise<Question | null> => {
        const code = await getQuestionCode(q.id);
        if (!code) {
          return null;
        }

        return { id: q.id, title: q.title, difficulty: q.difficulty, code };
      })
    )
  ).filter((q) => q !== null);

  await Promise.all(
    questions.map((q) => writeFile(`questions/${q.id}.json`, JSON.stringify(q)))
  );
};

loadQuestions();
