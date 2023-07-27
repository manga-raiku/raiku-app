export function useLoadMorePage<T>(
  fn: (page: number) => Promise<{
    items: T[]
  }>,
  data: Ref<
    | {
        items: T[]
      }
    | undefined
  >,
  page=1
) {
  return async function onLoad(index: number, done: (end?: boolean) => void) {
    const { items } = await fn(++page)

    if (items.length === 0) return done(true)
    data.value?.items.push(...items)
    done()
  }
}
