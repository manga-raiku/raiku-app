/* eslint-disable camelcase */
import { PostWorker } from "src/apis/wrap-worker"

import { API_CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general].ts?worker"

export default async function (
  page: number,
  user_uid: string,
  token: string,
  type: string
) {
  const { data } = await get(
    `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowedPageComics?page=${page}&userGuid=${user_uid}&loadType=${
     type
    }&token=${token}`
  )

  return PostWorker<typeof Parse>(
    Worker,
    decodeURIComponent(JSON.parse(data).followedListHtml),
    Date.now()
  )
}
