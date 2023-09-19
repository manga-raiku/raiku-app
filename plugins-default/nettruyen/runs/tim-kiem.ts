import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker&inline"

export default async function ({ get }: API, query: string, page: number) {
  const { data } = await get({
    url: `${CURL}/tim-truyen?keyword=${encodeURIComponent(query)}&page=${page}`,
  })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
