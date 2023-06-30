import type Parse from "../../parsers/truyen-tranh/[slug]-chap-[chap]"
import Worker from "../../workers/truyen-tranh/[slug]-chap-[chap]?worker"
import { PostWorker } from "../../wrap-worker"

export default async function (slug: string) {
  const { data } = await get(`/truyen-tranh/${slug}`)

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
