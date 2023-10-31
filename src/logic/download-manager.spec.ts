/* eslint-disable camelcase */
import hashSum from "hash-sum"
import type { Chapter, Comic, ComicChapter, RouteComic } from "raiku-pgs/plugin"
import { cleanup, exists, readdir, readFile } from "test/vitest/utils"
import { expect, vi } from "vitest"
import createFetchMock from "vitest-fetch-mock"

import { createTaskDownloadEpisode, getListManga } from "./download-manager"

const fetchMocker = createFetchMock(vi)

Object.assign(global, { fetch: fetchMocker })
global.Date.now = vi.fn()

const manga_id = "1"
const manga_name = "Hôn Nhân Hạnh Phúc Của Tôi"
const manga_image = "http://localhost/poster/manga-1.jpg"
const source_id = "nettruyen"
const ep_id = "1234"
const ep_name = "Chapter 1"
const ep_param = "chap-1-i1234"
const pages = [
  "https://localhost/pages/1.png",
  "https://localhost/pages/2.png",
  "https://localhost/pages/3.png",
  "https://localhost/pages/4.png",
  "https://localhost/pages/5.png",
  "https://localhost/pages/6.png",
  "https://localhost/pages/7.png",
  "https://localhost/pages/8.png"
]

const route: RouteComic = {
  name: "comic",
  params: {
    sourceId: source_id,
    comic: "manga-1"
  }
}
const metaManga: Comic = {
  name: manga_name,
  othername: "",
  manga_id,
  updated_at: 1682580180000,
  likes: null,
  image: manga_image,
  author: [
    {
      name: "Agoki Akumi",
      route: {
        name: "author",
        params: { sourceId: "nettruyen", type: "" },
        query: { "tac-gia": "Agoki Akumi" }
      }
    }
  ],
  status: "Đang tiến hành",
  genres: [],
  views: 1626445,
  rate: { cur: 4.4, max: 5, count: 2032 },
  follows: 14821,
  description: "",
  chapters: [
    {
      id: "776047",
      route: {
        name: "comic chap",
        params: {
          sourceId: "nettruyen",
          comic: "hon-nhan-hanh-phuc-cua-toi",
          chap: "20-2-i776047"
        }
      },
      name: "20",
      updated_at: 1634169600000,
      views: 62085
    }
  ],
  comments: [],
  comments_count: 1,
  comments_pages: 1
}
const metaEp: ComicChapter & {
  chapters: Chapter[]
} = {
  name: manga_id,
  image: manga_image,
  manga_id,
  path_manga: {
    name: "comic",
    params: {
      comic: "hon-nhan-hanh-phuc-cua-toi-25737",
      sourceId: "nettruyen"
    }
  },
  ep_id,
  updated_at: 1634183940000,
  pages: pages.map((src) => ({ src })),
  cdn: "//cdn.ntcdntempv26.com",
  cdn2: "//cdn.ntcdntempv3.com",
  chapters: <Chapter[]>[],
  comments: [],
  comments_count: 29,
  comments_pages: 1
}

const hashIDManga = hashSum(route.params.comic)
const hashIDEp = hashSum(ep_param)

function patchFetch() {
  // continue download
  ;(fetch as ReturnType<typeof vi.fn>).mockReset()
  ;(fetch as ReturnType<typeof vi.fn>).mockImplementation(
    async (url: string) => {
      await sleep(100)
      return Promise.resolve({
        async arrayBuffer() {
          return new TextEncoder().encode(url)
        },

        async text() {
          return url
        }
      })
    }
  )
}
;(Date.now as ReturnType<typeof vi.fn>).mockReturnValue(0)
fetchMocker.enableMocks()

