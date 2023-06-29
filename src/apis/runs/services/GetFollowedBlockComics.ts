import { PostWorker } from "src/apis/wrap-worker"
import { C_URL_SERVICE } from "src/constants"

import type Parse from "../../parsers/services/GetFollowedBlockComics"
import Worker from "../../workers/services/ComicService?worker"

export default function GetFollowedBlockComics(
  userGuid: string,
  token: string
) {
  return get({
    url:
      C_URL_SERVICE +
      `/Comic/Services/ComicService.asmx/GetFollowedBlockComics?userGuid=${userGuid}&token=${token}`,
  }).then((res) => {
    const { followedListHtml: html } = JSON.parse(res.data) as {
      followedListHtml: string
    }

    return PostWorker<typeof Parse>(Worker, html)
  })
}
