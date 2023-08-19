import { get, set } from "idb-keyval"
import type { ShallowReactive } from "vue"

export async function withCache<T extends object>(
  fn: () => Promise<T>,
  { value: uniKey }: Ref<string>,
): Promise<Ref<ShallowReactive<Awaited<T>>>> {
  const result = ref<ShallowReactive<T>>()

  await Promise.any([
    get(uniKey).then((json) => {
      // eslint-disable-next-line functional/no-throw-statement
      if (!json) throw new Error("not_found")

      // eslint-disable-next-line promise/always-return
      if (!result.value) result.value = shallowReactive(JSON.parse(json))
    }),
    fn().then((data) => {
      // eslint-disable-next-line promise/always-return
      if (
        result.value &&
        typeof result.value === "object" &&
        typeof data === "object"
      ) {
        Object.assign(result.value, data)
      } else {
        result.value = shallowReactive(data)
      }
      set(uniKey, JSON.stringify(data))
    }),
  ])

  return result as Ref<ShallowReactive<Awaited<T>>>
}
