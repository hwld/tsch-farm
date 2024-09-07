import type { Icon } from "@tabler/icons-react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  slots: {
    base: "h-8 px-3 rounded transition-colors min-w-[50px] flex justify-center items-center gap-1 text-nowrap select-none",
    leftIcon: "size-4",
  },
  variants: {
    color: {
      primary: { base: "bg-brand-600 hover:bg-brand-700", leftIcon: "" },
      secondary: {
        base: "bg-gray-800 border border-border hover:bg-gray-700",
        leftIcon: "",
      },
    },
    disabled: { true: "opacity-50 pointer-events-none", false: "" },
  },
  defaultVariants: { color: "primary" },
});

type ButtonBaseProps = VariantProps<typeof button> & {
  leftIcon?: Icon;
  children: ReactNode;
};

type ButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className">;

export const Button: React.FC<ButtonProps> = ({
  color,
  disabled,
  leftIcon: LeftIcon,
  children,
  ...props
}) => {
  const classes = button({ color, disabled });

  return (
    <button {...props} disabled={disabled} className={classes.base()}>
      {LeftIcon && <LeftIcon className={classes.leftIcon()} />}
      {children}
    </button>
  );
};

type ButtonLinkProps = ButtonBaseProps & LinkProps;

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  color,
  disabled,
  leftIcon: LeftIcon,
  children,
  ...props
}) => {
  const classes = button({ color, disabled });

  return (
    <Link {...props} className={classes.base()}>
      {LeftIcon && <LeftIcon className={classes.leftIcon()} />}
      {children}
    </Link>
  );
};

export const ButtonGroup: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:last-child)]:border-r-0">
      {children}
    </div>
  );
};
