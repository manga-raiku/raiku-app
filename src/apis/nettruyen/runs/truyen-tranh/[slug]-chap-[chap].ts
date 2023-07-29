import { parsePath } from "src/apis/__helpers__/parsePath"
import { PostWorker } from "src/apis/wrap-worker"

import { CURL } from "../../const"
import type Parse from "../../parsers/truyen-tranh/[slug]/[ep-id]"
import Worker from "../../workers/truyen-tranh/[slug]/[ep-id]?worker"

export default async function (slug: string, fast = false) {
  const { data, url } = await get(`${CURL}/truyen-tranh/${slug}`)

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  const result = await PostWorker<typeof Parse>(Worker, data, Date.now())
  if (!fast) {
    const { data } = await get(
      `${CURL}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${result.uid}`
    )
    return {
      ...result,
      chapters: JSON.parse(data).chapters.map(
        (item: { chapterId: number; name: string; url: string }) => {
          return {
            id: item.chapterId,
            name: item.name.replace("Chapter ", ""),
            path: parsePath(item.url),
          }
        }
      ),
    }
  }

  return result
}
