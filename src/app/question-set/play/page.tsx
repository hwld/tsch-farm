"use client";

import { Button } from "@/components/button";
import { TschEditor } from "@/components/tsch-editor";
import { usePlayQuestionSet } from "@/components/use-play-question-set";
import { IconBoxMultiple, IconCode } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getQuestionId = (id: number) => `question-${id}`;

const Page: React.FC = () => {
  const router = useRouter();
  const questionSet = usePlayQuestionSet();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questionSet.questions.at(currentQuestionIndex);

  const focusQuestion = (id: number) => {
    document
      .querySelector(`#${getQuestionId(id)}`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const hasPrevQuestion = currentQuestionIndex > 0;
  const handleGoPrevQuestion = () => {
    if (!hasPrevQuestion) {
      return;
    }

    const newIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(newIndex);
    focusQuestion(questionSet.questions[newIndex].id);
  };

  const hasNextQuestion =
    currentQuestionIndex < questionSet.questions.length - 1;
  const handleGoNextQuestion = () => {
    if (!hasNextQuestion) {
      return;
    }

    const newIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
    focusQuestion(questionSet.questions[newIndex].id);
  };

  const handleEnd = () => {
    router.back();
  };

  return (
    <div className="grid-cols-[1fr_300px] min-h-0 min-w-0 grid p-4 gap-4 overflow-y-hidden">
      <div className="grid grid-rows-[1fr_min-content] min-h-0 min-w-0 gap-4">
        <div className="overflow-hidden">
          {currentQuestion && <TschEditor question={currentQuestion} />}
        </div>
        <div className="flex justify-between">
          <div className="space-x-2 flex justify-end">
            <Button disabled={!hasPrevQuestion} onClick={handleGoPrevQuestion}>
              前の問題へ
            </Button>
            {hasNextQuestion ? (
              <Button
                disabled={!hasNextQuestion}
                onClick={handleGoNextQuestion}
              >
                次の問題へ
              </Button>
            ) : (
              <Button onClick={handleEnd}>終了する</Button>
            )}
          </div>
          <Button onClick={handleEnd}>中止する</Button>
        </div>
      </div>
      <div className="grid grid-rows-[min-content_1fr_min-content] min-h-0 border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border font-bold grid grid-cols-[min-content_1fr] gap-2">
          <IconBoxMultiple className="text-gray-200" />
          {questionSet.title}
        </div>
        <div className="flex flex-col overflow-auto">
          {questionSet.questions.map((q, index) => {
            return (
              <button
                suppressHydrationWarning
                key={q.id}
                id={getQuestionId(q.id)}
                className={clsx(
                  "border-b border-border p-2 text-sm text-start grid grid-cols-[min-content_1fr] gap-1 items-center",
                  currentQuestion?.id === q.id && "bg-gray-700"
                )}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                }}
              >
                <IconCode className="size-4" />
                {q.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
