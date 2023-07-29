export function useLoadMorePage<T>(
  fn: (page: number) => Promise<{
    items: T[]
    curPage: number
    maxPage: number
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
    try {
    const { items, curPage, maxPage, } = await fn(++page)

    if (items.length === 0) return done(true)
    data.value?.items.push(...items)
    done(curPage===maxPage)
    }catch (err) {
      if (err?.status === 404)return done(true)
      throw err
    }
  }
}
