import type { PropsWithChildren, ReactNode } from "react";
import {
  TooltipTrigger,
  Tooltip as RaTooltip,
  type TooltipProps,
} from "react-aria-components";

type Props = {
  label: ReactNode;
  placement?: TooltipProps["placement"];
  delay?: number;
  closeDelay?: number;
} & PropsWithChildren;

export const Tooltip: React.FC<Props> = ({
  children,
  placement,
  label,
  delay = 1000,
  closeDelay,
}) => {
  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay}>
      {children}
      <RaTooltip
        offset={4}
        placement={placement}
        className="bg-gray-800 border-border border px-2 py-1 rounded text-xs text-gray-100 shadow"
      >
        {label}
      </RaTooltip>
    </TooltipTrigger>
  );
};
