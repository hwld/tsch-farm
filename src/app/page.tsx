"use client";

import { ButtonLink } from "@/components/button";
import { useQuestions } from "@/components/providers";
import { QuestionSetCard } from "@/components/question-set-card";
import { QuestionToggle } from "@/components/question-toggle";
import type { Question, QuestionSet } from "@/lib/question";
import { Routes } from "@/lib/routes";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
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
        <div className="grid grid-rows-[min-content_1fr] rounded-lg border border-border overflow-hidden">
          <div className="flex gap-4 items-start justify-between border-b border-border p-4 bg-gray-800">
            <div className="flex flex-col gap-2">
              <div>問題セット</div>
              <div className="text-gray-300 text-xs">
                複数の問題がまとめられた問題セットを一つ選んで挑戦することができます
              </div>
            </div>
            <ButtonLink size="sm" color="secondary" href="/question-set/create">
              問題セットを作成する
            </ButtonLink>
          </div>
          <div className=" border-border rounded-lg grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] auto-rows-min gap-2 p-4">
            {questionSets.map((set) => {
              if (!set.questions.length) {
                return null;
              }

              return <QuestionSetCard key={set.title} questionSet={set} />;
            })}
          </div>
        </div>
        <div className="border rounded-lg border-border grid grid-rows-[min-content_1fr_min-content] min-h-0 overflow-hidden">
          <div className="px-4 bg-gray-800 border-b border-border h-12 flex items-center">
            問題を選んで始める
          </div>
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
          <div className="px-2 h-12 items-center flex justify-end bg-gray-800 border-t border-border">
            <ButtonLink
              leftIcon={IconPlayerPlayFilled}
              href={Routes.playQuestionSet({
                title: "選んだ問題",
                questionIds: Array.from(selected.values()),
              })}
              isDisabled={selected.size === 0}
            >
              開始する
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
