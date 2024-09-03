"use client";

import type { Question } from "@/lib/question";
import { QuestionToggle } from "./question-toggle";
import { useState } from "react";
import { Button } from "./button";
import { QuestionListCard } from "./question-list-card";

type Props = { questions: Question[] };

export const Home: React.FC<Props> = ({ questions }) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  return (
    <div className="grid grid-cols-[1fr_1fr] p-10 gap-4 min-h-0 h-full w-full">
      <div className=" border-border rounded-lg p-10 space-y-2">
        <QuestionListCard
          name="Easy"
          questionList={[
            { id: 1, code: "", title: "1", difficulty: "warm" },
            { id: 2, code: "", title: "1", difficulty: "easy" },
            { id: 3, code: "", title: "1", difficulty: "medium" },
            { id: 4, code: "", title: "1", difficulty: "hard" },
            { id: 5, code: "", title: "1", difficulty: "extreme" },
          ]}
        />
      </div>
      <div className="flex gap-2 flex-wrap border p-4 rounded-lg border-border overflow-auto">
        {questions.map((q) => {
          return (
            <QuestionToggle
              key={q.id}
              question={q}
              isSelected={selected.has(q.id)}
              onChange={(v) => {
                if (v) {
                  setSelected((set) => new Set(set).add(q.id));
                } else {
                  setSelected((set) => {
                    const next = new Set(set);
                    next.delete(q.id);
                    return next;
                  });
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
