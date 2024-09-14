"use client";

import { IconAlertCircle, IconHome } from "@tabler/icons-react";
import { ButtonLink } from "../components/button";
import { Routes } from "../lib/routes";

export default function Error() {
  return (
    <div className="grid place-items-center place-content-center gap-4">
      <div className="flex gap-2 flex-col items-center">
        <IconAlertCircle className="text-red-400 size-10" />
        <p className="text-center text-red-400">
          エラーが発生しました
          <br />
          ページをリロードして再度お試しください
        </p>
      </div>
      <ButtonLink href={Routes.home()} leftIcon={IconHome}>
        ホームに戻る
      </ButtonLink>
    </div>
  );
}
