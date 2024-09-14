import {
  useLocalStorage as _useLocalStorage,
  readLocalStorageValue as _readLocalStorageValue,
} from "@mantine/hooks";
import { useIsServer } from "./use-is-server";
import { useIsAppInitialized } from "./initialize";

const localStorageSerializer = JSON.stringify;
const localStorageDeserializer = <T,>(value: string | undefined): T =>
  value && JSON.parse(value);

type Params<T> = Omit<
  Parameters<typeof _useLocalStorage<T>>[0],
  "serialize" | "deserialize"
>;

type Result<T> =
  | { status: "loading"; data: undefined }
  | { status: "success"; data: T };

type SetState<T> = ReturnType<typeof _useLocalStorage<T>>[1];

type Return<T> = [Result<T>, SetState<T>];

export const useLocalStorage = <T,>(params: Params<T>): Return<T> => {
  const isServer = useIsServer();
  const isAppInitialized = useIsAppInitialized();
  const isLoading = isServer || !isAppInitialized;

  const [state, setState] = _useLocalStorage<T>({
    ...params,
    serialize: localStorageSerializer,
    deserialize: localStorageDeserializer,
  });

  const data: Result<T> = isLoading
    ? { status: "loading", data: undefined }
    : { status: "success", data: state };

  return [data, setState];
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
