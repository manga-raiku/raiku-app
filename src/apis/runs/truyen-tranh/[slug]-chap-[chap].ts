import type Parse from "../../parsers/truyen-tranh/[slug]-chap-[chap]"
import Worker from "../../workers/truyen-tranh/[slug]-chap-[chap]?worker"
import { PostWorker } from "../../wrap-worker"

export default async function (slug: string) {
  const { data, url } = await get(`/truyen-tranh/${slug}`)

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
