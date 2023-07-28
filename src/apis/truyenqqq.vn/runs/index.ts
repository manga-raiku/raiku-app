import type Parse from "../parsers/index"
import Worker from "../workers/index?worker"
import { PostWorker } from "../wrap-worker"
export default async function index() {
  const { data } = await get("/")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
