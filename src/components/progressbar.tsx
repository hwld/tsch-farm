"use client";

import { AppProgressBar } from "next-nprogress-bar";

export const ProgressBar: React.FC = () => {
  return <AppProgressBar options={{ showSpinner: false }} shallowRouting />;
};
