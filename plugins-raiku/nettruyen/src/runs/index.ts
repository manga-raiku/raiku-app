import type { API, MetaManga } from "raiku-pgs/plugin"

import { CURL } from "../const"
import general from "../parsers/[general]"
import Parse from "../parsers/index"

export default async function index({ get }: Pick<API, "get">): Promise<
  Readonly<{
    sliders: MetaManga[]
    hot: MetaManga[]
    last_update: MetaManga[]
  }>
> {
  const [index, topDay] = await Promise.all([
    get({ url: CURL }).then((res) => Parse(res.data, Date.now())),
    get({ url: `${CURL}/tim-truyen?status=-1&sort=13` }).then((res) =>
      general(res.data, Date.now()),
    ),
  ])

  return {
    sliders: topDay.items.slice(0, 7),
    hot: topDay.items.slice(7),
    last_update: index.last_update,
  }
}
