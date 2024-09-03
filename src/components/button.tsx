import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "bg-brand-600 h-8 px-3 rounded hover:bg-brand-700 transition-colors min-w-[70px]",
});

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> &
  VariantProps<typeof button>;

export const Button: React.FC<Props> = ({ ...props }) => {
  return <button {...props} className={button()} />;
};
