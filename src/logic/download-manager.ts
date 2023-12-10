/* eslint-disable camelcase */
/* eslint-disable functional/no-throw-statement */
import hashSum from "hash-sum"
import type { Chapter, Comic, ComicChapter, RouteComic } from "raiku-pgs/plugin"
/*
.
├── meta/
│   ├── [hash_id_manga]/
│   │   └── [hash_id_ep].mod
│   └── [hash_id_manga].mod
├── files/
│   └── [hash_id_manga]
│       └── [hash_id_ep]
└── poster/
    └── [hash_id_manga]
*/

const DIR_META = "meta"
const DIR_POSTER = "poster"
const DIR_FILES = "files"

export interface ComicOnDisk extends Comic {
  readonly route: RouteComic
  readonly start_download_at: number
}
export interface ComicChapterOnDisk extends ComicChapter {
  readonly chapters: Chapter[]
  readonly route: RouteComic
  readonly ep_name: string
  readonly ep_param: string
  readonly downloaded: number
  readonly start_download_at: number
  readonly pages_offline: readonly string[]
}
export interface ComicChapterRunning extends ComicChapterOnDisk {
  downloaded: number
  readonly pages_offline: string[]
}

async function downloadFile(
  src: string,
  path: string,
  downloading: Ref<boolean>,
  retry: number
): Promise<void> {
  let buffer: ArrayBuffer

  const hashIndex = src.indexOf(HASH_TAG)
  if (hashIndex > -1) {
    let headers: Record<string, string> | undefined

    try {
      headers = JSON.parse(src.slice(hashIndex + HASH_TAG.length))
    } catch {}

    // request now
    buffer = await get({
      url: (src.startsWith("//") ? "https:" : "") + src.slice(0, hashIndex),
      headers,
      responseType: "arraybuffer"
    }).then((res) => base64ToUint8(res.data))
  } else {
    buffer = await await fetchRetry(fetch, [src], {
      retries: retry,
      retryDelay: 300
    }).then((res) => res.arrayBuffer())
  }

  if (!downloading.value) throw new Error("user_paused")
  await Filesystem.writeFile({
    path,
    data: uint8ToBase64(new Uint8Array(buffer)),
    directory: Directory.External,
    recursive: true
  })
}

async function downloadFiles(
  sources: readonly string[],
  hashIDManga: string,
  hashIDEp: string,
  downloading: Ref<boolean>,
  onprogress: (cur: number, total: number, path: string) => void
): Promise<void> {
  await someLimit(
    sources,
    async (src: string, index: number) => {
      if (src.startsWith(PROTOCOL_OFFLINE)) return false

      if (!downloading.value) {
        throw new Error("user_paused")
      }
      const path = `${DIR_FILES}/${hashIDManga}/${hashIDEp}/${hashSum(index)}`
      await downloadFile(src, path, downloading, 5)

      onprogress(index, sources.length, PROTOCOL_OFFLINE + path)

      return false
    },
    5
  )
}

async function saveMetaManga(
  route: RouteComic,
  metaManga: Comic
): Promise<ComicOnDisk> {
  const hash_id = hashSum(route.params.comic)

  const path = `${DIR_META}/${hash_id}.mod`

  // check
  try {
    const val = JSON.parse(
      await Filesystem.readFile({
        path,
        directory: Directory.External,
        encoding: Encoding.UTF8
      }).then((res) => res.data)
    )

    if (val) return val as ComicOnDisk
  } catch {}

  const pathPoster = `${DIR_POSTER}/${hash_id}`
  await downloadFile(
    metaManga.image,
    pathPoster,
    {
      value: true
    } as Ref<boolean>,
    5
  )

  const metaOnDisk: ComicOnDisk = {
    ...metaManga,
    route,
    image: `${PROTOCOL_OFFLINE}/${pathPoster}`,
    start_download_at: Date.now()
  }
  await Filesystem.writeFile({
    path,
    directory: Directory.External,
    encoding: Encoding.UTF8,
    data: JSON.stringify(metaOnDisk)
  })

  return metaOnDisk
}

