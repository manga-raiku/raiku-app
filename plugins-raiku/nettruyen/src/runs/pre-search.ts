import type { API } from "raiku-pgs/plugin"
import { PostWorker } from "raiku-pgs/plugin"

import { CURL } from "../const"
import Parse from "../parsers/pre-search"

export default async function presearch(
  { get }: Pick<API, "get">,
  keyword: string,
  page: number,
) {
  const { data } = await get({
    url: `${CURL}/Comic/Services/SuggestSearch.ashx?q=${encodeURIComponent(
      keyword,
    )}&page=${page}`,
  })

  return Parse(data)
}
