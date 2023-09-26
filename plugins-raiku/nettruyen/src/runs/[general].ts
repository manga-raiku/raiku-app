import type { API } from "raiku-pgs/plugin"

import { CURL } from "../const"
import Parse from "../parsers/[general]"

export default async function (
  { get }: Pick<API, "get">,
  path: string,
  page: number,
  query: Record<string, string | string[]>,
) {
  if (path.endsWith("/")) path = path.slice(0, -1)

  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const url = new URL(path, "http://localhost")
  url.searchParams.set("page", page + "")

  for (const key in query) {
    url.searchParams.set(key, query[key] + "")
  }

  const { data } = await get({
    url: `${CURL}/${url.pathname}?${url.searchParams + ""}`,
  })

  return Parse(data, Date.now())
}
