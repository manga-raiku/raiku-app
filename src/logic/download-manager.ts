/* eslint-disable camelcase */
import hashSum from "hash-sum"
import { mapLimit } from "modern-async"

interface MetaEpisode {
  readonly path: string

  readonly manga_id: number
  readonly manga_name: string
  readonly manga_image: string

  readonly ep_id: string
  readonly ep_name: string

  readonly pages: readonly string[]
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

export class DownloadManager {
  private async downloadFiles(
    sources: readonly string[],
    hash_id: string,
    onprogress: (cur: number, total: number, path: string) => void
  ): Promise<void> {
    await mapLimit(
      sources,
      async (src: string, index) => {
        const path = `files/${hash_id}/${hashSum(index)}`
        await downloadFile(src, path)

        onprogress(index, sources.length, "offline://" + path)
      },
      5
    )
  }

  public async downloadEpisode(meta: MetaEpisode) {
    const id = `${meta.manga_id}ɣ${meta.ep_id}`
    const hash_id = hashSum(id)

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
    const metaCloned: Omit<MetaEpisode, "manga_image"> & {
      manga_image: string
      downloaded: number
      pages: string[]
    } = {
      ...meta,
      downloaded: 0,
      ...metaInDisk,
      pages: mergeArray(meta.pages, metaInDisk?.pages),
    }

    let timeout: NodeJS.Timeout | number
    const saveMeta = () => {
      return new Promise<void>((resolve, reject) => {
        //delay 1s
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
    const manga_image = `poster/${hash_id}`
    await downloadFile(metaCloned.manga_image, manga_image)
    metaCloned.manga_image = manga_image
    await saveMeta()

    // save files
    await this.downloadFiles(
      meta.pages.slice(metaCloned.downloaded),
      hash_id,
      (cur, total, path) => {
        metaCloned.pages[cur] = path
        metaCloned.downloaded = cur + 1
        saveMeta()
      }
    ).catch(async (err) => {
      await saveMeta()
      throw err
    })

    await saveMeta()
  }
}
