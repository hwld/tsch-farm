import type { LinkProps } from "next/link";
import Link from "next/link";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "bg-brand-600 text-sm h-8 px-3 rounded hover:bg-brand-700 transition-colors min-w-[70px] flex items-center",
  variants: {
    disabled: { true: "opacity-50 pointer-events-none", false: "" },
  },
});

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "className"> &
  VariantProps<typeof button>;

export const Button: React.FC<ButtonProps> = ({ disabled, ...props }) => {
  return (
    <button {...props} disabled={disabled} className={button({ disabled })} />
  );
};

type ButtonLinkProps = LinkProps &
  VariantProps<typeof button> &
  PropsWithChildren;
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  disabled,
  ...props
}) => {
  return <Link {...props} className={button({ disabled })} />;
};
