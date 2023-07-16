/* eslint-disable camelcase */
import type Parse from "../../../parsers/comment/list"
import Worker from "../../../workers/comment/list?worker"
import { PostWorker } from "../../../wrap-worker"

export default async function commentList(
  book_id: number,
  parent_id: number,
  team_id: number
) {
  const { data } = await post("/frontend/comment/list", {
    book_id,
    parent_id,
    team_id,
  })

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
