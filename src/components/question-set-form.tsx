import { IconAlertCircle } from "@tabler/icons-react";
import clsx from "clsx";
import { Input, Switch } from "react-aria-components";
import { QuestionWithCodeToggle } from "./question-with-code-toggle";
import { TschEditor } from "./tsch-editor";
import {
  type Question,
  type QuestionSetFormData,
  questionSetFormSchema,
} from "@/lib/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuestions } from "./questions-provider";

type Props = {
  actions?: ReactNode;
  onSubmit: (data: QuestionSetFormData) => void;
  isNavigatedFromApp?: boolean;
  defaultValues?: QuestionSetFormData | undefined;
};

export const QuestionSetForm: React.FC<Props> = ({
  actions,
  onSubmit,
  defaultValues = { title: "", questionIds: [], isPinned: false },
}) => {
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
  } = useForm<QuestionSetFormData>({
    defaultValues,
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

  return (
    <form
      className="grid grid-cols-[1fr_1fr] gap-4 min-h-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-rows-[auto_auto_1fr_auto] gap-6 min-h-0">
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
            autoFocus
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
        <div className="grid grid-rows-[auto_1fr] gap-2">
          <div className="text-xs text-gray-300">オプション</div>
          <div className="border border-border rounded p-4">
            <Controller
              control={control}
              name="isPinned"
              render={({ field }) => {
                const { value, ...props } = field;
                return (
                  <Switch
                    className="grid grid-cols-[auto_1fr] items-center gap-2 group w-min text-nowrap cursor-pointer rounded-full group"
                    isSelected={value}
                    {...props}
                  >
                    <div className="h-6 w-10 group-data-[focus-visible]:ring-2 ring-brand-300 flex items-center bg-gray-500 rounded-full after:content-[''] after:bg-gray-100 after:shadow-lg after:size-4 after:rounded-full group-data-[selected=true]:after:translate-x-full group-data-[selected=true]:bg-brand-500 after:transition-all after:m-[3px]" />
                    ホームに表示する
                  </Switch>
                );
              }}
            />
          </div>
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
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
      <div>
        <TschEditor
          title={shownQuestion.title}
          question={shownQuestion}
          readOnly
        />
      </div>
    </form>
  );
};
