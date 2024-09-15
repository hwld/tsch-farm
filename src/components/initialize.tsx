import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { migrateLocalStorage } from "../lib/migrate-local-storage";
import { APP_CONFIG } from "../config";

const IsAppInitialized = createContext<boolean | undefined>(undefined);

export const useIsAppInitialized = () => {
  const ctx = useContext(IsAppInitialized);

  if (ctx === undefined) {
    throw new Error("InitializeAppが存在しません");
  }
  1;
  return ctx;
};

export const InitializeApp: React.FC<PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    migrateLocalStorage(APP_CONFIG);
    setIsInitialized(true);
  }, []);

  return (
    <IsAppInitialized.Provider value={isInitialized}>
      {children}
    </IsAppInitialized.Provider>
  );
};
