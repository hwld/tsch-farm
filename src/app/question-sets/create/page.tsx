"use client";

import { Button } from "@/components/button";
import { useQuestions } from "@/components/providers";
import {
  questionSetFormSchema,
  type Question,
  type QuestionSetForm,
} from "@/lib/question";
import { useEffect, useRef, useState } from "react";
import { Input } from "react-aria-components";
import { QuestionWithCodeToggle } from "@/components/question-with-code-toggle";
import { IconAlertCircle, IconPlus } from "@tabler/icons-react";
import { TschEditor } from "@/components/tsch-editor";
import { useQuestionSets } from "@/components/use-question-set";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { fromAppQueryName, Routes } from "@/lib/routes";

const CreateQuestionSetPage: React.FC = () => {
  const allQuestions = useQuestions();

  const [shownQuestion, setShownQuestion] = useState<Question>(allQuestions[0]);

  const handleShowCode = (question: Question) => {
    setShownQuestion(question);
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionSetForm>({
    defaultValues: { title: "", questionIds: [] },
    resolver: zodResolver(questionSetFormSchema),
  });

  const {
    fields: selectedQuestionIds,
    append: appendQuestionId,
    remove: removeQuestionId,
  } = useFieldArray({
    control,
    name: "questionIds",
  });

  const handleChangeSelected = (question: Question, selected: boolean) => {
    if (selected) {
      appendQuestionId({ value: question.id });
    } else {
      removeQuestionId(
        selectedQuestionIds.findIndex((f) => f.value === question.id)
      );
    }
  };

  const { addQuestionSet } = useQuestionSets();
  const router = useRouter();

  const handleAddQuestionSet: SubmitHandler<QuestionSetForm> = (data) => {
    addQuestionSet(data);
    handleBack();
  };

  const handleBack = () => {
    if (fromApp.current && window.history.length > 1) {
      router.back();
    } else {
      router.push(Routes.home());
    }
  };

  const currentPath = usePathname();
  const searchParams = useSearchParams();

  const fromApp = useRef(false);
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newSearchParams.get(fromAppQueryName)) {
      fromApp.current = true;
      newSearchParams.delete(fromAppQueryName);
    }

    router.replace(currentPath + newSearchParams.toString());
  }, [currentPath, router, searchParams]);

  return (
    <div className="grid grid-rows-[auto_1fr] p-6 gap-6 min-h-0">
      <h1 className="grid grid-cols-[auto_1fr] gap-1 items-center text-base">
        <IconPlus />
        問題セットの作成
      </h1>
      <div className="grid grid-cols-[1fr_1fr] gap-4 min-h-0">
        <form
          className="grid grid-rows-[auto_1fr_auto] gap-4 min-h-0"
          onSubmit={handleSubmit(handleAddQuestionSet)}
        >
          <div className="grid grid-rows-[auto_1fr] gap-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 h-6">
              <div className="text-xs text-gray-300">タイトル</div>
              <div className="text-xs text-red-400 grid grid-cols-[auto_1fr] items-center gap-1">
                {errors.title && (
                  <>
                    <IconAlertCircle className="size-5" />
                    {errors.title?.message}
                  </>
                )}
              </div>
            </div>
            <Input
              className={clsx(
                "bg-transparent border rounded h-8 px-2 outline-none",
                errors.title
                  ? "border-red-400 ring-red-400 data-[focused]:ring-1"
                  : "border-border ring-brand-300 data-[focused]:ring-2"
              )}
              autoComplete="off"
              {...register("title")}
            />
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-2 min-h-0">
            <div className="h-6 grid grid-cols-[1fr_auto] items-center">
              <div className="text-xs text-gray-300">問題</div>
              <div className="text-xs text-red-400 grid grid-cols-[auto_1fr] items-center gap-1">
                {errors.questionIds && (
                  <>
                    <IconAlertCircle className="size-5" />
                    {errors.questionIds?.message}
                  </>
                )}
              </div>
            </div>
            <div
              className={clsx(
                "border rounded-lg  min-h-0 overflow-hidden grid",
                errors.questionIds ? "border-red-400" : "border-border"
              )}
            >
              <div className="flex flex-wrap gap-2 overflow-auto p-4">
                {allQuestions.map((q) => {
                  return (
                    <QuestionWithCodeToggle
                      key={q.id}
                      question={q}
                      isSelected={
                        !!selectedQuestionIds.find((id) => id.value === q.id)
                      }
                      onChange={(selected) => handleChangeSelected(q, selected)}
                      onShowCode={() => handleShowCode(q)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onPress={handleBack} color="secondary">
              キャンセル
            </Button>
            <Button type="submit">作成する</Button>
          </div>
        </form>
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
