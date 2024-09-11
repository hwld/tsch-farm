"use client";

import { Button } from "@/components/button";
import { useQuestions } from "@/components/providers";
import type { Question } from "@/lib/question";
import { useState } from "react";
import { Input } from "react-aria-components";
import { QuestionWithCodeToggle } from "@/components/question-with-code-toggle";
import { IconPlus } from "@tabler/icons-react";
import { TschEditor } from "@/components/tsch-editor";
import { useQuestionSets } from "@/components/use-question-set";
import { useRouter } from "next/navigation";

const CreateQuestionSetPage: React.FC = () => {
  const allQuestions = useQuestions();

  const [shownQuestion, setShownQuestion] = useState<Question>(allQuestions[0]);

  const handleShowCode = (question: Question) => {
    setShownQuestion(question);
  };

  const [title, setTitle] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleChangeSelected = (question: Question, selected: boolean) => {
    if (selected) {
      setSelectedIds((ids) => new Set(ids).add(question.id));
    } else {
      setSelectedIds((ids) => {
        const next = new Set(ids);
        next.delete(question.id);
        return next;
      });
    }
  };

  const { addQuestionSet } = useQuestionSets();
  const router = useRouter();

  const handleAddQuestionSet = () => {
    addQuestionSet({ title, questionIds: Array.from(selectedIds) });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="grid grid-rows-[auto_1fr] p-6 gap-6 min-h-0">
      <h1 className="grid grid-cols-[auto_1fr] gap-1 items-center text-base">
        <IconPlus />
        問題セットの作成
      </h1>
      <div className="grid grid-cols-[1fr_1fr] gap-4 min-h-0">
        <div className="grid grid-rows-[auto_1fr_auto] gap-4 min-h-0">
          <div className="grid grid-rows-[auto_1fr] gap-2">
            <div className="text-xs text-gray-300">タイトル</div>
            <Input
              className="bg-transparent border border-border rounded h-8 px-2"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-2 min-h-0">
            <div>問題</div>
            <div className="border border-border rounded-lg  min-h-0 overflow-hidden grid">
              <div className="flex flex-wrap gap-2 overflow-auto p-4">
                {allQuestions.map((q) => {
                  return (
                    <QuestionWithCodeToggle
                      key={q.id}
                      question={q}
                      isSelected={selectedIds.has(q.id)}
                      onChange={(selected) => handleChangeSelected(q, selected)}
                      onShowCode={() => handleShowCode(q)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onPress={handleCancel} color="secondary">
              キャンセル
            </Button>
            <Button onPress={handleAddQuestionSet}>作成する</Button>
          </div>
        </div>
        <div>
          <TschEditor
            title={shownQuestion.title}
            question={shownQuestion}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionSetPage;
