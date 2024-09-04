"use client";

import { useQuestions } from "@/components/providers";
import { TschEditor } from "@/components/tsch-editor";
import type { QuestionSet } from "@/lib/question";
import { usePlayQuestionSetQuery } from "@/lib/routes";
import { IconBoxMultiple, IconCode } from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";

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

  return (
    <div className="grid-cols-[1000px_1fr] grid p-4 gap-4 overflow-y-hidden">
      <div>
        <TschEditor question={currentQuestion} />
      </div>
      <div className="grid grid-rows-[min-content_1fr_min-content] min-h-0 border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border font-bold text-lg grid grid-cols-[min-content_1fr] gap-2">
          <IconBoxMultiple className="text-gray-200" />
          {questionSet.title}
        </div>
        <div className="flex flex-col overflow-auto">
          {questionSet.questions.map((q) => {
            return (
              <button
                key={q.id}
                className={clsx(
                  "border-b border-border p-2 text-sm text-start grid grid-cols-[min-content_1fr] gap-1 items-center",
                  currentQuestion.id === q.id && "bg-gray-700"
                )}
                onClick={() => {
                  setCurrentQuestion(q);
                }}
              >
                <IconCode className="size-4" />
                {q.title}
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">Footer</div>
      </div>
    </div>
  );
};

export default Page;
