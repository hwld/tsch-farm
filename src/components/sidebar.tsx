"use client";

import { IconHome, type Icon } from "@tabler/icons-react";
import { AppIcon } from "./app-icon";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Routes } from "@/lib/routes";

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
          currentPath={pathname}
          icon={IconHome}
        />
      </div>
    </div>
  );
};

type SidebarLinkItemProps = LinkProps & { icon: Icon; currentPath: string };

const SidebarLinkItem: React.FC<SidebarLinkItemProps> = ({
  icon: Icon,
  currentPath,
  href,
  ...props
}) => {
  return (
    <Link
      href={href}
      {...props}
      className={clsx(
        "size-10 rounded-full grid place-items-center transition-colors",
        href === currentPath
          ? "bg-gray-100 text-brand-500"
          : "hover:bg-brand-400"
      )}
    >
      <Icon />
    </Link>
  );
};
