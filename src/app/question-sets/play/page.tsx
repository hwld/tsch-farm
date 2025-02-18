"use client";

import type { Monaco } from "@monaco-editor/react";
import {
  IconBoxMultiple,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconDownload,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { usePlayQuestionSet } from "./use-play-question-set";
import { toast } from "sonner";
import { Button, ButtonGroup } from "../../../components/button";
import { TschEditor } from "../../../components/tsch-editor";
import { useQuestionSets } from "../../../components/use-question-sets";
import { Tooltip } from "../../../components/tooltip";
import { Question } from "../../../lib/question";
import { tv } from "tailwind-variants";
import { easeOutQuad } from "tween-functions";
import ReactConfetti from "react-confetti";
import { useRouter } from "next-nprogress-bar";

const getQuestionId = (id: number) => `question-${id}`;

const PlayQuestionSetPage: React.FC = () => {
  const router = useRouter();
  const questionSet = usePlayQuestionSet();

  const [completedQuestionIds, setCompletedQuestionIds] = useState<number[]>(
    []
  );

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

  const [showConfetti, setShowConfetti] = useState(false);

  const handleChangeErrorQuestionIds = (newErrorQuestionIds: number[]) => {
    if (!currentQuestion) {
      return;
    }

    if (newErrorQuestionIds.includes(currentQuestion.id)) {
      setCompletedQuestionIds((ids) =>
        ids.filter((i) => i !== currentQuestion.id)
      );
    } else if (!completedQuestionIds.includes(currentQuestion.id)) {
      setCompletedQuestionIds((paths) => [...paths, currentQuestion.id]);

      if (completedQuestionIds.length + 1 === questionSet.questions.length) {
        setShowConfetti(true);
      }
    }
  };

  const { addQuestionSet } = useQuestionSets();

  const handleImport = () => {
    try {
      addQuestionSet({
        title: questionSet.title,
        questionIds: questionSet.questions.map((q) => ({ value: q.id })),
        isPinned: false,
      });
      toast.success("問題セットをインポートしました");
    } catch (e) {
      toast.error("問題セットのインポートに失敗しました");
      throw e;
    }
  };

  const buildTschEditorCommands = useCallback(
    (monaco: Monaco) => [
      {
        id: "next-question",
        key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handler: () => {
          handleGoNextQuestion();
        },
      },
      {
        id: "prev-question",
        key: monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handler: () => {
          handleGoPrevQuestion();
        },
      },
    ],
    [handleGoNextQuestion, handleGoPrevQuestion]
  );

  return (
    <>
      <div className="overflow-hidden">
        {currentQuestion && (
          <TschEditor
            currentQuestion={currentQuestion}
            onChangeErrorQuestionIds={handleChangeErrorQuestionIds}
            onBuildCommands={buildTschEditorCommands}
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
                <Button color="secondary" leftIcon={IconX} onPress={handleEnd}>
                  終了する
                </Button>
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
              <QuestionListItem
                key={q.id}
                question={q}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                }}
                isCurrent={currentQuestion?.id === q.id}
                isError={!completedQuestionIds.includes(q.id)}
              />
            );
          })}
        </div>
        {!questionSet.isOwned && (
          <div className="border-t border-border grid  items-center justify-end p-2">
            <Button
              leftIcon={IconDownload}
              color="secondary"
              onPress={handleImport}
            >
              インポートする
            </Button>
          </div>
        )}
      </div>
      <Confetti isShow={showConfetti} onChangeShow={setShowConfetti} />
    </>
  );
};

export default PlayQuestionSetPage;

const item = tv({
  base: "border-b border-border p-2 text-start grid grid-cols-[auto_1fr] gap-1 items-center transition-colors",
  variants: {
    isCurrent: { true: "", false: "hover:bg-white/5" },
    isError: { true: "text-red-400", false: "text-lime-400" },
  },
  compoundVariants: [
    { isCurrent: true, isError: true, className: "bg-red-500/15" },
    {
      isCurrent: true,
      isError: false,
      className: "bg-lime-500/15",
    },
  ],
});

const QuestionListItem: React.FC<{
  question: Question;
  isCurrent: boolean;
  isError: boolean;
  onClick: () => void;
}> = ({ question, onClick, isCurrent, isError }) => {
  const classNames = item({ isCurrent, isError });

  return (
    <button
      key={question.id}
      id={getQuestionId(question.id)}
      className={classNames}
      onClick={onClick}
    >
      <IconCode className="size-4" />
      {question.title}
    </button>
  );
};

const Confetti: React.FC<{
  isShow: boolean;
  onChangeShow: (isShow: boolean) => void;
}> = ({ isShow, onChangeShow }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    update();

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return isShow ? (
    <ReactConfetti
      recycle={false}
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={1000}
      initialVelocityX={20}
      initialVelocityY={40}
      gravity={0.5}
      tweenDuration={1500}
      tweenFunction={easeOutQuad}
      confettiSource={{
        x: 0,
        y: windowSize.height,
        w: windowSize.width,
        h: 0,
      }}
      onConfettiComplete={() => onChangeShow(false)}
    />
  ) : undefined;
};