describe("download-manager", () => {
  beforeEach(async () => {
    await cleanup()
    await sleep(1000)
  })

  test("should download episode x for the first time", async () => {
    fetchMocker.mockResponse(({ url }) => url)

    const { ref, start, downloading } = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )
    expect(ref.downloaded).toBe(0)
    expect(downloading.value).toBeFalsy()

    const watcher = vi.fn()
    watch(ref, watcher, { deep: true })

    await start()

    // check directory
    await expect(readdir("")).resolves.toEqual(["files", "meta", "poster"])

    await expect(readdir("files")).resolves.toEqual([hashIDManga])
    await expect(readdir("files/" + hashIDManga)).resolves.toEqual([hashIDEp])

    await expect(readdir("meta")).resolves.toEqual([
      hashIDManga,
      hashIDManga + ".mod"
    ])
    await expect(readdir("meta/" + hashIDManga)).resolves.toEqual([
      hashIDEp + ".mod"
    ])

    await expect(readdir("poster")).resolves.toEqual([hashIDManga])

    expect(await readdir(`files/${hashIDManga}/${hashIDEp}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851"
    ])

    // valid image pages

    for (const index in pages) {
      const path = `files/${hashIDManga}/${hashIDEp}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta manga
    expect(
      JSON.parse(await readFile(`meta/${hashIDManga}.mod`, Encoding.UTF8))
    ).toEqual({
      ...metaManga,
      route,
      image: "offline:///poster/4523dfa2",
      start_download_at: 0
    })

    // valid meta episode
    expect(
      JSON.parse(
        await readFile(`meta/${hashIDManga}/${hashIDEp}.mod`, Encoding.UTF8)
      )
    ).toEqual({
      ...metaEp,
      ep_name,
      ep_param,
      route,
      start_download_at: 0,
      downloaded: 8,
      pages_offline: [
        "offline://files/4523dfa2/62c5450c/1a96284a",
        "offline://files/4523dfa2/62c5450c/1a96284b",
        "offline://files/4523dfa2/62c5450c/1a96284c",
        "offline://files/4523dfa2/62c5450c/1a96284d",
        "offline://files/4523dfa2/62c5450c/1a96284e",
        "offline://files/4523dfa2/62c5450c/1a96284f",
        "offline://files/4523dfa2/62c5450c/1a962850",
        "offline://files/4523dfa2/62c5450c/1a962851"
      ]
    })

    // valid meta image
    expect(await readFile("poster/" + hashIDManga, Encoding.UTF8)).toBe(
      manga_image
    )
    expect(watcher.mock.calls.length).toBe(8)
  })

  test("should forcibly stopped while downloading", async () => {
    let counter = 0
    fetchMocker.mockResponse(async ({ url }) => {
      // await sleep(500)
      if (counter++ > 5) return Promise.reject(new Error("time_out"))

      return url
    })

    const { ref, start, downloading } = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )
    expect(ref.downloaded).toBe(0)
    expect(downloading.value).toBeFalsy()

    await start().catch(() => null)

    // check hash file page
    expect(await readdir(`files/${hashIDManga}/${hashIDEp}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e"
    ])

    // valid image page

    for (const index in pages.slice(0, 5)) {
      const path = `files/${hashIDManga}/${hashIDEp}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(
        await readFile(
          "meta/" + hashIDManga + "/" + hashIDEp + ".mod",
          Encoding.UTF8
        )
      )
    ).toEqual({
      ...metaEp,
      ep_name,
      ep_param,
      route,
      start_download_at: 0,
      downloaded: 5,
      pages_offline: [
        "offline://files/4523dfa2/62c5450c/1a96284a",
        "offline://files/4523dfa2/62c5450c/1a96284b",
        "offline://files/4523dfa2/62c5450c/1a96284c",
        "offline://files/4523dfa2/62c5450c/1a96284d",
        "offline://files/4523dfa2/62c5450c/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png"
      ]
    })
  })

  test("should continue while downloading", async () => {
    let counter = 0
    fetchMocker.mockResponse(async ({ url }) => {
      // await sleep(500)
      if (counter++ > 5) return Promise.reject(new Error("time_out"))

      return url
    })

    const { ref, start, downloading } = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )
    expect(ref.downloaded).toBe(0)
    expect(downloading.value).toBeFalsy()

    await start().catch(() => null)
    patchFetch()

    // check hash file page
    expect(await readdir(`files/${hashIDManga}/${hashIDEp}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e"
    ])

    // valid image page

    for (const index in pages.slice(0, 5)) {
      const path = `files/${hashIDManga}/${hashIDEp}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(
        await readFile(
          "meta/" + hashIDManga + "/" + hashIDEp + ".mod",
          Encoding.UTF8
        )
      )
    ).toEqual({
      ...metaEp,
      ep_name,
      ep_param,
      route,
      start_download_at: 0,
      downloaded: 5,
      pages_offline: [
        "offline://files/4523dfa2/62c5450c/1a96284a",
        "offline://files/4523dfa2/62c5450c/1a96284b",
        "offline://files/4523dfa2/62c5450c/1a96284c",
        "offline://files/4523dfa2/62c5450c/1a96284d",
        "offline://files/4523dfa2/62c5450c/1a96284e",
        "https://localhost/pages/6.png",
        "https://localhost/pages/7.png",
        "https://localhost/pages/8.png"
      ]
    })

    const {
      ref: ref2,
      start: start2,
      downloading: dl2
    } = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )
    expect(ref2.downloaded).toBe(0)
    expect(dl2.value).toBeFalsy()

    await start2().catch(() => null)

    // check hash file page
    expect(await readdir(`files/${hashIDManga}/${hashIDEp}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851"
    ])

    // valid image pages

    for (const index in pages) {
      const path = `files/${hashIDManga}/${hashIDEp}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(
        await readFile(
          "meta/" + hashIDManga + "/" + hashIDEp + ".mod",
          Encoding.UTF8
        )
      )
    ).toEqual({
      ...metaEp,
      ep_name,
      ep_param,
      route,
      start_download_at: 0,
      downloaded: 8,
      pages_offline: [
        "offline://files/4523dfa2/62c5450c/1a96284a",
        "offline://files/4523dfa2/62c5450c/1a96284b",
        "offline://files/4523dfa2/62c5450c/1a96284c",
        "offline://files/4523dfa2/62c5450c/1a96284d",
        "offline://files/4523dfa2/62c5450c/1a96284e",
        "offline://files/4523dfa2/62c5450c/1a96284f",
        "offline://files/4523dfa2/62c5450c/1a962850",
        "offline://files/4523dfa2/62c5450c/1a962851"
      ]
    })
  })

  // test("should run multiple download episodes", async () => {})

  test("should download stop and resume", async () => {
    patchFetch()

    const { ref, downloading, start, stop, resume } = createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    )
    expect(downloading.value).toBe(false)
    expect(ref.downloaded).toBe(0)

    const watcher = vi.fn()
    watch(ref, watcher, { deep: true })

    void start()
    await sleep(500)
    expect(downloading.value).toBe(true)
    expect(ref.downloaded).toBeGreaterThanOrEqual(1)

    void stop()
    await sleep(500)

    expect(downloading.value).toBe(false)
    expect(ref.downloaded).toBeGreaterThanOrEqual(1)

    const promise = resume()
    expect(downloading.value).toBe(true)
    expect(ref.downloaded).toBeGreaterThanOrEqual(1)

    await promise

    // check hash file page
    expect(await readdir(`files/${hashIDManga}/${hashIDEp}`)).toEqual([
      "1a96284a",
      "1a96284b",
      "1a96284c",
      "1a96284d",
      "1a96284e",
      "1a96284f",
      "1a962850",
      "1a962851"
    ])

    // valid image pages

    for (const index in pages) {
      const path = `files/${hashIDManga}/${hashIDEp}/${hashSum(+index)}`

      expect(await readFile(path, Encoding.UTF8)).toBe(pages[index])
    }

    // valid meta
    expect(
      JSON.parse(
        await readFile(
          "meta/" + hashIDManga + "/" + hashIDEp + ".mod",
          Encoding.UTF8
        )
      )
    ).toEqual({
      ...metaEp,
      ep_name,
      ep_param,
      route,
      start_download_at: 0,
      downloaded: 8,
      pages_offline: [
        "offline://files/4523dfa2/62c5450c/1a96284a",
        "offline://files/4523dfa2/62c5450c/1a96284b",
        "offline://files/4523dfa2/62c5450c/1a96284c",
        "offline://files/4523dfa2/62c5450c/1a96284d",
        "offline://files/4523dfa2/62c5450c/1a96284e",
        "offline://files/4523dfa2/62c5450c/1a96284f",
        "offline://files/4523dfa2/62c5450c/1a962850",
        "offline://files/4523dfa2/62c5450c/1a962851"
      ]
    })
  })

  test("should get list manga downloaded", async () => {
    await createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    ).start()

    // ok get list

    expect(await getListManga()).toEqual([
      {
        ...metaManga,
        route,
        image: "offline:///poster/4523dfa2",
        start_download_at: 0
      }
    ])

    const meta2 = {
      ...metaManga
    }

    await createTaskDownloadEpisode(
      {
        ...route,
        params: {
          ...route.params,
          comic: "runn"
        }
      },
      meta2,
      metaEp,
      ep_name,
      ep_param,
      pages
    ).start()

    expect(await getListManga()).toEqual([
      {
        ...metaManga,
        route: {
          ...route,
          params: {
            ...route.params,
            comic: "runn"
          }
        },
        manga_id: "1",
        image: "offline:///poster/2d293839",
        start_download_at: 0
      },
      {
        ...metaManga,
        route,
        image: "offline:///poster/4523dfa2",
        start_download_at: 0
      }
    ])
  })

  test("should get list episodes downloaded", async () => {
    await createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    ).start()

    // ok get list
    expect(await getListEpisodes(route.params.comic)).toEqual([
      {
        ...metaEp,
        ep_name,
        ep_param,
        route,
        start_download_at: 0,
        downloaded: 8,
        pages_offline: [
          "offline://files/4523dfa2/62c5450c/1a96284a",
          "offline://files/4523dfa2/62c5450c/1a96284b",
          "offline://files/4523dfa2/62c5450c/1a96284c",
          "offline://files/4523dfa2/62c5450c/1a96284d",
          "offline://files/4523dfa2/62c5450c/1a96284e",
          "offline://files/4523dfa2/62c5450c/1a96284f",
          "offline://files/4523dfa2/62c5450c/1a962850",
          "offline://files/4523dfa2/62c5450c/1a962851"
        ]
      }
    ])
    ;(Date.now as ReturnType<typeof vi.fn>).mockReturnValue(1)

    await createTaskDownloadEpisode(
      route,
      metaManga,
      { ...metaEp },
      ep_name,
      ep_param + 1,
      pages
    ).start()

    expect(await getListEpisodes(route.params.comic)).toEqual([
      {
        ...metaEp,
        route,
        ep_name,
        ep_param: ep_param + 1,
        downloaded: 8,
        ep_id,
        pages_offline: [
          `offline://files/${hashIDManga}/143946b6/1a96284a`,
          `offline://files/${hashIDManga}/143946b6/1a96284b`,
          `offline://files/${hashIDManga}/143946b6/1a96284c`,
          `offline://files/${hashIDManga}/143946b6/1a96284d`,
          `offline://files/${hashIDManga}/143946b6/1a96284e`,
          `offline://files/${hashIDManga}/143946b6/1a96284f`,
          `offline://files/${hashIDManga}/143946b6/1a962850`,
          `offline://files/${hashIDManga}/143946b6/1a962851`
        ],
        start_download_at: 1
      },
      {
        ...metaEp,
        route,
        ep_name,
        ep_param,
        start_download_at: 0,
        downloaded: 8,
        pages_offline: [
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284a`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284b`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284c`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284d`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284e`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a96284f`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a962850`,
          `offline://files/${hashIDManga}/${hashIDEp}/1a962851`
        ]
      }
    ])
    ;(Date.now as ReturnType<typeof vi.fn>).mockReturnValue(0)
  })

  test("should delete manga", async () => {
    await createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    ).start()

    await expect(exists(`meta/${hashIDManga}`)).resolves.toBeTruthy()
    await expect(exists(`poster/${hashIDManga}`)).resolves.toBeTruthy()
    await expect(exists(`files/${hashIDManga}`)).resolves.toBeTruthy()

    await deleteManga(route.params.comic)

    await expect(exists(`meta/${hashIDManga}`)).resolves.toBeFalsy()
    await expect(exists(`poster/${hashIDManga}`)).resolves.toBeFalsy()
    await expect(exists(`files/${hashIDManga}`)).resolves.toBeFalsy()
  })

  test("should delete episode", async () => {
    await createTaskDownloadEpisode(
      route,
      metaManga,
      metaEp,
      ep_name,
      ep_param,
      pages
    ).start()
    await createTaskDownloadEpisode(
      route,
      metaManga,
      { ...metaEp, ep_id: metaEp.ep_id + 1 + "" },
      ep_name,
      ep_param + 1,
      pages
    ).start()

    await expect(exists(`meta/${hashIDManga}`)).resolves.toBeTruthy()
    await expect(exists(`poster/${hashIDManga}`)).resolves.toBeTruthy()
    await expect(exists(`files/${hashIDManga}`)).resolves.toBeTruthy()

    await expect(
      exists(`meta/${hashIDManga}/${hashIDEp}.mod`)
    ).resolves.toBeTruthy()
    await expect(
      exists(`files/${hashIDManga}/${hashIDEp}`)
    ).resolves.toBeTruthy()

    const hashIDEp2 = hashSum(ep_param + 1)
    await expect(
      exists(`meta/${hashIDManga}/${hashIDEp2}.mod`)
    ).resolves.toBeTruthy()
    await expect(
      exists(`files/${hashIDManga}/${hashIDEp2}`)
    ).resolves.toBeTruthy()

    await deleteEpisode(route.params.comic, ep_param)

    await expect(
      exists(`meta/${hashIDManga}/${hashIDEp}.mod`)
    ).resolves.toBeFalsy()
    await expect(
      exists(`files/${hashIDManga}/${hashIDEp}`)
    ).resolves.toBeFalsy()
    await expect(
      exists(`meta/${hashIDManga}/${hashIDEp2}.mod`)
    ).resolves.toBeTruthy()
    await expect(
      exists(`files/${hashIDManga}/${hashIDEp2}`)
    ).resolves.toBeTruthy()

    await deleteEpisode(route.params.comic, ep_param + 1)

    await expect(exists(`meta/${hashIDManga}.mod`)).resolves.toBeFalsy()
    await expect(exists(`poster/${hashIDManga}`)).resolves.toBeFalsy()
    await expect(exists(`files/${hashIDManga}`)).resolves.toBeFalsy()
  })
})

export {}
