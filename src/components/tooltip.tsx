import type { PropsWithChildren, ReactNode } from "react";
import { TooltipTrigger, Tooltip as RaTooltip } from "react-aria-components";

type Props = { label: ReactNode } & PropsWithChildren;

export const Tooltip: React.FC<Props> = ({ children, label }) => {
  return (
    <TooltipTrigger delay={1000}>
      {children}
      <RaTooltip
        offset={4}
        className="bg-gray-800 border-border border px-2 py-1 rounded text-xs text-gray-100 shadow"
      >
        {label}
      </RaTooltip>
    </TooltipTrigger>
  );
};
