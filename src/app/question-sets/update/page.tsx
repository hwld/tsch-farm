"use client";

import { Button } from "@/components/button";
import { QuestionSetForm } from "@/components/question-set-form";
import { IconPencil } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsNavigatedFromApp } from "../use-is-navigated-from-app";
import { Routes } from "@/lib/routes";
import { useQuestionSet } from "@/components/use-question-set";
import { z } from "zod";
import type { QuestionSetFormData } from "@/lib/question";
import { useQuestionSets } from "@/components/use-question-sets";
import { toast } from "sonner";

const UpdateQuestionSetPage: React.FC = () => {
  const id = z.string().parse(useSearchParams().get("id"));
  const { status, questionSet } = useQuestionSet(id);

  const { updateQuestionSet } = useQuestionSets();

  const router = useRouter();
  const isNavigatedFromApp = useIsNavigatedFromApp();

  const handleUpdate = (data: QuestionSetFormData) => {
    try {
      updateQuestionSet({ ...data, id });
      handleBack();
    } catch (e) {
      toast.error("問題セットを更新することができませんでした");
      throw e;
    }
  };

  const handleBack = () => {
    if (isNavigatedFromApp && window.history.length > 1) {
      router.back();
    } else {
      router.push(Routes.home());
    }
  };

  if (status === "error") {
    throw new Error("問題セットが存在しない");
  }

  return (
    <div className="grid grid-rows-[auto_1fr] p-6 gap-6 min-h-0">
      <h1 className="grid grid-cols-[auto_1fr] gap-1 items-center text-base">
        <IconPencil />
        問題セットの更新
      </h1>
      {questionSet && (
        <QuestionSetForm
          defaultValues={{
            title: questionSet.title,
            questionIds: questionSet.questions.map((q) => ({
              value: q.id,
            })),
          }}
          onSubmit={handleUpdate}
          actions={
            <>
              <Button onPress={handleBack} color="secondary">
                キャンセル
              </Button>
              <Button type="submit">更新する</Button>
            </>
          }
        />
      )}
    </div>
  );
};

export default UpdateQuestionSetPage;
