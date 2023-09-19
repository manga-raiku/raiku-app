import type { API } from "raiku-pgs"
import { parsePath } from "raiku-pgs"
import { API_CURL } from "../../const"

export default async function (
  { get }: API,
  comicId: number,
  // eslint-disable-next-line camelcase
  user_uid: string,
  token: string,
) {
  const { data } = await get({
    // eslint-disable-next-line camelcase
    url: `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowedButtonComic?comicId=${comicId}&userGuid=${user_uid}&token=${token}`,
  })

  const { isFollowed, readChapters, readHtml, markAsReadHtml } =
    JSON.parse(data)

  const pathEpCont = readHtml?.match(/href="(.+)">Đ/)[1] as string | undefined

  return {
    isFollowed: isFollowed as boolean,
    readsChapter: new Set(
      readChapters?.map((item: string) => parseInt(item)) as number[],
    ),
    canMarkReadAll: !!markAsReadHtml,
    readContinueId: pathEpCont
      ? parseInt(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parsePath(pathEpCont).split("/").slice(-2).filter(Boolean).at(-1)!,
        )
      : undefined,
  }
}
