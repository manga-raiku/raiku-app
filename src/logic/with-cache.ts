import { set, get } from "idb-keyval"

export async function withCache<T>(
  fn: () => T | Promise<T>,
  { value: uniKey }: Ref<string>
): Promise<Ref<ShallowReactive<Awaited<T>>>> {
  const result = ref<ShallowReactive<T>>()

  await Promise.any([
    get(uniKey).then((json) => {
      if (!json) throw new Error("not_found")

      if (!result.value) result.value = shallowReactive(JSON.parse(json))
    }),
    fn().then((data) => {
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

  return result
}
