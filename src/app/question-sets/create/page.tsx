"use client";

import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import type { SubmitHandler } from "react-hook-form";
import { useIsNavigatedFromApp } from "../use-is-navigated-from-app";
import { QuestionSetForm } from "../../../components/question-set-form";
import { useQuestionSets } from "../../../components/use-question-sets";
import type { QuestionSetFormData } from "../../../lib/question";
import { Routes } from "../../../lib/routes";
import { Button } from "../../../components/button";
import { PageHeader } from "../../../components/page-header";
import { useRouter } from "next-nprogress-bar";

const CreateQuestionSetPage: React.FC = () => {
  const isNavigatedFromApp = useIsNavigatedFromApp();

  const router = useRouter();
  const { addQuestionSet } = useQuestionSets();

  const handleAddQuestionSet: SubmitHandler<QuestionSetFormData> = (data) => {
    try {
      addQuestionSet(data);
      handleBack();
    } catch (e) {
      toast.error("問題セットを作成することができませんでした");
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

  return (
    <>
      <h1>
        <PageHeader icon={IconPlus}>問題セットの作成</PageHeader>
      </h1>
      <QuestionSetForm
        onSubmit={handleAddQuestionSet}
        actions={
          <>
            <Button onPress={handleBack} color="secondary">
              キャンセル
            </Button>
            <Button type="submit">作成する</Button>
          </>
        }
      />
    </>
  );
};

export default CreateQuestionSetPage;
