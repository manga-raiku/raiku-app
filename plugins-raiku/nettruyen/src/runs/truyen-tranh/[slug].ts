import type { API } from "raiku-pgs"
import { pathIsHome, PostWorker } from "raiku-pgs"

import { CURL } from "../../const"
import type Parse from "../../parsers/truyen-tranh/[slug]"
import Worker from "../../workers/truyen-tranh/[slug]?worker"

export default async function ({ get }: Pick<API, "get">, slug: string) {
  const { data, url } = await get({ url: `${CURL}/truyen-tranh/${slug}` })

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return PostWorker<typeof Parse>(Worker, data, Date.now())
}
