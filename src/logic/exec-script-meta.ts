import type { QVueGlobals } from "quasar"

const map: Record<string, ($q: QVueGlobals) => boolean> = {
  "$lt.md or isNative": ($q) =>
    $q.screen.lt.md || import.meta.env.MODE === "capacitor",
  isNative: () => import.meta.env.MODE === "capacitor",
  "isNative or ($lt.md and isPWA)": ($q) =>
    import.meta.env.MODE === "capacitor" ||
    ($q.screen.lt.md && import.meta.env.MODE === "pwa"),
  "$lt.md": ($q) => $q.screen.lt.md
}

export function execScriptMeta($q: QVueGlobals, src?: string | boolean) {
  if (!src || typeof src === "boolean") return src

  return map[src]?.($q)
}
