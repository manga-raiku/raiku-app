import type { API } from "../../API"
export function defineApi(config: typeof API): typeof API {
  Object.assign(self, {
    __DEFINE_API__: config
  })
  return config
}
