import type { API, MetaManga } from "raiku-pgs"
import { PostWorker } from "raiku-pgs"

import { CURL } from "../const"
import type general from "../parsers/[general]"
import type Parse from "../parsers/index"
import WorkerGeneral from "../workers/[general]?worker"
import Worker from "../workers/index?worker"

export default async function index({ get }: Pick<API, "get">): Promise<
  Readonly<{
    sliders: MetaManga[]
    hot: MetaManga[]
    last_update: MetaManga[]
  }>
> {
  const [index, topDay] = await Promise.all([
    get({ url: CURL }).then((res) =>
      PostWorker<typeof Parse>(Worker, res.data, Date.now()),
    ),
    get({ url: `${CURL}/tim-truyen?status=-1&sort=13` }).then((res) =>
      PostWorker<typeof general>(WorkerGeneral, res.data, Date.now()),
    ),
  ])

  return {
    sliders: topDay.items.slice(0, 7),
    hot: topDay.items.slice(7),
    last_update: index.last_update,
  }
}
