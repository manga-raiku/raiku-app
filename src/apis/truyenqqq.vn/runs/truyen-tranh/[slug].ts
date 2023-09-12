import { PostWorker } from "src/apis/wrap-worker"

import type Parse from "../../parsers/truyen-tranh/[slug]"
import Worker from "../../workers/truyen-tranh/[slug]?worker"

import { CURL } from "./../../const"

export default async function (slug: string) {
  const { data, url } = await get({ url: `${CURL}/truyen-tranh/${slug}` })

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
