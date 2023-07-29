import { PostWorker } from "src/apis/wrap-worker"
import type { LocationQuery } from "vue-router"

import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (
  path: string,
  page: number,
  query: LocationQuery
) {
  const url = new URL(path, "http://localhost")
  url.searchParams.set("page", page + "")
  for (const key in query) {
    url.searchParams.set(key, query[key] + "")
  }

  const { data } = await get(`/${url.pathname}?${url.searchParams + ""}`)

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
