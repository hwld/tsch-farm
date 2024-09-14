import { writeLocalStorageValue } from "@/components/use-local-storage";
import { readLocalStorageValue } from "@mantine/hooks";
import type { AppConfig } from "./app-config";

export const migrateLocalStorage = (config: AppConfig) => {
  const versionKey = "version";

  const storedVersion = readLocalStorageValue<number | null>({
    key: versionKey,
  });

  if (!storedVersion) {
    writeLocalStorageValue({ key: versionKey, value: config.version });
    return;
  }

  if (config.version === storedVersion) {
    return;
  }

  config.migrationConfig.forEach(({ key, migrations }) => {
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

  writeLocalStorageValue({ key: versionKey, value: config.version });
};
