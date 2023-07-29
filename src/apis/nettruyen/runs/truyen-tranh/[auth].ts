import { API_CURL } from "src/apis/nettruyen/const"

export default async function (
  comicId: number,
  // eslint-disable-next-line camelcase
  user_uid: string,
  token: string
) {
  const { data } = await get(
    // eslint-disable-next-line camelcase
    `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowedButtonComic?comicId=${comicId}&userGuid=${user_uid}&token=${token}`
  )

  const { isFollowed, readChapters, readHtml } = JSON.parse(data)

  return {
    isFollowed: isFollowed as boolean,
    readsChapter: new Set(
      readChapters?.map((item: string) => parseInt(item)) as number[]
    ),
    readContinueId: readHtml?.match(/(\d+)">Đ/)[1] as string | undefined,
  }
}
