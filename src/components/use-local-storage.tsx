import {
  useLocalStorage as _useLocalStorage,
  readLocalStorageValue as _readLocalStorageValue,
} from "@mantine/hooks";

export const localStorageSerializer = JSON.stringify;
export const localStorageDeserializer = <T,>(value: string | undefined): T =>
  value && JSON.parse(value);

type Params<T> = Omit<
  Parameters<typeof _useLocalStorage<T>>[0],
  "serialize" | "deserialize"
>;

export const useLocalStorage = <T,>(params: Params<T>) => {
  return _useLocalStorage<T>({
    ...params,
    serialize: localStorageSerializer,
    deserialize: localStorageDeserializer,
  });
};

type ReadLocalStorageValueParams<T> = Omit<
  Parameters<typeof _readLocalStorageValue<T>>[0],
  "serialize" | "deserialize"
>;
export const readLocalStorageValue = <T,>(
  params: ReadLocalStorageValueParams<T>
) => _readLocalStorageValue(params);

export const writeLocalStorageValue = <T,>({
  key,
  value,
}: {
  key: string;
  value: T;
}) => {
  localStorage.setItem(key, localStorageSerializer(value));
};
