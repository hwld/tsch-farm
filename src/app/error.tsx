"use client";

import { IconAlertCircle, IconHome, IconTrash } from "@tabler/icons-react";
import { Button, ButtonLink } from "../components/button";
import { Routes } from "../lib/routes";
import { allLocalStorageKeys } from "../config";

export default function Error({ reset }: { reset: () => void }) {
  const handleRemoveAllData = () => {
    allLocalStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
      reset();
    });
  };

  return (
    <div className="grid place-items-start place-content-center gap-4">
      <div className="flex gap-2 flex-col">
        <IconAlertCircle className="text-red-500 size-10" />
        <p className="w-[600px] text-start">
          エラーが発生しました
          <br />
          画面を更新してもこの画面が表示される場合、URLが間違っている可能性があります。
          <br />
          ホームに遷移できない場合、データをすべて削除することでエラーが解消できる可能性がありますが、データを削除すると、復元することはできません。
        </p>
      </div>
      <div className="flex gap-2">
        <ButtonLink href={Routes.home()} leftIcon={IconHome}>
          ホームに戻る
        </ButtonLink>
        <Button
          color="destructive"
          leftIcon={IconTrash}
          onPress={handleRemoveAllData}
        >
          データをすべて削除する
        </Button>
      </div>
    </div>
  );
}
