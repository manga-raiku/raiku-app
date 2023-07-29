import { PostWorker } from "src/apis/wrap-worker"

import { API_CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function (page: number, token: string) {
  const { data } = await get(
    `${API_CURL}/Comic/Services/ComicService.asmx/GetReadComics?token=${token}&page=${page}`
  )

  return PostWorker<typeof Parse>(
    Worker,
    decodeURIComponent(JSON.parse(data).listHtml),
    Date.now()
  )
}
