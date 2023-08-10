/* eslint-disable camelcase */
import hashSum from "hash-sum"
import { cleanup, readdir, readFile } from "test/vitest/utils"
import { expect } from "vitest"

import { createTaskDownloadEpisode, getListEpisodes } from "./download-manager"

global.fetch = vi.fn()
global.Date.now = vi.fn()

const path = "/manga-1/chap-1"
const manga_id = 1
const manga_name = "Manga 1"
const manga_image = "http://localhost/poster/manga-1.jpg"
const ep_id = 1234
const ep_name = "Chapter 1"
const pages = [
  "https://localhost/pages/1.png",
  "https://localhost/pages/2.png",
  "https://localhost/pages/3.png",
  "https://localhost/pages/4.png",
  "https://localhost/pages/5.png",
  "https://localhost/pages/6.png",
  "https://localhost/pages/7.png",
  "https://localhost/pages/8.png",
]

const meta = { path, manga_id, manga_name, manga_image, ep_id, ep_name, pages }

describe("download-manager", () => {
  beforeEach(cleanup)
  ;(Date.now as ReturnType<typeof vi.fn>).mockReturnValue(1690022500169)

  test("should download episode x for the first time", async () => {
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      // await sleep(500)

      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })

    const { ref, start } = createTaskDownloadEpisode(meta)
    expect(ref.value.downloaded).toBe(0)

    const watcher = vi.fn()
    watch(ref, watcher, { deep: true })

    await start()

    const hash_id = hashSum(`${manga_id}ɣ${ep_id}`)
    // check directory
    expect(await readdir("")).toEqual(["files", "meta", "poster"])
    expect(await readdir("files")).toEqual([hash_id])

    // check hash file page
    expect(await readdir(`files/${hash_id}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851",
    ])

    expect(await readdir("meta")).toEqual([hash_id])
    expect(await readdir("poster")).toEqual([hash_id])

    // valid image pages
    for (const index in pages) {
      const path = `files/${hash_id}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(await readFile("meta/" + hash_id, Encoding.UTF8))
    ).toEqual({
      path: "/manga-1/chap-1",
      manga_id: 1,
      manga_name: "Manga 1",
      ep_id: 1234,
      manga_image: "offline://poster/" + hash_id,
      manga_image_downloaded: true,
      ep_name: "Chapter 1",
      pages: pages.map(
        (_, index) => `offline://files/${hash_id}/${hashSum(index)}`
      ),
      downloaded: pages.length,
      start_download_at: 1690022500169,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
    expect(watcher.mock.calls.length).toBe(10)
  })

  test("should forcibly stopped while downloading", async () => {
    let counter = 0
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      // await sleep(500)
      if (counter++ > 5) return Promise.reject(new Error("time_out"))

      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })

    await createTaskDownloadEpisode(meta)
      .start()
      .catch(() => null)

    const hash_id = hashSum(`${manga_id}ɣ${ep_id}`)
    // check directory
    expect(await readdir("")).toEqual(["files", "meta", "poster"])
    expect(await readdir("files")).toEqual([hash_id])

    // check hash file page
    expect(await readdir(`files/${hash_id}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
    ])

    expect(await readdir("meta")).toEqual([hash_id])
    expect(await readdir("poster")).toEqual([hash_id])

    // valid image page
    for (const index in pages.slice(0, 5)) {
      const path = `files/${hash_id}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(await readFile("meta/" + hash_id, Encoding.UTF8))
    ).toEqual({
      path: "/manga-1/chap-1",
      manga_id: 1,
      manga_name: "Manga 1",
      manga_image: "offline://poster/33e5d30a",
      ep_id,
      ep_name: "Chapter 1",
      manga_image_downloaded: true,
      pages: [
        "offline://files/33e5d30a/1a96284a",
        "offline://files/33e5d30a/1a96284b",
        "offline://files/33e5d30a/1a96284c",
        "offline://files/33e5d30a/1a96284d",
        "offline://files/33e5d30a/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png",
      ],
      downloaded: 5,
      start_download_at: 1690022500169,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
  })

  test("should continue while downloading", async () => {
    let counter = 0
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      // await sleep(500)
      if (counter++ > 5) return Promise.reject(new Error("time_out"))

      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })

    await createTaskDownloadEpisode(meta)
      .start()
      .catch(() => false)

    const hash_id = hashSum(`${manga_id}ɣ${ep_id}`)
    // check directory
    expect(await readdir("")).toEqual(["files", "meta", "poster"])
    expect(await readdir("files")).toEqual([hash_id])

    // check hash file page
    expect(await readdir(`files/${hash_id}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
    ])

    expect(await readdir("meta")).toEqual([hash_id])
    expect(await readdir("poster")).toEqual([hash_id])

    // valid image page
    for (const index in pages.slice(0, 5)) {
      const path = `files/${hash_id}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(await readFile("meta/" + hash_id, Encoding.UTF8))
    ).toEqual({
      path: "/manga-1/chap-1",
      manga_id: 1,
      manga_name: "Manga 1",
      manga_image: "offline://poster/33e5d30a",
      manga_image_downloaded: true,
      ep_id,
      ep_name: "Chapter 1",
      pages: [
        "offline://files/33e5d30a/1a96284a",
        "offline://files/33e5d30a/1a96284b",
        "offline://files/33e5d30a/1a96284c",
        "offline://files/33e5d30a/1a96284d",
        "offline://files/33e5d30a/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png",
      ],
      downloaded: 5,
      start_download_at: 1690022500169,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)

    // continue download
    ;(fetch as ReturnType<typeof vi.fn>).mockReset()
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })
    ;(Date.now as ReturnType<typeof vi.fn>).mockReturnValueOnce(1690022500170)

    await createTaskDownloadEpisode(meta).start()

    // check hash file page
    expect(await readdir(`files/${hash_id}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851",
    ])

    expect(await readdir("meta")).toEqual([hash_id])
    expect(await readdir("poster")).toEqual([hash_id])

    // valid image pages
    for (const index in pages) {
      const path = `files/${hash_id}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(await readFile("meta/" + hash_id, Encoding.UTF8))
    ).toEqual({
      path: "/manga-1/chap-1",
      manga_id: 1,
      manga_name: "Manga 1",
      ep_id,
      manga_image: "offline://poster/" + hash_id,
      manga_image_downloaded: true,
      ep_name: "Chapter 1",
      pages: pages.map(
        (_, index) => `offline://files/${hash_id}/${hashSum(index)}`
      ),
      downloaded: pages.length,
      start_download_at: 1690022500169,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
  })

  test("should get list episodes downloaded", async () => {
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })

    await createTaskDownloadEpisode(meta).start()

    // ok get list

    expect(await getListEpisodes()).toEqual([
      {
        path: "/manga-1/chap-1",
        manga_id: 1,
        manga_name: "Manga 1",
        manga_image: "offline://poster/33e5d30a",
        ep_id,
        ep_name: "Chapter 1",
        pages: [
          "offline://files/33e5d30a/1a96284a",
          "offline://files/33e5d30a/1a96284b",
          "offline://files/33e5d30a/1a96284c",
          "offline://files/33e5d30a/1a96284d",
          "offline://files/33e5d30a/1a96284e",
          "offline://files/33e5d30a/1a96284f",
          "offline://files/33e5d30a/1a962850",
          "offline://files/33e5d30a/1a962851",
        ],
        manga_image_downloaded: true,
        downloaded: 8,
        start_download_at: 1690022500169,
      },
    ])

    const meta2 = {
      ...meta,
      manga_id: 2,
    }
    ;(Date.now as ReturnType<typeof vi.fn>).mockReturnValue(1690022500190)

    await createTaskDownloadEpisode(meta2).start()

    expect(await getListEpisodes()).toEqual([
      {
        path: "/manga-1/chap-1",
        manga_id: 1,
        manga_name: "Manga 1",
        manga_image: "offline://poster/33e5d30a",
        ep_id,
        ep_name: "Chapter 1",
        pages: [
          "offline://files/33e5d30a/1a96284a",
          "offline://files/33e5d30a/1a96284b",
          "offline://files/33e5d30a/1a96284c",
          "offline://files/33e5d30a/1a96284d",
          "offline://files/33e5d30a/1a96284e",
          "offline://files/33e5d30a/1a96284f",
          "offline://files/33e5d30a/1a962850",
          "offline://files/33e5d30a/1a962851",
        ],
        manga_image_downloaded: true,
        downloaded: 8,
        start_download_at: 1690022500169,
      },
      {
        path: "/manga-1/chap-1",
        manga_id: 2,
        manga_name: "Manga 1",
        manga_image: "offline://poster/359aaba9",
        ep_id,
        ep_name: "Chapter 1",
        pages: [
          "offline://files/359aaba9/1a96284a",
          "offline://files/359aaba9/1a96284b",
          "offline://files/359aaba9/1a96284c",
          "offline://files/359aaba9/1a96284d",
          "offline://files/359aaba9/1a96284e",
          "offline://files/359aaba9/1a96284f",
          "offline://files/359aaba9/1a962850",
          "offline://files/359aaba9/1a962851",
        ],
        manga_image_downloaded: true,
        downloaded: 8,
        start_download_at: 1690022500190,
      },
    ])
  })

  // test("should run multiple download episodes", async () => {})

  test("should download stop and resume", async () => {
    ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url) => {
      await sleep(500)

      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },
        async text() {
          return url
        },
      })
    })

    const { ref, downloading, start, stop, resume } =
      createTaskDownloadEpisode(meta)
    expect(downloading.value).toBe(false)
    expect(ref.value.downloaded).toBe(0)

    const watcher = vi.fn()
    watch(ref, watcher, { deep: true })

    start()
    await sleep(1_000)

    expect(downloading.value).toBe(true)
    expect(ref.value.downloaded).toBeGreaterThanOrEqual(0)

    await sleep(1_500)

    stop()

    expect(downloading.value).toBe(false)
    expect(ref.value.downloaded).toBeGreaterThanOrEqual(1)

    resume()

    expect(downloading.value).toBe(true)
    expect(ref.value.downloaded).toBeGreaterThanOrEqual(1)

    await start()

    const hash_id = hashSum(`${manga_id}ɣ${ep_id}`)
    // check directory
    expect(await readdir("")).toEqual(["files", "meta", "poster"])
    expect(await readdir("files")).toEqual([hash_id])

    // check hash file page
    expect(await readdir(`files/${hash_id}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851",
    ])

    expect(await readdir("meta")).toEqual([hash_id])
    expect(await readdir("poster")).toEqual([hash_id])

    // valid image pages
    for (const index in pages) {
      const path = `files/${hash_id}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(await readFile("meta/" + hash_id, Encoding.UTF8))
    ).toEqual({
      path: "/manga-1/chap-1",
      manga_id: 1,
      manga_name: "Manga 1",
      ep_id: "Chapter 1",
      manga_image: "offline://poster/" + hash_id,
      manga_image_downloaded: true,
      ep_name: "Chapter 1",
      pages: pages.map(
        (_, index) => `offline://files/${hash_id}/${hashSum(index)}`
      ),
      downloaded: pages.length,
      start_download_at: 1690022500190,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
    expect(watcher.mock.calls.length).toBe(10)
  })
})

export {}
