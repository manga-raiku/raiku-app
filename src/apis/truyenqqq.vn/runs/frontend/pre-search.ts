import { PostWorker } from "raiku-pgs"

import { CURL } from "../../const"
import type Parse from "../../parsers/pre-search"
import Worker from "../../workers/pre-search?worker"

export default async function presearch(keyword: string) {
  const { data } = await post({
    url: `${CURL}/frontend/search/search`,
    data: {
      type: "0",
      search: keyword,
    },
  })

  return PostWorker<typeof Parse>(Worker, data)
}
