import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

import { CURL } from "./../const"

export default async function (page: number) {
  const { data } = await get({ url: `${CURL}/lich-su/trang-${page}.html` })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
