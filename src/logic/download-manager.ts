/* eslint-disable camelcase */
import hashSum from "hash-sum"
import { mapLimit } from "modern-async"

export interface MetaEpisode {
  readonly path: string

  readonly manga_id: number
  readonly manga_name: string
  readonly manga_image: string

  readonly ep_id: number
  readonly ep_name: string

  readonly pages: readonly string[]
}
export interface MetaEpisodeOnDisk extends MetaEpisode {
  readonly manga_image_downloaded: boolean
  readonly downloaded: number
  readonly start_download_at: number
}
export interface MetaEpisodeRunning
  extends Omit<MetaEpisodeOnDisk, "manga_image"> {
  manga_image_downloaded: boolean
  manga_image: string
  downloaded: number
  pages: string[]
}

async function downloadFile(src: string, path: string): Promise<void> {
  const buffer = await fetch(src).then((res) => res.arrayBuffer())

  await Filesystem.writeFile({
    path,
    data: uint8ToBase64(new Uint8Array(buffer)),
    directory: Directory.External,
    recursive: true,
  })
}

export async function getListEpisodes() {
  // return
  const { files } = await Filesystem.readdir({
    path: "meta",
    directory: Directory.External,
  })

  const list = (
    await Promise.all(
      files.map((item) =>
        Filesystem.readFile({
          path: `meta/${item.name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        })
          .then((res) => JSON.parse(res.data) as MetaEpisodeOnDisk)
          .catch(() => null)
      )
    )
  ).filter(Boolean) as MetaEpisodeOnDisk[]

  list.sort((a, b) => a.start_download_at - b.start_download_at)

  return list
}

async function downloadFiles(
  sources: readonly string[],
  hash_id: string,
  startIndex: number,
  onprogress: (cur: number, total: number, path: string) => void
): Promise<void> {
  await mapLimit(
    sources,
    async (src: string, index) => {
      const path = `files/${hash_id}/${hashSum(startIndex + index)}`
      await downloadFile(src, path)

      onprogress(index, sources.length, "offline://" + path)
    },
    5
  )
}

export function createTaskDownloadEpisode(meta: MetaEpisode) {
  const id = `${meta.manga_id}ɣ${meta.ep_id}`
  const hash_id = hashSum(id)

  const refValue = ref<MetaEpisodeRunning>({
    ...meta,
    pages: meta.pages as string[],
    manga_image_downloaded: false,
    downloaded: 0,
    start_download_at: Date.now(),
  })

  const start = async () => {
    // check continue this passed
    const metaInDisk = await Filesystem.readFile({
      path: `meta/${hash_id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    })
      .then(
        (res) => JSON.parse(res.data) as MetaEpisode & { downloaded: number }
      )
      .catch(() => undefined)

    // save meta
    const metaCloned = Object.assign(refValue.value, metaInDisk, {
      pages: mergeArray(meta.pages, metaInDisk?.pages),
      manga_image:
        metaInDisk?.manga_image ??
        refValue.value.manga_image ??
        meta.manga_image,
    })

    let timeout: NodeJS.Timeout | number
    const saveMeta = () => {
      return new Promise<void>((resolve, reject) => {
        // delay 1s
        clearTimeout(timeout)

        timeout = setTimeout(async () => {
          try {
            await Filesystem.writeFile({
              path: `meta/${hash_id}`,
              data: JSON.stringify(metaCloned),
              directory: Directory.External,
              encoding: Encoding.UTF8,
            })
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 1_000)
      })
    }

    // save poster
    if (!metaCloned.manga_image_downloaded) {
      const manga_image = `poster/${hash_id}`
      await downloadFile(metaCloned.manga_image, manga_image)
      metaCloned.manga_image = "offline://" + manga_image
      metaCloned.manga_image_downloaded = true
      await saveMeta()
    }

    const startIndex = metaCloned.downloaded
    // save files
    await downloadFiles(
      meta.pages.slice(startIndex),
      hash_id,
      startIndex,
      (cur, total, path) => {
        metaCloned.pages[cur + startIndex] = path
        metaCloned.downloaded = cur + startIndex + 1
        saveMeta()
      }
    ).catch(async (err) => {
      await saveMeta()
      // eslint-disable-next-line functional/no-throw-statement
      throw err
    })

    await saveMeta()
  }

  return { ref: refValue, start }
}

export async function deleteEpisode(manga_id: string, ep_id: string) {
  const id = `${manga_id}ɣ${ep_id}`
  const hash_id = hashSum(id)

  await Promise.all([
    // remove meta
    Filesystem.deleteFile({
      path: `meta/${hash_id}`,
      directory: Directory.External,
    }).catch(() => null),

    // remove poster
    Filesystem.deleteFile({
      path: `poster/${hash_id}`,
      directory: Directory.External,
    }).catch(() => null),

    // remove pages
    Filesystem.rmdir({
      path: `files/${hash_id}`,
      directory: Directory.External,
      recursive: true,
    }).catch(() => null),
  ])
}
