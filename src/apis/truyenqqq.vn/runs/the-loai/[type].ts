import { PostWorker } from "src/apis/wrap-worker"
import type { LocationQuery } from "vue-router"

import type Parse from "../../parsers/[general]"
import Worker from "../../workers/[general]?worker"

import { CURL } from "./../../const"

export default async function (
  slug: string,
  page: number,
  query: LocationQuery,
) {
  const { data, url } = await get({
    url: `${CURL}/the-loai/${slug.replace(
      ".html",
      "",
    )}/trang-${page}.html?${new URLSearchParams(
      query as Record<string, string>,
    )}`,
  })

  console.log(
    `/the-loai/${slug.replace(
      ".html",
      "",
    )}/trang-${page}.html?${new URLSearchParams(
      query as Record<string, string>,
    )}`,
  )
  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
