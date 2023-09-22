import { PostWorker } from "raiku-pgs"

import type ParseMangaList from "../../parsers/frontend/manga-list"
import type Parse from "../../parsers/truyen-tranh/[slug]-chap-[chap]"
import WorkerMangaList from "../../workers/frontend/manga-list?worker"
import Worker from "../../workers/truyen-tranh/[slug]-chap-[chap]?worker"

import { CURL } from "./../../const"

export default async function (slug: string) {
  const { data, url } = await get({ url: `${CURL}/truyen-tranh/${slug}` })

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  const result = await PostWorker<typeof Parse>(Worker, data, Date.now())
  if (result.chapters.length === 0) {
    const { data } = await post({
      url: `${CURL}/frontend/manga/list`,
      data: {
        id: result.id,
        order: 1,
      },
    })

    result.chapters = await PostWorker<typeof ParseMangaList>(
      WorkerMangaList,
      data,
    )
  }

  return result
}
