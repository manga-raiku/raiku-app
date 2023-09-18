import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/pre-search"
import Worker from "../workers/pre-search?worker"

export default async function presearch(
  { get }: API,
  keyword: string,
  page: number,
) {
  const { data } = await get({
    url: `${CURL}/Comic/Services/SuggestSearch.ashx?q=${encodeURIComponent(
      keyword,
    )}&page=${page}`,
  })

  return PostWorker<typeof Parse>(Worker, data)
}
