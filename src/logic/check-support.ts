import { Http } from "client-ext-animevsub-helper"
import type { Package } from "raiku-pgs/plugin"

export function checkSupport(value: Package["support"]): boolean {
  if (typeof value === "boolean") return value

  if (Array.isArray(value)) {
    return value.some(checkSupport)
  }

  switch (value) {
    case "native":
      return APP_NATIVE_MOBILE
    case "extension":
      return !!Http.version
    default:
      return true
  }
}
