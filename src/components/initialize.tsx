import { useEffect, useState, type PropsWithChildren } from "react";
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from "./use-local-storage";
import { APP_CONFIG } from "@/lib/app-config";

export const InitializeApp: React.FC<PropsWithChildren> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    migrateLocalStorage();
    setIsInitialized(true);
  }, []);

  return isInitialized && children;
};

const migrateLocalStorage = () => {
  const versionKey = "version";

  const storedVersion = readLocalStorageValue<number | null>({
    key: versionKey,
  });

  if (!storedVersion) {
    writeLocalStorageValue({ key: versionKey, value: APP_CONFIG.version });
    return;
  }

  if (APP_CONFIG.version === storedVersion) {
    return;
  }

  APP_CONFIG.migrationConfig.forEach(({ key, migrations }) => {
    let data = readLocalStorageValue({ key });

    for (
      let version = storedVersion;
      migrations[version] !== undefined;
      version++
    ) {
      data = migrations[version](data);
    }

    writeLocalStorageValue({ key, value: data });
  });

  writeLocalStorageValue({ key: versionKey, value: APP_CONFIG.version });
};
