import * as React from "react";

type Props = React.ComponentPropsWithRef<"svg"> & { size?: number };

export const AppIcon: React.FC<Props> = ({ size = 100, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 100 100"
    {...props}
  >
    <path
      fill="#FAFAFA"
      d="M0 10C0 4.477 4.477 0 10 0h80c5.523 0 10 4.477 10 10v80c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10V10Z"
    />
    <path
      fill="#3178C6"
      d="M8.934 54.293v-6.905h32.533v6.905H29.34V87H21.06V54.293H8.934ZM62.646 57.291v6.19H44.31v-6.19h18.336ZM48.507 87V55.144c0-2.153.42-3.939 1.257-5.357a8.078 8.078 0 0 1 3.482-3.192c1.47-.709 3.14-1.063 5.01-1.063 1.263 0 2.417.096 3.462.29 1.057.193 1.843.367 2.36.522l-1.47 6.19a10.32 10.32 0 0 0-1.2-.29 7.479 7.479 0 0 0-1.431-.136c-1.212 0-2.057.283-2.534.85-.477.555-.716 1.335-.716 2.341V87h-8.22Z"
    />
  </svg>
);
