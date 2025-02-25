"use client";

import { AppProgressProvider } from "@bprogress/next";
import { PropsWithChildren } from "react";
export const ProgressBarProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <AppProgressProvider
      color="#f3f4f6"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </AppProgressProvider>
  );
};
