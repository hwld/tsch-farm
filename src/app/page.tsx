"use client";

import { Button, ButtonLink } from "@/components/button";
import { useQuestions } from "@/components/providers";
import { QuestionSetCard } from "@/components/question-set-card";
import { QuestionToggle } from "@/components/question-toggle";
import type { Question, QuestionSet } from "@/lib/question";
import { Routes } from "@/lib/routes";
import { useState } from "react";

export default function Page() {
  const questions = useQuestions();

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const questionsByDifficultyMap = questions.reduce((acc, curr) => {
    const questions = acc.get(curr.difficulty) ?? [];
    acc.set(curr.difficulty, [...questions, curr]);
    return acc;
  }, new Map<Question["difficulty"], Question[]>());

  const questionSets: QuestionSet[] = [
    { title: "Warm", questions: questionsByDifficultyMap.get("warm") ?? [] },
    { title: "Easy", questions: questionsByDifficultyMap.get("easy") ?? [] },
    {
      title: "Medium",
      questions: questionsByDifficultyMap.get("medium") ?? [],
    },
    { title: "Hard", questions: questionsByDifficultyMap.get("hard") ?? [] },
    {
      title: "Extreme",
      questions: questionsByDifficultyMap.get("extreme") ?? [],
    },
  ] as const;

  return (
    <div className="grid place-items-center min-h-0">
      <div className="grid grid-cols-[1fr_1fr] p-10 gap-4 min-h-0 h-full w-full">
        <div className="grid grid-rows-[min-content_1fr] gap-6">
          <div className="space-y-1">
            <div>問題セット</div>
            <div className="text-sm text-gray-200">
              複数の問題がまとめられた問題セットを一つ選んで挑戦することができます
            </div>
          </div>
          <div className=" border-border rounded-lg space-y-3">
            {questionSets.map((set) => {
              if (!set.questions.length) {
                return null;
              }

              return <QuestionSetCard key={set.title} questionSet={set} />;
            })}
          </div>
        </div>
        <div className="border rounded-lg border-border grid grid-rows-[min-content_1fr_min-content] min-h-0 overflow-hidden">
          <div className="p-4 bg-gray-900">問題を選択して始める</div>
          <div className="flex gap-2 flex-wrap overflow-auto p-4">
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
          <div className="p-4 flex justify-end bg-gray-900">
            <ButtonLink
              href={Routes.playQuestionSet({
                title: "選んだ問題",
                questionIds: Array.from(selected.values()),
              })}
              disabled={selected.size === 0}
            >
              開始する
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
