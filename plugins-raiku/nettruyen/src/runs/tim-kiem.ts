import type { API } from "raiku-pgs/plugin"
import { PostWorker } from "raiku-pgs/plugin"

import { CURL } from "../const"
import Parse from "../parsers/[general]"

export default async function (
  { get }: Pick<API, "get">,
  query: string,
  page: number,
) {
  const { data } = await get({
    url: `${CURL}/tim-truyen?keyword=${encodeURIComponent(query)}&page=${page}`,
  })

  return Parse(data, Date.now())
}
