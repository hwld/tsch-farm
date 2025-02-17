import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function HomePageLayout({ children }: Props) {
  return (
    <div className="grid grid-cols-[1fr_1fr] p-10 gap-4 min-h-0 h-full w-full">
      {children}
    </div>
  );
}
