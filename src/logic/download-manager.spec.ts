import { DownloadManager } from "./download-manager"
import { readdir, readFile, cleanup } from "test/vitest/utils"
import { sleep } from "modern-async"
import hashSum from "hash-sum"
import { expect } from "vitest"

global.fetch = vi.fn()

const path = "/manga-1/chap-1"
const manga_id = 1
const manga_name = "Manga 1"
const manga_image = "http://localhost/poster/manga-1.jpg"
const ep_id = "Chapter 1"
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

  const idm = new DownloadManager()

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

    await idm.downloadEpisode(meta)

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
      manga_image: "poster/" + hash_id,
      ep_name: "Chapter 1",
      pages: pages.map(
        (_, index) => `offline://files/${hash_id}/${hashSum(index)}`
      ),
      downloaded: pages.length,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
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

    await idm.downloadEpisode(meta).catch(() => false)

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
      manga_image: "poster/510d1994",
      ep_id: "Chapter 1",
      ep_name: "Chapter 1",
      pages: [
        "offline://files/510d1994/1a96284a",
        "offline://files/510d1994/1a96284b",
        "offline://files/510d1994/1a96284c",
        "offline://files/510d1994/1a96284d",
        "offline://files/510d1994/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png",
      ],
      downloaded: 5,
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

    await idm.downloadEpisode(meta).catch(() => false)

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
      manga_image: "poster/510d1994",
      ep_id: "Chapter 1",
      ep_name: "Chapter 1",
      pages: [
        "offline://files/510d1994/1a96284a",
        "offline://files/510d1994/1a96284b",
        "offline://files/510d1994/1a96284c",
        "offline://files/510d1994/1a96284d",
        "offline://files/510d1994/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png",
      ],
      downloaded: 5,
    })

    // valid meta image
    expect(await readFile("poster/" + hash_id, Encoding.UTF8)).toBe(manga_image)
  })
})

export {}
