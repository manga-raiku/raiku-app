import { PostWorker } from "src/apis/wrap-worker"

import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (page: number) {
  const { data } = await get(`/lich-su/trang-${page}.html`)

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
