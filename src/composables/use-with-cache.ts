export function useWithCache<T extends object>(
  fn: () => Promise<T>,
  uniKey: Ref<string>
) {
  return () => withCache(fn, uniKey)
}
