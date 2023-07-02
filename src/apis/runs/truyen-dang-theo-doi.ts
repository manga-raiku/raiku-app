import type Parse from "../parsers/[general]"
import Worker from "../workers/[general].ts?worker"
import { PostWorker } from "../wrap-worker"

export default async function (page: number) {
  const { data } = await get(
    `/truyen-dang-theo-doi/trang-${page}.html`
  )

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
