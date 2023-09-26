/* eslint-disable n/no-unsupported-features/node-builtins */
import type { API } from "raiku-pgs/plugin"

import { API_CURL } from "../../const"

export default async function Follow(
  { post }: Pick<API, "post">,
  comicId: number,
  key: string,
) {
  const { data } = await post({
    url: `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowToken`,
    data:
      new URLSearchParams({
        comicId: comicId + "",
        token: key,
      }) + "",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
  const { data: token2 } = JSON.parse(data)

  const { data: data2 } = await post({
    url: `${API_CURL}/Comic/Services/ComicService.asmx/Follow`,
    data:
      new URLSearchParams({
        comicId: comicId + "",
        token: token2,
      }) + "",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })

  const { status, followedCount } = JSON.parse(data2)

  return { isFollowed: status === 1, followedCount }
}
