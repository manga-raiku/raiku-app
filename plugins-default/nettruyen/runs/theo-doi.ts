/* eslint-disable camelcase */
import type { API } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { API_CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general].ts?worker&inline"

export default async function (
  { get }: API,
  page: number,
  user_uid: string,
  token: string,
  type: string,
) {
  const { data } = await get({
    url: `${API_CURL}/Comic/Services/ComicService.asmx/GetFollowedPageComics?page=${page}&userGuid=${user_uid}&loadType=${type}&token=${token}`,
  })

  return PostWorker<typeof Parse>(
    Worker,
    decodeURIComponent(JSON.parse(data).followedListHtml),
    Date.now(),
  )
}
