import { beforeEach, describe, expect, it } from "vitest";
import {
  migrateLocalStorage,
  versionStorageKey,
} from "./migrate-local-storage";
import { readLocalStorageValue } from "@mantine/hooks";
import { writeLocalStorageValue } from "../components/use-local-storage";
import type { AppConfig } from "./app-config";

describe("migrateLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("一つのkey-valueに対してマイグレーションが実行される", () => {
    const storageKey = "data";
    type SchemaV1 = { id: number; title: string; questionsIds: number[] };
    type SchemaV2 = {
      id: number;
      title: string;
      questionIds: number[];
      description: string;
    };
    type SchemaV3 = {
      id: string;
      label: string;
      questionIds: { value: number }[];
      description: string;
    };

    const config: AppConfig = {
      version: 3,
      migrationConfig: [
        {
          key: storageKey,
          migrations: {
            1: (data: SchemaV1[]): SchemaV2[] => {
              return data.map(
                (d): SchemaV2 => ({
                  id: d.id,
                  title: d.title,
                  questionIds: d.questionsIds,
                  description: "",
                })
              );
            },
            2: (data: SchemaV2[]): SchemaV3[] => {
              return data.map(
                (d): SchemaV3 => ({
                  id: d.id.toString(),
                  label: d.title,
                  questionIds: d.questionIds.map((id) => ({ value: id })),
                  description: d.description,
                })
              );
            },
          },
        },
      ],
    };

    writeLocalStorageValue({ key: versionStorageKey, value: 1 });
    writeLocalStorageValue({
      key: storageKey,
      value: [
        { id: 1, title: "title1", questionsIds: [1, 2, 3] },
        { id: 2, title: "title2", questionsIds: [4, 5, 6] },
      ] satisfies SchemaV1[],
    });

    migrateLocalStorage(config);

    const data = readLocalStorageValue({ key: storageKey });
    expect(data).toEqual([
      {
        id: "1",
        label: "title1",
        questionIds: [{ value: 1 }, { value: 2 }, { value: 3 }],
        description: "",
      },
      {
        id: "2",
        label: "title2",
        questionIds: [{ value: 4 }, { value: 5 }, { value: 6 }],
        description: "",
      },
    ] satisfies SchemaV3[]);
  });

  it("2つのkey-valueに対してマイグレーションが実行される", () => {
    const keyA = "keyA";
    type ASchemaV1 = "1";
    type ASchemaV3 = "3";
    type ASchemaV5 = "5";

    const keyB = "keyB";
    type BSchemaV2 = "2";
    type BSchemaV4 = "4";
    type BSchemaV6 = "6";

    const config: AppConfig = {
      version: 5,
      migrationConfig: [
        {
          key: keyA,
          migrations: {
            1: (_: ASchemaV1): ASchemaV3 => "3",
            3: (_: ASchemaV3): ASchemaV5 => "5",
          },
        },
        {
          key: keyB,
          migrations: {
            2: (_: BSchemaV2): BSchemaV4 => "4",
            4: (_: BSchemaV4): BSchemaV6 => "6",
          },
        },
      ],
    };

    writeLocalStorageValue({ key: versionStorageKey, value: 1 });
    writeLocalStorageValue({ key: keyA, value: "1" });
    writeLocalStorageValue({ key: keyB, value: "2" });

    migrateLocalStorage(config);

    const dataA = readLocalStorageValue({ key: keyA });
    const dataB = readLocalStorageValue({ key: keyB });

    expect(dataA).toBe("5" satisfies ASchemaV5);
    expect(dataB).toBe("6" satisfies BSchemaV6);
  });
});
