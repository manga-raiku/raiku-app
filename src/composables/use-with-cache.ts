export function useWithCache<T>(fn: () => T | Promise<T>, uniKey: Ref<string>) {
  return () => withCache(fn, uniKey)
}
