import type { QVueGlobals } from "quasar"

const map: Record<string, ($q: QVueGlobals) => boolean> = {
  "$lt.md": ($q) => $q.screen.lt.md
}

export function execScriptMeta($q: QVueGlobals, src?: string | boolean) {
  if (!src || typeof src === "boolean") return src

  return map[src]?.($q)
}
