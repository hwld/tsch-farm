"use client";

import { Button, ButtonLink } from "@/components/button";
import { useQuestions } from "@/components/providers";
import { PlayQuestionSetCard } from "@/components/question-set-card";
import { QuestionToggle } from "@/components/question-toggle";
import { useQuestionSets } from "@/components/use-question-set";
import { Routes } from "@/lib/routes";
import {
  IconPlayerPlayFilled,
  IconSelect,
  IconStack2,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const questions = useQuestions();
  const { questionSets } = useQuestionSets();

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const router = useRouter();
  const handlePlaySelection = () => {
    router.push(
      Routes.playQuestionSet({
        id: crypto.randomUUID(),
        title: "選んだ問題",
        questionIds: Array.from(selected),
        isBuildIn: false,
      })
    );
  };

  return (
    <div className="grid place-items-center min-h-0">
      <div className="grid grid-cols-[1fr_1fr] p-10 gap-4 min-h-0 h-full w-full">
        <div className="grid grid-rows-[auto_1fr] rounded-lg border border-border overflow-hidden">
          <div className="flex gap-4 items-end justify-between border-b border-border p-4 bg-gray-800">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-1">
                <IconStack2 className="size-5" /> 問題セット
              </div>
              <div className="text-gray-300 text-xs">
                複数の問題がまとめられた問題セットを一つ選んで挑戦することができます
              </div>
            </div>
            <ButtonLink
              size="sm"
              color="secondary"
              href={Routes.createQuestionSet()}
            >
              作成する
            </ButtonLink>
          </div>
          <div className="border-border rounded-lg grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] auto-rows-min gap-2 p-4 overflow-auto">
            {questionSets.map((set) => {
              if (!set.questions.length) {
                return null;
              }

              return <PlayQuestionSetCard key={set.id} questionSet={set} />;
            })}
          </div>
        </div>
        <div className="border rounded-lg border-border grid grid-rows-[auto_1fr_auto] min-h-0 overflow-hidden">
          <div className="px-4 bg-gray-800 border-b border-border h-12 flex items-center gap-1">
            <IconSelect className="size-5" />
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
            <Button
              leftIcon={IconPlayerPlayFilled}
              isDisabled={selected.size === 0}
              onPress={handlePlaySelection}
            >
              開始する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
