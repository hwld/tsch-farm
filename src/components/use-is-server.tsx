import {
  createContext,
  useContext,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";

const IsServerContext = createContext<boolean | undefined>(undefined);

export const useIsServer = (): boolean => {
  const ctx = useContext(IsServerContext);
  if (ctx === undefined) {
    throw new Error("IsServerProviderが存在しません");
  }

  return ctx;
};

const empty = () => () => {};

export const IsServerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isServer = useSyncExternalStore(
    empty,
    () => false,
    () => true
  );

  return (
    <IsServerContext.Provider value={isServer}>
      {children}
    </IsServerContext.Provider>
  );
};
