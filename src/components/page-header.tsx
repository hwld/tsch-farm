import { Icon } from "@tabler/icons-react";
import { ReactNode } from "react";
import { Skeleton } from "./skeleton";
import clsx from "clsx";

const PageHeaderLayout: React.FC<{ children: ReactNode; hasIcon: boolean }> = ({
  children,
  hasIcon,
}) => {
  return (
    <div
      className={clsx(
        "text-base  items-center grid h-8",
        hasIcon ? "grid-cols-[auto_1fr] gap-2" : "grid-cols-1"
      )}
    >
      {children}
    </div>
  );
};

type Props = { icon?: Icon; children: ReactNode };

export const PageHeader: React.FC<Props> = ({ icon: Icon, children }) => {
  return (
    <PageHeaderLayout hasIcon={!!Icon}>
      {Icon ? <Icon className="size-5" /> : null}
      {children}
    </PageHeaderLayout>
  );
};

export const SkeletonPageHeader: React.FC = () => {
  return (
    <PageHeaderLayout hasIcon={false}>
      <Skeleton />
    </PageHeaderLayout>
  );
};
