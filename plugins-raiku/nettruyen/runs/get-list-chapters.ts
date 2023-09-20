import type { API, Chapter, ID } from "raiku-pgs"
import { normalizeChName, parsePath } from "raiku-pgs"

import { CURL } from "../const"

// eslint-disable-next-line camelcase
export default async function ({ get }: Pick<API, "get">, manga_id: ID) {
  const { data } = await get({
    // eslint-disable-next-line camelcase
    url: `${CURL}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${manga_id}`,
  })

  return JSON.parse(data).chapters.map(
    (item: { chapterId: number; name: string; url: string }): Chapter => {
      return {
        id: item.chapterId + "",
        name: normalizeChName(item.name),
        path: parsePath(item.url),
        updated_at: null,
        views: null,
      }
    },
  )
}