export function createTaskDownloadEpisode(
  route: RouteComic,
  metaManga: Comic,
  metaEp: ComicChapter & {
    readonly chapters: Chapter[]
  },
  ep_name: string,
  ep_param: string,
  pages: readonly string[]
): {
  ref: ComicChapterRunning
  startSaveMetaManga: () => Promise<ComicOnDisk>
  downloading: globalThis.Ref<boolean>
  start: () => Promise<ComicChapterOnDisk | undefined>
  stop: () => Promise<ComicChapterOnDisk | undefined>
  resume: () => Promise<ComicChapterOnDisk | undefined>
} {
  const hashIDManga = hashSum(route.params.comic)
  const hashIDEp = hashSum(ep_param)

  const downloading = ref(false)
  const refValue = reactive<ComicChapterRunning>({
    start_download_at: Date.now(),
    downloaded: 0,
    ...metaEp,
    route,
    pages_offline: pages.slice(0),
    ep_name,
    ep_param
  })

  const startSaveMetaManga = () => saveMetaManga(route, metaManga)

  let timeout: NodeJS.Timeout | number
  let taskSaveMeta: Promise<ComicChapterOnDisk> | undefined
  const saveMeta = (metaCloned: ComicChapterOnDisk) => {
    taskSaveMeta = new Promise<ComicChapterOnDisk>((resolve, reject) => {
      // delay 1s
      clearTimeout(timeout)

      timeout = setTimeout(async () => {
        try {
          await Filesystem.writeFile({
            path: `${DIR_META}/${hashIDManga}/${hashIDEp}.mod`,
            data: JSON.stringify(metaCloned),
            directory: Directory.External,
            encoding: Encoding.UTF8
          })
          resolve(metaCloned)
        } catch (err) {
          reject(err)
        }
      }, 1_000)
    })
    return taskSaveMeta
  }

  const start = async () => {
    if (downloading.value) {
      console.warn("task is running")
      return
    }

    downloading.value = true
    const hashIDManga = hashSum((await startSaveMetaManga()).route.params.comic)

    // check continue this passed
    const metaInDisk = await Filesystem.readFile({
      path: `${DIR_META}/${hashIDManga}/${hashIDEp}.mod`,
      directory: Directory.External,
      encoding: Encoding.UTF8
    })
      .then(
        (res) =>
          JSON.parse(res.data) as ComicChapterOnDisk & {
            downloaded: number
          }
      )
      .catch(() => undefined)

    // save meta
    Object.assign(refValue, metaInDisk)

    if (!downloading.value) return

    // save files
    await downloadFiles(
      refValue.pages_offline,
      hashIDManga,
      hashIDEp,
      downloading,
      (cur, total, path) => {
        refValue.pages_offline[cur] = path
        refValue.downloaded++
        void saveMeta(refValue)
      }
    ).catch(async (err) => {
      await saveMeta(refValue)
      downloading.value = false
      throw err
    })

    const meta = await saveMeta(refValue)
    downloading.value = false
    return meta
  }
  const stop = async () => {
    downloading.value = false
    return taskSaveMeta
  }
  const resume = start

  return { ref: refValue, startSaveMetaManga, downloading, start, stop, resume }
}

export async function getListManga() {
  try {
    // return
    const { files } = await Filesystem.readdir({
      path: DIR_META,
      directory: Directory.External
    })

    const list = (
      await Promise.all(
        // eslint-disable-next-line array-callback-return
        files.map((item) => {
          if (item.type === "file")
            return Filesystem.readFile({
              path: `${DIR_META}/${item.name}`,
              directory: Directory.External,
              encoding: Encoding.UTF8
            }).then((res) => JSON.parse(res.data) as ComicOnDisk)
          // .catch(() => null)
        })
      )
    ).filter(Boolean) as ComicOnDisk[]

    list.sort((a, b) => a.start_download_at - b.start_download_at)

    return list
  } catch (err) {
    if ((err as Error | undefined)?.message === "Folder does not exist.")
      return []

    throw err
  }
}

export async function getCountEpisodes(comic: string) {
  const hashIDManga = hashSum(comic)

  try {
    const { files } = await Filesystem.readdir({
      path: `${DIR_META}/${hashIDManga}`,
      directory: Directory.External
    })

    return files.length
  } catch (err) {
    if ((err as Error | undefined)?.message === "Folder does not exist.")
      return 0

    throw err
  }
}

