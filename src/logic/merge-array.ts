export function mergeArray<T>(
  array1: readonly T[],
  array2?: readonly T[]
): T[] {
  const cloned = array1.slice(0)
  array2?.forEach((val, i) => (cloned[i] = val))

  return cloned
}
