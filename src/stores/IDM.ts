import { defineStore } from "pinia"
import type {
  MetaEpisode,
  MetaEpisodeOnDisk,
  MetaManga,
  MetaMangaOnDisk,
} from "src/logic/download-manager"

Object.assign(window, { Filesystem, Directory, Encoding })
export const useIDMStore = defineStore("IDM", () => {
  const _queue = shallowReactive<
    Map<
      MetaMangaOnDisk,
      Set<MetaEpisodeOnDisk | ReturnType<typeof createTaskDownloadEpisode>>
    >
  >(new Map())
  const listManga = shallowReactive<MetaMangaOnDisk[]>([])

  let gettedList = false
  const queue = computed(() => {
    if (!gettedList) {
      // eslint-disable-next-line promise/catch-or-return, promise/always-return
      getListManga().then((list) => {
        listManga.push(...list)
        listManga.sort((a, b) => b.start_download_at - a.start_download_at)
        listManga.forEach((item) => _queue.set(item, new Set()))
      })
      gettedList = true
    }
    return _queue
  })

  async function download(metaManga: MetaManga, metaEp: MetaEpisode) {
    const task = createTaskDownloadEpisode(metaManga, metaEp)
    const manga = await task.startSaveMetaManga()

    listManga.unshift(manga)

    const store = _queue.get(manga)
    if (store) store.add(task)
    else _queue.set(manga, new Set([task]))
  }

  return { queue, download }
})