export async function getListEpisodes(comic: string) {
  const hashIDManga = hashSum(comic)

  const { files } = await Filesystem.readdir({
    path: `${DIR_META}/${hashIDManga}`,
    directory: Directory.External
  })

  return Promise.all(
    files.map(
      (item) =>
        item.type === "file" &&
        Filesystem.readFile({
          path: `${DIR_META}/${hashIDManga}/${item.name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8
        }).then((res) => JSON.parse(res.data) as ComicChapterOnDisk)
    )
  ).then((list) => list.filter(Boolean) as ComicChapterOnDisk[])
}

export async function deleteManga(comic: string) {
  const hashIDManga = hashSum(comic)

  await Promise.all([
    // remove meta episodes
    Filesystem.rmdir({
      path: `${DIR_META}/${hashIDManga}`,
      directory: Directory.External,
      recursive: true
    }).catch(() => null),

    // remove meta manga
    Filesystem.deleteFile({
      path: `${DIR_META}/${hashIDManga}.mod`,
      directory: Directory.External
    }).catch(() => null),

    // remove poster
    Filesystem.deleteFile({
      path: `${DIR_POSTER}/${hashIDManga}`,
      directory: Directory.External
    }).catch(() => null),

    // remove pages of manga
    Filesystem.rmdir({
      path: `${DIR_FILES}/${hashIDManga}`,
      directory: Directory.External,
      recursive: true
    }).catch(() => null)
  ])
}

export async function deleteEpisode(comic: string, ep_param: string) {
  const hashIDManga = hashSum(comic)
  const hashIDEp = hashSum(ep_param)

  await Promise.all([
    // remove meta
    Filesystem.deleteFile({
      path: `${DIR_META}/${hashIDManga}/${hashIDEp}.mod`,
      directory: Directory.External
    })
      .then(async () => {
        // check removed all episode
        const { files } = await Filesystem.readdir({
          path: `${DIR_META}/${hashIDManga}`,
          directory: Directory.External
        })

        if (files.length === 0) {
          // remove poster and meta manga
          await Promise.all([
            // remove poster
            Filesystem.deleteFile({
              path: `${DIR_POSTER}/${hashIDManga}`,
              directory: Directory.External
              // eslint-disable-next-line promise/no-nesting
            }).catch(() => null),
            // remove meta manga
            Filesystem.deleteFile({
              path: `${DIR_META}/${hashIDManga}.mod`,
              directory: Directory.External
              // eslint-disable-next-line promise/no-nesting
            }).catch(() => null)
          ])
        }

        // eslint-disable-next-line no-useless-return
        return
      })
      .catch(() => null),

    // remove pages
    Filesystem.rmdir({
      path: `${DIR_FILES}/${hashIDManga}/${hashIDEp}`,
      directory: Directory.External,
      recursive: true
    })
      .then(async () => {
        // check removed all episode
        const { files } = await Filesystem.readdir({
          path: `${DIR_FILES}/${hashIDManga}`,
          directory: Directory.External
        })

        if (files.length === 0) {
          await Filesystem.rmdir({
            path: `${DIR_FILES}/${hashIDManga}`,
            directory: Directory.External,
            recursive: true
          })
        }

        // eslint-disable-next-line no-useless-return
        return
      })
      .catch(() => null)
  ])
}

export async function getComic(comic: string) {
  const hashIDManga = hashSum(comic)

  return JSON.parse(
    await Filesystem.readFile({
      path: `${DIR_META}/${hashIDManga}.mod`,
      directory: Directory.External,
      encoding: Encoding.UTF8
    }).then((res) => res.data)
  ) as ComicOnDisk
}

export async function getEpisode(comic: string, ep_param: string) {
  const hashIDManga = hashSum(comic)
  const hashIDEp = hashSum(ep_param)

  return JSON.parse(
    await Filesystem.readFile({
      path: `${DIR_META}/${hashIDManga}/${hashIDEp}.mod`,
      directory: Directory.External,
      encoding: Encoding.UTF8
    }).then((res) => res.data)
  ) as ComicChapterOnDisk
}

// eslint-disable-next-line functional/no-mixed-type
export interface TaskDDEp {
  ref: ComicChapterOnDisk
  downloading?: boolean
  stop?: () => void
}
export type TaskDLEp = Pick<
  ReturnType<typeof createTaskDownloadEpisode>,
  "ref" | "downloading" | "stop" | "resume"
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTaskDLEp(value: any): value is TaskDLEp {
  return typeof value?.resume === "function"
}
