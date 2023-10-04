import type { Package } from "../../API"

export function definePackage(config: Package): Package {
  Object.assign(self, {
    __DEFINE_PACKAGE__: config
  })

  return config
}
