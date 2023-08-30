import { get, set } from "idb-keyval"
import type { ShallowReactive } from "vue"

export async function withCache<T extends object>(
  fn: () => Promise<T>,
  { value: uniKey }: Ref<string>,
): Promise<ShallowReactive<Awaited<T>>> {
  let result: ShallowReactive<Awaited<T>>

  await Promise.race([
    get(uniKey).then((json) => {
      // eslint-disable-next-line functional/no-throw-statement
      if (!json) throw new Error("not_found")

      // eslint-disable-next-line promise/always-return
      if (!result) result = shallowReactive(JSON.parse(json))
    }),
    fn().then((data) => {
      // eslint-disable-next-line promise/always-return
      if (result && typeof result === "object" && typeof data === "object") {
        Object.assign(result, data)
      } else {
        result = shallowReactive(data as Awaited<T>)
      }
      set(uniKey, JSON.stringify(data))
    }),
  ])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result!
}
