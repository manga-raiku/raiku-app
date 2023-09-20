import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker&inline"

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

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
