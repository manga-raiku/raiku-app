/* eslint-disable camelcase */
import { PostWorker } from "raiku-pgs"
import { CURL } from "src/apis/truyenqqq.vn/const"

import type Parse from "../../../parsers/comment/list"
import Worker from "../../../workers/comment/list?worker"

export default async function commentList(
  book_id: number,
  parent_id: number,
  team_id: number,
) {
  const { data } = await post({
    url: `${CURL}/frontend/comment/list`,
    data: {
      book_id,
      parent_id,
      team_id,
    },
  })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
