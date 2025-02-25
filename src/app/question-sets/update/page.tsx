"use client";

import { IconPencil } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useIsNavigatedFromApp } from "../use-is-navigated-from-app";
import { z } from "zod";
import { toast } from "sonner";
import { QuestionSetForm } from "../../../components/question-set-form";
import { useQuestionSet } from "../../../components/use-question-set";
import { useQuestionSets } from "../../../components/use-question-sets";
import type { QuestionSetFormData } from "../../../lib/question";
import { Routes } from "../../../lib/routes";
import { Button } from "../../../components/button";
import { PageHeader } from "../../../components/page-header";
import { useRouter } from "@bprogress/next";

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
    <>
      <h1>
        <PageHeader icon={IconPencil}>問題セットの更新</PageHeader>
      </h1>
      {questionSet && (
        <QuestionSetForm
          defaultValues={{
            title: questionSet.title,
            questionIds: questionSet.questions.map((q) => ({
              value: q.id,
            })),
            isPinned: questionSet.isPinned,
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
    </>
  );
};

export default UpdateQuestionSetPage;
