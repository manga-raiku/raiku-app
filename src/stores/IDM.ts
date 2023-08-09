import { defineStore } from "pinia"
import type { MetaEpisode, MetaEpisodeOnDisk } from "src/logic/download-manager"

export const useIDMStore = defineStore("IDM", () => {
  const queue = shallowReactive<
    (
      | MetaEpisodeOnDisk
      | ReturnType<typeof createTaskDownloadEpisode>
    )[]
  >([])

  // eslint-disable-next-line promise/catch-or-return, promise/always-return
  getListEpisodes().then((list) => {
    queue.unshift(...list)
  })

  function download(meta: MetaEpisode) {
    console.log(meta)
    queue.push(createTaskDownloadEpisode(meta))
  }

  return { queue, download }
})
