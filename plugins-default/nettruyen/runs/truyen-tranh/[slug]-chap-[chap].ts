import type { API, Chapter, ComicChapter } from "raiku-pgs"
import { parsePath, PostWorker } from "raiku-pgs"
import { normalizeChName } from "raiku-pgs"

import { CURL } from "../../const"
import type Parse from "../../parsers/truyen-tranh/[slug]/[ep-id]"
import Worker from "../../workers/truyen-tranh/[slug]-chap-[chap]?worker&inline"

export default async function <Fast extends boolean>(
  { get }: API,
  slug: string,
  fast: Fast,
): Promise<
  Fast extends true
    ? ComicChapter
    : ComicChapter & {
        readonly chapters: Chapter[]
      }
> {
  const { data, url } = await get({ url: `${CURL}/truyen-tranh/${slug}` })

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  const result = await PostWorker<typeof Parse>(Worker, data, Date.now())
  if (!fast) {
    const { data } = await get({
      url: `${CURL}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${result.manga_id}`,
    })
    return {
      ...result,
      chapters: JSON.parse(data).chapters.map(
        (item: { chapterId: number; name: string; url: string }) => {
          return {
            id: item.chapterId,
            name: normalizeChName(item.name),
            path: parsePath(item.url),
            updated_at: null,
          }
        },
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result as any
}
