"use client";

import { Button, ButtonGroup } from "@/components/button";
import { Tooltip } from "@/components/tooltip";
import { TschEditor } from "@/components/tsch-editor";
import { usePlayQuestionSet } from "@/components/use-play-question-set";
import type { Monaco } from "@monaco-editor/react";
import {
  IconBoxMultiple,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconX,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const getQuestionId = (id: number) => `question-${id}`;

const PlayQuestionSetPage: React.FC = () => {
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
  const handleGoPrevQuestion = useCallback(() => {
    if (!hasPrevQuestion) {
      return;
    }

    const newIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(newIndex);
    focusQuestion(questionSet.questions[newIndex].id);
  }, [currentQuestionIndex, hasPrevQuestion, questionSet.questions]);

  const hasNextQuestion =
    currentQuestionIndex < questionSet.questions.length - 1;
  const handleGoNextQuestion = useCallback(() => {
    if (!hasNextQuestion) {
      return;
    }

    const newIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
    focusQuestion(questionSet.questions[newIndex].id);
  }, [currentQuestionIndex, hasNextQuestion, questionSet.questions]);

  const handleEnd = useCallback(() => {
    router.back();
  }, [router]);

  const buildTschEditorCommands = useCallback(
    (monaco: Monaco) => [
      {
        key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handler: () => {
          handleGoNextQuestion();
        },
      },
      {
        key: monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handler: () => {
          handleGoPrevQuestion();
        },
      },
      {
        key: monaco.KeyCode.Escape,
        handler: () => {
          handleEnd();
        },
      },
    ],
    [handleEnd, handleGoNextQuestion, handleGoPrevQuestion]
  );

  return (
    <div className="grid-cols-[1fr_300px] min-h-0 min-w-0 grid p-4 gap-4 overflow-y-hidden">
      <div className="overflow-hidden">
        {currentQuestion && (
          <TschEditor
            buildCommands={buildTschEditorCommands}
            question={currentQuestion}
            footer={
              <>
                <ButtonGroup>
                  <Tooltip label="前の問題へ (Shift+Cmd+Enter)">
                    <Button
                      color="secondary"
                      isDisabled={!hasPrevQuestion}
                      onPress={handleGoPrevQuestion}
                    >
                      <IconChevronLeft className="size-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip label="次の問題へ (Cmd+Enter)">
                    <Button
                      color="secondary"
                      isDisabled={!hasNextQuestion}
                      onPress={handleGoNextQuestion}
                    >
                      <IconChevronRight className="size-5" />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                <Tooltip label="問題を終了する (Esc)">
                  <Button
                    color="secondary"
                    leftIcon={IconX}
                    onPress={handleEnd}
                  >
                    終了する
                  </Button>
                </Tooltip>
              </>
            }
          />
        )}
      </div>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-0 border border-border rounded-lg overflow-hidden">
        <div className="px-4 border-b border-border flex items-center h-12 gap-2 bg-gray-800 min-w-0">
          <IconBoxMultiple className="size-5 shrink-0" />
          <p className="truncate">{questionSet.title}</p>
        </div>
        <div className="flex flex-col overflow-auto">
          {questionSet.questions.map((q, index) => {
            return (
              <button
                suppressHydrationWarning
                key={q.id}
                id={getQuestionId(q.id)}
                className={clsx(
                  "border-b border-border p-2 text-start grid grid-cols-[auto_1fr] gap-1 items-center transition-colors",
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

export default PlayQuestionSetPage;
