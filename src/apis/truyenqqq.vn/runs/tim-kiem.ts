import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

import { CURL } from "./../const"

export default async function (query: string, page: number) {
  const { data } = await get({
    url: `${CURL}/tim-kiem/trang-${page}.html?q=${encodeURIComponent(query)}`,
  })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
