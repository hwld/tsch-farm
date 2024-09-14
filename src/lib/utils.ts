export const isUnorderedEqual = <T extends string | number>(
  arr1: T[],
  arr2: T[]
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();

  for (let i = 0; i < sorted1.length; i++) {
    if (sorted1[i] !== sorted2[i]) {
      return false;
    }
  }

  return true;
};

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type Expect<T extends true> = T;
