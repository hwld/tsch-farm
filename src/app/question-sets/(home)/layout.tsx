import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return <div className="p-10 gap-4 grid grid-rows-[auto_1fr]">{children}</div>;
}
