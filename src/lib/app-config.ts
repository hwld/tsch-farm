export type AppConfig = {
  /**
   * localStorageのデータを変更したいときにversionを1つ上げる
   */
  version: number;

  migrationConfig: {
    key: string;
    /**
     * ```
     *  {
     *    1: (data: SchemaV1): SchemaV2 => ({...data, property: false}),
     *    2: (data: SchemaV2): SchemaV3 => ({...data, property2: false})
     *  }
     * ```
     * のようなオブジェクトを渡すと、
     * - versionが1のアプリを起動すると、1、2の順で実行される
     * - versionが2のアプリを起動すると、2が実行される
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    migrations: { [Key in number]: (...args: any) => any };
  }[];
};

export const defineAppConfig = (config: AppConfig): AppConfig => {
  const allMigrationKeys = config.migrationConfig.flatMap((config) => {
    return Object.keys(config.migrations).map((key) => Number(key));
  });

  if (config.version < 1) {
    throw new Error("versionは0より大きい必要がある");
  }

  if (config.version > 1 && allMigrationKeys.length === 0) {
    throw new Error("versionが1よりも大きいときにはマイグレーションが必要");
  }

  if (
    allMigrationKeys.length > 0 &&
    allMigrationKeys.every((version) => version >= config.version)
  ) {
    throw new Error("version以上のバージョンのマイグレーションを検出");
  }

  if (allMigrationKeys.length > 0 && allMigrationKeys.some((key) => key < 1)) {
    throw new Error("マイグレーションのバージョンは0より大きい必要がある");
  }

  if (
    allMigrationKeys.length > 0 &&
    allMigrationKeys.every((key) => key !== config.version - 1)
  ) {
    throw new Error("version - 1のマイグレーションが存在しない");
  }

  return config;
};
