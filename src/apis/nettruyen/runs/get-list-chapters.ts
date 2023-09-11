import { parsePath } from "src/apis/__helpers__/parsePath"
import { normalizeChName } from "src/logic/normalize-ch-name"

import { CURL } from "../const"

// eslint-disable-next-line camelcase
export default async function (manga_id: number) {
  const { data } = await get(
    // eslint-disable-next-line camelcase
    `${CURL}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${manga_id}`,
  )

  return JSON.parse(data).chapters.map(
    (item: { chapterId: number; name: string; url: string }) => {
      return {
        id: item.chapterId,
        name: normalizeChName(item.name),
        path: parsePath(item.url),
        updated_at: null,
      }
    },
  )
}
