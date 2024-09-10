/**
 * <Menu trigger={<Button />}>
 *    <MenuItem icon={} onAction={}>更新する</MenuItem>
 *    <MenuItem>削除する</MenuItem>
 *    <MenuItem>問題を解く</MenuItem>
 *    <MenuItem>お気に入り登録する</MenuItem>
 * </Menu>
 */

import type { Icon } from "@tabler/icons-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState, type PropsWithChildren, type ReactNode } from "react";
import {
  MenuTrigger,
  Popover,
  Menu as RaMenu,
  MenuItem as RaMenuItem,
  MenuItemProps as RaMenuItemProps,
  Separator,
} from "react-aria-components";

const MotionPopover = motion(Popover);

type Props = { trigger: ReactNode } & PropsWithChildren;

export const Menu: React.FC<Props> = ({ trigger, children }) => {
  const [animation, setAnimation] = useState<
    "unmounted" | "hidden" | "visible"
  >("unmounted");

  return (
    <MenuTrigger
      onOpenChange={(isOpen) => setAnimation(isOpen ? "visible" : "hidden")}
    >
      {trigger}
      <MotionPopover
        isExiting={animation === "hidden"}
        onAnimationComplete={(animation) =>
          setAnimation((a) => {
            return animation === "hidden" && a === "hidden" ? "unmounted" : a;
          })
        }
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={animation}
        transition={{ duration: 0.1 }}
      >
        <RaMenu className="min-w-[200px] text-sm border border-border rounded-lg bg-gray-800 shadow-lg p-2 outline-none">
          {children}
        </RaMenu>
      </MotionPopover>
    </MenuTrigger>
  );
};

type MenuItemProps = {
  icon: Icon;
  label: string;
  destructive?: boolean;
} & RaMenuItemProps;

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon: Icon,
  destructive,
  ...props
}) => {
  return (
    <RaMenuItem
      {...props}
      className={clsx(
        "px-2 h-8 gap-2 outline-none rounded transition-colors cursor-pointer grid grid-cols-[18px_1fr] items-center",
        destructive
          ? "text-red-400 data-[focused]:bg-red-500/20"
          : "data-[focused]:bg-gray-600"
      )}
    >
      <div className="grid place-items-center">
        <Icon className="w-full" />
      </div>
      {label}
    </RaMenuItem>
  );
};

export const MenuSeparator: React.FC = () => {
  return <Separator className="h-[1px] bg-gray-700 my-2" />;
};
