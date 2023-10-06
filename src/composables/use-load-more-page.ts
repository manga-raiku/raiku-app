export function useLoadMorePage<T>(
  fn: (page: number) => Promise<{
    items: T[] | readonly T[]
    curPage: number
    maxPage: number
  }>,
  data: Ref<
    | {
        items: T[]
      }
    | undefined
  >,
  page = 1
) {
  return async function onLoad(index: number, done: (end?: boolean) => void) {
    try {
      const { items, curPage, maxPage } = await fn(++page)

      if (items.length === 0) return done(true)
      data.value?.items.push(...items)
      done(curPage === maxPage)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any)?.status === 404) return done(true)
      // eslint-disable-next-line functional/no-throw-statement
      throw err
    }
  }
}
