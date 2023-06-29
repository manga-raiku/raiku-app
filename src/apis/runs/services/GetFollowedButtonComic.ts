import { C_URL_SERVICE } from "src/constants"

export default function GetFollowedBlockComics(
  comicId: number,
  userGuid: string,
  token: string
) {
  return get({
    url:
      C_URL_SERVICE +
      `/Comic/Services/ComicService.asmx/GetFollowedButtonComic?comicId=${comicId}userGuid=${userGuid}&token=${token}`,
  }).then((res) => {
    return JSON.parse(res.data) as {
      followHtml: string
      isFollowed: boolean
      markAsReadHtml: null
      readChapters: string[]
    }
  })
}
