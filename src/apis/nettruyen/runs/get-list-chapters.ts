import { CURL } from "../const"
import { parsePath } from "src/apis/__helpers__/parsePath"

export default async function (manga_id: number) {
  const { data } = await get(
    `${CURL}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${manga_id}`
  )

  return JSON.parse(data).chapters.map(
    (item: { chapterId: number; name: string; url: string }) => {
      return {
        id: item.chapterId,
        name: normalizeChName(item.name),
        path: parsePath(item.url),
        updated_at: null,
      }
    }
  )
}
