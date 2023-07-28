import type Parse from "../../parsers/pre-search"
import Worker from "../../workers/pre-search?worker"
import { PostWorker } from "../../wrap-worker"

export default async function presearch(keyword: string) {
  const { data } = await post("/frontend/search/search", {
    type: "0",
    search: keyword,
  })

  return PostWorker<typeof Parse>(Worker, data)
}
