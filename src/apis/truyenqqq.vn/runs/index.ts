import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/index"
import Worker from "../workers/index?worker&inline"

export default async function index() {
  const { data } = await get({
    url: CURL,
  })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
