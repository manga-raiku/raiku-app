import type { API } from "raiku-pgs/plugin"
import { pathIsHome, PostWorker } from "raiku-pgs/plugin"

import { CURL } from "../../const"
import Parse from "../../parsers/truyen-tranh/[slug]"

export default async function ({ get }: Pick<API, "get">, slug: string) {
  const { data, url } = await get({ url: `${CURL}/truyen-tranh/${slug}` })

  // eslint-disable-next-line functional/no-throw-statement
  if (pathIsHome(url)) throw new Error("not_found")

  return Parse(data, Date.now())
}
