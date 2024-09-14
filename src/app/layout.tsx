import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";
import { getQuestions } from "@/lib/get-questions";
import { Suspense } from "react";
import { Toaster, type ToastT } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tsch-farm",
  description: "type-challengse周回ツール",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const questions = await getQuestions();

  // 補完を効かせるために変数に直接型をつけないでsatisfiesを使う
  const toastClass = {
    toast: "bg-gray-800 border border-border text-gray-100 group",
    icon: "group-data-[type='error']:text-red-500 group-data-[type='success']:text-lime-500",
    closeButton:
      "bg-transparent !border-[2px] !border-gray-400 !right-0 !left-[unset] !-translate-y-2 !translate-x-2 [&>svg]:stroke-[4px] [&>svg]:stroke-gray-300 hover:!bg-gray-100/30 transition-colors",
  } satisfies ToastT["classNames"];

  return (
    <html lang="ja">
      <body
        className={clsx(
          inter.className,
          "grid grid-cols-[80px_1fr] grid-rows-1 h-[100dvh] min-h-0 bg-brand-500"
        )}
      >
        <Providers questions={questions}>
          <div className="py-5">
            <Sidebar />
          </div>
          <div className="py-4 pr-4 grid min-h-0">
            <div className="grid rounded-lg overflow-hidden bg-gray-900">
              <div className="grid min-h-0 shadow-lg overflow-x-auto">
                <Suspense>{children}</Suspense>
              </div>
            </div>
          </div>
          <Toaster
            toastOptions={{ classNames: toastClass, duration: 5000 }}
            closeButton
            expand
          />
        </Providers>
      </body>
    </html>
  );
}
