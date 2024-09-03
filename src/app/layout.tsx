import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tsch-farm",
  description: "type-challengse周回ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={clsx(
          inter.className,
          "grid grid-cols-[80px_1fr] h-[100dvh] min-h-0 bg-brand-600"
        )}
      >
        <div className="py-5">
          <Sidebar />
        </div>
        <div className="py-4 pr-4 grid min-h-0">
          <div className="bg-gray-950 rounded-lg grid min-h-0 shadow-lg">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
