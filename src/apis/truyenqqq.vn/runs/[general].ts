import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (path: string, page: number) {
  const { data } = await get({ url: `${CURL}/${path}/trang-${page}.html` })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
