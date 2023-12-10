export function useModule<R>(module: () => R): R {
  return module()
}
