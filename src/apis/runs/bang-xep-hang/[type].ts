import type { LocationQuery } from "vue-router"

import type Parse from "../../parsers/[general]"
import Worker from "../../workers/[general]?worker"
import { PostWorker } from "../../wrap-worker"

export default async function (
  slug: string,
  page: number,
  query: LocationQuery
) {
  const { data, url } = await get(
    `/top-${slug.replace(
      ".html",
      ""
    )}/trang-${page}.html?${new URLSearchParams(
      query as Record<string, string>
    )}`
  )

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
