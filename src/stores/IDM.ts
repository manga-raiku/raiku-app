import { defineStore } from "pinia"
import type { ID } from "raiku-pgs/plugin"
import type {
  MetaEpisode,
  MetaManga,
  MetaMangaOnDisk,
  TaskDDEp,
  TaskDLEp
} from "src/logic/download-manager"
import type { ShallowReactive } from "vue"

export interface MetaMangaAndCountOnDisk extends MetaMangaOnDisk {
  count_ep: number
}

export const useIDMStore = defineStore("IDM", () => {
  const queue = reactive<
    Map<ID, Map<ID, ReturnType<typeof createTaskDownloadEpisode>>>
  >(new Map())
  const lsingComicOnDisk = ref(false)
  const listComicOnDisk = reactive<
    Map<ID, ShallowReactive<MetaMangaAndCountOnDisk>>
  >(new Map())

  let gettedList = false
  async function runLoadInMemory() {
    if (!gettedList) {
      lsingComicOnDisk.value = true
      // eslint-disable-next-line promise/always-return
      await getListManga().then(async (list) => {
        await Promise.all(
          list.map(async (item) => {
            const itemReactive = shallowReactive<
              MetaMangaOnDisk & {
                count_ep: number
              }
            >({
              ...item,
              count_ep: await getCountEpisodes(item.manga_id)
            })
            listComicOnDisk.set(item.manga_id, itemReactive)
          })
        )
        lsingComicOnDisk.value = false
      })
      gettedList = true
    }
  }

  async function download(
    metaManga: MetaManga,
    metaEp: MetaEpisode
  ): Promise<TaskDLEp | TaskDDEp> {
    console.log("start download: ", metaEp)
    const task = createTaskDownloadEpisode(metaManga, metaEp)

    if (!listComicOnDisk.has(metaManga.manga_id)) {
      const manga = {
        ...(await task.startSaveMetaManga()),
        count_ep: 0
      }
      listComicOnDisk.set(manga.manga_id, manga)
    }

    let store = queue.get(metaManga.manga_id)
    console.log("set store", store)
    if (store) {
      store.set(metaEp.ep_id, task)
    } else {
      queue.set(metaManga.manga_id, new Map())
      store = queue.get(metaManga.manga_id)
       
      store!.set(metaEp.ep_id, task)
    }

    const meta = await task.start()

     
    listComicOnDisk.get(metaManga.manga_id)!.count_ep++
     
    store!.delete(metaEp.ep_id)

    return meta ? { ref: meta } : task
  }

  async function resumeDownload(
    metaManga: MetaManga,
    task: Awaited<ReturnType<typeof download>>
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
    lsingComicOnDisk,
    listComicOnDisk,
    queue,
    runLoadInMemory,
    download,
    resumeDownload,
    deleteEpisode
  }
})
