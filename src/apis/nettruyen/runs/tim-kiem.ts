import { PostWorker } from "src/apis/wrap-worker"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (query: string, page: number) {
  const { data } = await get(
    `${CURL}/tim-truyen?keyword=${encodeURIComponent(query)}&page=${page}`,
  )

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
