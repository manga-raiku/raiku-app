import type { WatchSource } from "vue"

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computedAsyncWithControl<T, S extends WatchSource<any>[]>(
  source: S,
  fn: (...args: MapSources<S, false>) => Promise<T> | T,
  sourceReset: WatchSource<unknown>[] | undefined = undefined
) {
  const result = ref<T>()

  let dirty = false

  watch(source, async (args) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.value = await fn(...(args as unknown as any))
  })
  if (sourceReset) watch(sourceReset, () => (result.value = undefined))

  return computed(() => {
    if (!dirty) {
      dirty = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void Promise.resolve(fn(...(source.map(toValue) as unknown as any))).then(
        (val) => (result.value = val)
      )
    }

    return result.value
  })
}
