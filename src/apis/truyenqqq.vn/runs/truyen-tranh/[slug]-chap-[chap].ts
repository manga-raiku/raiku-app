import { PostWorker } from "src/apis/wrap-worker"

import type ParseMangaList from "../../parsers/frontend/manga-list"
import type Parse from "../../parsers/truyen-tranh/[slug]-chap-[chap]"
import WorkerMangaList from "../../workers/frontend/manga-list?worker"
import Worker from "../../workers/truyen-tranh/[slug]-chap-[chap]?worker"

export default async function (slug: string) {
  const { data, url } = await get(`/truyen-tranh/${slug}`)

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  const result = await PostWorker<typeof Parse>(Worker, data, Date.now())
  if (result.chapters.length === 0) {
    const { data } = await post("/frontend/manga/list", {
      id: result.id,
      order: 1,
    })

    result.chapters = await PostWorker<typeof ParseMangaList>(
      WorkerMangaList,
      data
    )
  }

  return result
}
