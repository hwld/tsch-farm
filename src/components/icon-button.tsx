import type { Icon } from "@tabler/icons-react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  slots: {
    base: "transition-colors hover:bg-gray-700 grid place-items-center rounded outline-none data-[focus-visible]:ring-2 ring-brand-300 data-[pressed]:bg-gray-700",
    icon: "",
  },
  variants: {
    size: {
      md: { base: "size-8", icon: "size-5" },
    },
  },
  defaultVariants: { size: "md" },
});

type Props = ButtonProps & { icon: Icon } & VariantProps<typeof button>;

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ icon: Icon, size, ...props }, ref) {
    const classes = button({ size });

    return (
      <Button ref={ref} {...props} className={classes.base()}>
        <Icon className={classes.icon()} />
      </Button>
    );
  }
);
