import { ReactNode } from "react";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  return (
    <div className="grid-cols-[1fr_300px] min-h-0 min-w-0 grid p-4 gap-4 overflow-y-hidden">
      {children}
    </div>
  );
}
