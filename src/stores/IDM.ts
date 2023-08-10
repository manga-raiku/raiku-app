import { defineStore } from "pinia"
import type { MetaEpisode, MetaEpisodeOnDisk } from "src/logic/download-manager"

Object.assign(window, { Filesystem, Directory, Encoding })
export const useIDMStore = defineStore("IDM", () => {
  const _queue = shallowReactive<
    (MetaEpisodeOnDisk | ReturnType<typeof createTaskDownloadEpisode>)[]
  >([])

  let gettedList = false
  const queue = computed(() => {
    if (!gettedList) {
      getListEpisodes().then((list) => {
        _queue.push(...list)
        _queue.sort((a, b) => b.created_at - a.created_at)
      })
    }
    return _queue
  })

  function download(
    meta: MetaEpisode | ReturnType<typeof createTaskDownloadEpisode>
  ) {
    if ("ep_id" in meta) {
      _queue.unshift(task)
      task.start()
    } else meta.start()
  }

  return { queue, download }
})
