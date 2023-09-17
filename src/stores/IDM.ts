import { defineStore } from "pinia"
import type {
  MetaEpisode,
  MetaManga,
  MetaMangaOnDisk,
  TaskDDEp,
  TaskDLEp,
} from "src/logic/download-manager"
import type { ShallowReactive } from "vue"

import type { ID } from "./../apis/API"

export const useIDMStore = defineStore("IDM", () => {
  const loadingDataInMemory = ref(false)

  const mapMetaManga = reactive<
    Map<
      ID,
      ShallowReactive<
        MetaMangaOnDisk & {
          count_ep: number
        }
      >
    >
  >(new Map())
  const queue = reactive<
    Map<ID, Map<ID, ReturnType<typeof createTaskDownloadEpisode>>>
  >(new Map())
  const listMangaSorted = reactive<
    (MetaMangaOnDisk & {
      count_ep: number
    })[]
  >([])

  async function runLoadInMemory() {
    let gettedList = false
    if (!gettedList) {
      loadingDataInMemory.value = true
      // eslint-disable-next-line promise/catch-or-return, promise/always-return
      getListManga().then(async (list) => {
        await Promise.all(
          list.map(async (item) => {
            const itemReactive = shallowReactive<
              MetaMangaOnDisk & {
                count_ep: number
              }
            >({
              ...item,
              count_ep: await getCountEpisodes(item.manga_id),
            })
            mapMetaManga.set(item.manga_id, itemReactive)
            if (
              listMangaSorted.findIndex(
                (item) => item.manga_id === itemReactive.manga_id,
              ) === -1
            )
              listMangaSorted.push(itemReactive)
          }),
        )
        loadingDataInMemory.value = false
      })
      gettedList = true
    }
  }

  async function download(
    metaManga: MetaManga,
    metaEp: MetaEpisode,
  ): Promise<TaskDLEp | TaskDDEp> {
    console.log("start download: ", metaEp)
    const task = createTaskDownloadEpisode(metaManga, metaEp)

    if (!mapMetaManga.has(metaManga.manga_id)) {
      const manga = {
        ...(await task.startSaveMetaManga()),
        count_ep: 0,
      }
      mapMetaManga.set(manga.manga_id, manga)
      if (
        listMangaSorted.findIndex(
          (item) => item.manga_id === manga.manga_id,
        ) === -1
      )
        listMangaSorted.unshift(manga)
    }

    let store = queue.get(metaManga.manga_id)
    console.log("set store", store)
    if (store) {
      store.set(metaEp.ep_id, task)
    } else {
      queue.set(metaManga.manga_id, new Map())
      store = queue.get(metaManga.manga_id)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      store!.set(metaEp.ep_id, task)
    }

    const meta = await task.start()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mapMetaManga.get(metaManga.manga_id)!.count_ep++
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    store!.delete(metaEp.ep_id)

    return meta ? { ref: meta } : task
  }

  async function resumeDownload(
    metaManga: MetaManga,
    task: Awaited<ReturnType<typeof download>>,
  ): ReturnType<typeof download> {
    if (
      typeof (task as Awaited<ReturnType<typeof createTaskDownloadEpisode>>)
        .resume === "function"
    ) {
      const meta = await (
        task as Awaited<ReturnType<typeof createTaskDownloadEpisode>>
      ).resume?.()

      if (meta) return { ref: meta }
      return task
    }

    return download(metaManga, task.ref)
  }

  return {
    loadingDataInMemory,
    mapMetaManga,
    listMangaSorted,
    queue,
    runLoadInMemory,
    download,
    resumeDownload,
    deleteEpisode,
  }
})
