"use client";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";
import { QuestionSetForm } from "@/components/question-set-form";
import { Button } from "@/components/button";
import { useQuestionSets } from "@/components/use-question-set";
import { toast } from "sonner";
import type { SubmitHandler } from "react-hook-form";
import type { QuestionSetFormData } from "@/lib/question";
import { useIsNavigatedFromApp } from "../use-is-navigated-from-app";

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
      console.error(e);
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
    <div className="grid grid-rows-[auto_1fr] p-6 gap-6 min-h-0">
      <h1 className="grid grid-cols-[auto_1fr] gap-1 items-center text-base">
        <IconPlus />
        問題セットの作成
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
    </div>
  );
};

export default CreateQuestionSetPage;
