"use client";

import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { allLocalStorageKeys } from "../config";
import { Button } from "../components/button";

const GlobalError: React.FC<{ reset: () => void }> = ({ reset }) => {
  const handleRemove = () => {
    allLocalStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    reset();
  };

  return (
    <html lang="ja">
      <body>
        <div className="grid h-[100dvh] p-10 grid-cols-[min-content] gap-4 place-items-start place-content-center">
          <IconAlertCircle className="text-red-500 size-10" />
          <div className="text-nowrap">
            予期しないエラーが発生しました。
            <br />
            画面を更新してもこの画面が表示される場合、データをすべて削除することでエラーが解消されることがあります。
            <br />
            データを削除すると、作成したデータは復元することができなくなります。
          </div>
          <Button
            color="destructive"
            leftIcon={IconTrash}
            onPress={handleRemove}
          >
            データをすべて削除する
          </Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
