import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"
import type { LocationQuery } from "vue-router"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (
  { get }: API,
  path: string,
  page: number,
  query: LocationQuery | Record<string, string | number>,
) {
  if (path.endsWith("/")) path = path.slice(0, -1)

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
