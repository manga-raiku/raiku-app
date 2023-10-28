import { defineStore } from "pinia"
import type { Comic, ComicChapter, ID, RouteComic } from "raiku-pgs/plugin"
import type {
  ComicOnDisk,
  TaskDDEp,
  TaskDLEp
} from "src/logic/download-manager"
import type { ShallowReactive } from "vue"

export interface ComicAndCountOnDisk extends ComicOnDisk {
  count_ep: number
}

export const useIDMStore = defineStore("IDM", () => {
  const queue = reactive<
    Map<ID, Map<ID, ReturnType<typeof createTaskDownloadEpisode>>>
  >(new Map())
  const lsingComicOnDisk = ref(false)
  const listComicOnDisk = reactive<
    Map<ID, ShallowReactive<ComicAndCountOnDisk>>
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
              ComicOnDisk & {
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
    route: RouteComic,
    metaManga: Comic,
    metaEp: ComicChapter,
    // eslint-disable-next-line camelcase
    ep_name: string,
    // eslint-disable-next-line camelcase
    ep_param: string,
    pages: readonly string[]
  ): Promise<TaskDLEp | TaskDDEp> {
    console.log("start download: ", metaEp)
    const task = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )

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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      store!.set(metaEp.ep_id, task)
    }

    const meta = await task.start()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    listComicOnDisk.get(metaManga.manga_id)!.count_ep++

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    store!.delete(metaEp.ep_id)

    return meta ? { ref: meta } : task
  }

  async function resumeDownload(
    metaManga: Comic,
    // eslint-disable-next-line camelcase
    ep_name: string,
    // eslint-disable-next-line camelcase
    ep_param: string,
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

    return download(
      task.ref.route,
      metaManga,
      task.ref,
      ep_name,
      ep_param,
      task.ref.pages_offline
    )
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
