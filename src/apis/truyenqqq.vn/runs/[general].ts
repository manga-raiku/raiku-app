import { CURL } from "../const"
import Parse from "../parsers/[general]"

export default async function (path: string, page: number) {
  const { data } = await get({ url: `${CURL}/${path}/trang-${page}.html` })

  return Parse(data, Date.now())
}
