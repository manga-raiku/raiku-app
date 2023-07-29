export function mergeArray(
  array1: readonly string[],
  array2?: readonly string[]
): string[] {
  const cloned = array1.slice(0)
  array2?.forEach((val, i) => (cloned[i] = val))

  return cloned
}
