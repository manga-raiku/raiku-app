import { API_CURL } from "../../const"

export default async function Follow(comicId: number, key: string) {
  const { data } = await post(
    `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowToken`,
    new URLSearchParams({
      comicId: comicId + "",
      token: key,
    }) + "",
    {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  )
  const { data: token2 } = JSON.parse(data)

  const { data: data2 } = await post(
    `${API_CURL}/Comic/Services/ComicService.asmx/Follow`,
    new URLSearchParams({
      comicId: comicId + "",
      token: token2,
    }) + "",
    {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  )

  const { status, followedCount } = JSON.parse(data2)

  return { isFollowed: status === 1, followedCount }
}
