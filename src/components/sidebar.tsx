"use client";

import { IconHome, IconPlus, IconStack2, type Icon } from "@tabler/icons-react";
import { AppIcon } from "./app-icon";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { pathName, Routes } from "@/lib/routes";
import { Tooltip } from "./tooltip";
import { Link, type LinkProps } from "react-aria-components";

type Props = {};

export const Sidebar: React.FC<Props> = () => {
  const pathname = usePathname();

  return (
    <div className="px-2 flex flex-col items-center gap-4 h-full">
      <AppIcon size={40} />
      <div className="h-[1px] bg-brand-300 w-full" />
      <div className="flex flex-col items-center gap-2 grow">
        <SidebarLinkItem
          href={Routes.home()}
          label="ホーム"
          currentPath={pathname}
          icon={IconHome}
        />
        <SidebarLinkItem
          href={Routes.questionSets()}
          label="問題セット一覧"
          currentPath={pathname}
          icon={IconStack2}
        />
        <SidebarLinkItem
          href={Routes.createQuestionSet()}
          label="問題セットを作る"
          currentPath={pathname}
          icon={IconPlus}
        />
      </div>
    </div>
  );
};

type SidebarLinkItemProps = LinkProps & {
  icon: Icon;
  currentPath: string;
  label: string;
};

const SidebarLinkItem: React.FC<SidebarLinkItemProps> = ({
  icon: Icon,
  currentPath,
  href,
  label,
  ...props
}) => {
  const isActive = href && currentPath === pathName(href);

  return (
    <Tooltip label={label} placement="right">
      <Link
        href={href}
        {...props}
        className={clsx(
          "size-10 rounded-full grid place-items-center transition-colors outline-none data-[focus-visible]:ring-2 ring-brand-300",
          isActive ? "bg-gray-100 text-brand-500" : "hover:bg-brand-400"
        )}
      >
        <Icon />
      </Link>
    </Tooltip>
  );
};
