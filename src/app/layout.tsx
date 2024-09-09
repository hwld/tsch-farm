import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";
import { getQuestions } from "@/lib/get-questions";
import { Suspense } from "react";

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

  return (
    <html lang="ja">
      <body
        className={clsx(
          inter.className,
          "grid grid-cols-[80px_1fr] grid-rows-1 h-[100dvh] min-h-0 bg-brand-500"
        )}
      >
        <Providers value={questions}>
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
        </Providers>
      </body>
    </html>
  );
}
