"use client";

import { Button, ButtonGroup } from "@/components/button";
import { TschEditor } from "@/components/tsch-editor";
import { usePlayQuestionSet } from "@/components/use-play-question-set";
import {
  IconBoxMultiple,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconX,
} from "@tabler/icons-react";
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
      <div className="overflow-hidden">
        {currentQuestion && (
          <TschEditor
            question={currentQuestion}
            footer={
              <>
                <ButtonGroup>
                  <Button
                    color="secondary"
                    disabled={!hasPrevQuestion}
                    onClick={handleGoPrevQuestion}
                  >
                    <IconChevronLeft className="size-5" />
                  </Button>
                  <Button
                    color="secondary"
                    disabled={!hasNextQuestion}
                    onClick={handleGoNextQuestion}
                  >
                    <IconChevronRight className="size-5" />
                  </Button>
                </ButtonGroup>
                <Button color="secondary" leftIcon={IconX} onClick={handleEnd}>
                  終了する
                </Button>
              </>
            }
          />
        )}
      </div>
      <div className="grid grid-rows-[min-content_1fr_min-content] min-h-0 border border-border rounded-lg overflow-hidden">
        <div className="px-4 border-b border-border text-base flex items-center h-12 gap-2 bg-gray-800">
          <IconBoxMultiple className="size-5" />
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
                  "border-b border-border p-2 text-start grid grid-cols-[min-content_1fr] gap-1 items-center transition-colors",
                  currentQuestion?.id === q.id
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
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
