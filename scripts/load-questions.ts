import { mkdir, writeFile } from "node:fs/promises";
import { getQuestionsMeta, type QuestionMeta } from "./get-questions-meta";
import { getQuestionCode } from "./get-question-code";
import { join } from "node:path";

export type Question = QuestionMeta & { code: string };

const questionsPath = "questions";

const loadQuestions = async () => {
  const questionsMeta = await getQuestionsMeta();

  await mkdir(questionsPath, { recursive: true });

  await Promise.all(
    questionsMeta.map(async (q) => {
      const code = await getQuestionCode(q.id);
      if (!code) {
        return;
      }

      const question: Question = { ...q, code };

      await writeFile(
        join(questionsPath, `${q.id}.json`),
        JSON.stringify(question)
      );
    })
  );
};

loadQuestions();
