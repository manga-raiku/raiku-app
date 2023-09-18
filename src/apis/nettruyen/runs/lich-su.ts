import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { API_CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general]?worker"

export default async function ({ get }: API, page: number, token: string) {
  const { data } = await get({
    url: `${API_CURL}/Comic/Services/ComicService.asmx/GetReadComics?token=${token}&page=${page}`,
  })

  return PostWorker<typeof Parse>(
    Worker,
    decodeURIComponent(JSON.parse(data).listHtml),
    Date.now(),
  )
}
