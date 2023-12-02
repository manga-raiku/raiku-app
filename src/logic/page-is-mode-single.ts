export function pageIsModeSingle(
  sizes: Map<number, readonly [number, number]>,
  index: number
) {
  const size = sizes.get(index)
  if (size && pageIsSingle(...size)) return true

  const nextIndex = index % 2 === 0 ? index + 1 : index - 1
  const nextSize = sizes.get(nextIndex)
  return (nextSize && pageIsSingle(...nextSize)) || false
}
