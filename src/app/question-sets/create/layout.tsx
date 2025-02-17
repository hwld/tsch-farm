import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="grid grid-rows-[auto_1fr] p-6 gap-6 min-h-0">
      {children}
    </div>
  );
}
