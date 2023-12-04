import type { API } from "../../API"
export function defineApi<AutoFetchComicIsManga extends boolean = false>(
  config: typeof API<AutoFetchComicIsManga>
): typeof API<AutoFetchComicIsManga> {
  Object.assign(self, {
    __DEFINE_API__: config
  })
  return config
}
