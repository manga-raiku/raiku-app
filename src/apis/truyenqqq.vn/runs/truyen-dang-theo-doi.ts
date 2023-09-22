import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type Parse from "../parsers/[general]"
import Worker from "../workers/[general].ts?worker"

export default async function (page: number) {
  const { data } = await get({
    url: `${CURL}/truyen-dang-theo-doi/trang-${page}.html`,
  })

  const result = await PostWorker<typeof Parse>(Worker, data, Date.now())
  result.items.forEach((item) => {
    ;(item.last_chapter as unknown as any).name =
      item.last_chapter.name.replace(/Đọc tiếp\s+/i, "")
  })

  return result
}
