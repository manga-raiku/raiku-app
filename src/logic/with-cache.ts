import { get, set } from "idb-keyval"
import type { ShallowReactive } from "vue"

export async function withCache<T extends object>(
  fn: () => Promise<T>,
  { value: uniKey }: Ref<string>
): Promise<ShallowReactive<Awaited<T>>> {
  let result: ShallowReactive<Awaited<T>>

  await Promise.any([
    get(uniKey).then((json: string) => {
      // eslint-disable-next-line functional/no-throw-statement
      if (!json) throw new Error("not_found")

      // eslint-disable-next-line promise/always-return
      if (!result)
        result = markFlag(shallowReactive(JSON.parse(json)), FLAG_CACHE)
    }),
    fn()
      .then((data) => {
        // eslint-disable-next-line promise/always-return
        if (result && typeof result === "object" && typeof data === "object") {
          Object.assign(result, data)
          unFlag(result, FLAG_CACHE)
        } else {
          result = shallowReactive(data as Awaited<T>)
        }
        void set(uniKey, JSON.stringify(data))
      })
      .catch((err) => {
        console.error(err)
        // eslint-disable-next-line functional/no-throw-statement
        throw err
      })
  ]).catch(({ errors }) => {
    // eslint-disable-next-line functional/no-throw-statement
    throw errors[1]
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return result
}
