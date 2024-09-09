import type { Icon } from "@tabler/icons-react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { forwardRef, type PropsWithChildren, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import {
  Button as RaButton,
  ButtonProps as RaButtonProps,
} from "react-aria-components";

const button = tv({
  slots: {
    base: "h-8 px-3 rounded transition-colors flex justify-center items-center gap-1 text-nowrap select-none outline-none data-[focus-visible]:ring-2 ring-gray-100 min-w-fit",
    leftIcon: "size-4",
  },
  variants: {
    size: { default: "", sm: { base: "text-xs" } },
    color: {
      primary: { base: "bg-brand-600 hover:bg-brand-700", leftIcon: "" },
      secondary: {
        base: "bg-gray-800 border border-border hover:bg-gray-700",
        leftIcon: "",
      },
    },
    isDisabled: { true: "opacity-50 pointer-events-none", false: "" },
  },
  defaultVariants: { color: "primary", size: "default", isDisabled: false },
});

type ButtonBaseProps = VariantProps<typeof button> & {
  leftIcon?: Icon;
  children: ReactNode;
};

type ButtonProps = ButtonBaseProps & Omit<RaButtonProps, "className">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { color, isDisabled, leftIcon: LeftIcon, children, size, ...props },
    ref
  ) {
    const classes = button({ color, isDisabled, size });

    return (
      <RaButton
        ref={ref}
        {...props}
        isDisabled={isDisabled}
        className={classes.base()}
      >
        {LeftIcon && <LeftIcon className={classes.leftIcon()} />}
        {children}
      </RaButton>
    );
  }
);

type ButtonLinkProps = ButtonBaseProps & LinkProps;

export const ButtonLink: React.FC<ButtonLinkProps> = forwardRef<
  HTMLAnchorElement,
  ButtonLinkProps
>(function ButtonLink(
  { color, isDisabled, leftIcon: LeftIcon, children, size, ...props },
  ref
) {
  const classes = button({ color, isDisabled, size });

  return (
    <Link ref={ref} {...props} className={classes.base()}>
      {LeftIcon && <LeftIcon className={classes.leftIcon()} />}
      {children}
    </Link>
  );
});

export const ButtonGroup: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:last-child)]:border-r-0">
      {children}
    </div>
  );
};
