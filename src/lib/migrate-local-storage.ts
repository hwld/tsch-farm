import { readLocalStorageValue } from "@mantine/hooks";
import type { AppConfig } from "./app-config";
import { writeLocalStorageValue } from "../components/use-local-storage";

export const versionStorageKey = "version";

export const migrateLocalStorage = (config: AppConfig) => {
  const storedVersion = readLocalStorageValue<number | null>({
    key: versionStorageKey,
  });

  if (!storedVersion) {
    writeLocalStorageValue({ key: versionStorageKey, value: config.version });
    return;
  }

  if (config.version === storedVersion) {
    return;
  }

  config.migrationConfig.forEach(({ key, migrations }) => {
    let data = readLocalStorageValue({ key });

    for (let version = storedVersion; version < config.version; version++) {
      const migrateFn = migrations[version];
      if (!migrateFn) {
        continue;
      }
      data = migrateFn(data);
    }

    writeLocalStorageValue({ key, value: data });
  });

  writeLocalStorageValue({ key: versionStorageKey, value: config.version });
};
