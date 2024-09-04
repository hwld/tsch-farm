"use client";

import { useQuestions } from "@/components/providers";
import { TschEditor } from "@/components/tsch-editor";
import type { QuestionSet } from "@/lib/question";
import { usePlayQuestionSetQuery } from "@/lib/routes";
import { useId, useState } from "react";

const Page: React.FC = () => {
  const allQuestions = useQuestions();
  const query = usePlayQuestionSetQuery();

  const questionSet: QuestionSet = {
    title: query.title,
    questions: query.questionIds.map((questionId) => {
      const q = allQuestions.find((q) => q.id === questionId);
      if (!q) {
        throw new Error("存在しない問題が含まれています");
      }
      return q;
    }),
  };

  const [currentQuestion, setCurrentQuestion] = useState(
    questionSet.questions[0]
  );

  const id = useId();

  return (
    <div className="grid-cols-[1000px_1fr] grid p-4 gap-4 overflow-y-hidden">
      <div>
        <TschEditor key={id} question={currentQuestion} />
      </div>
      <div className="overflow-auto p-2 flex flex-col gap-1">
        {questionSet.questions.map((q) => {
          return (
            <button
              key={q.id}
              className="border border-border p-2 rounded text-sm"
              onClick={() => {
                setCurrentQuestion(q);
              }}
            >
              {q.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
