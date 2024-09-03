import { AppIcon } from "./app-icon";

type Props = {};

export const Sidebar: React.FC<Props> = () => {
  return (
    <div className="px-2 flex flex-col items-center gap-4">
      <AppIcon size={40} />
      <div className="h-[1px] bg-brand-300 w-full" />
      <div className="flex flex-col items-center gap-2"></div>
    </div>
  );
};
