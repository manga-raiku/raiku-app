import type { API, FetchGet, FetchPost, ID, Ranking, Server } from "raiku-pgs"

import { meta } from "./package"
import { withProxyImage } from "./src/logic/with-proxy-image"

const General = () => import("./src/runs/[general]")
const getListChapters = () => import("./src/runs/get-list-chapters")
const Index = () => import("./src/runs/index")
const searchQuickly = () => import("./src/runs/pre-search")
const search = () => import("./src/runs/tim-kiem")
const getComic = () => import("./src/runs/truyen-tranh/[slug]")
const getComicChapter = () =>
  import("./src/runs/truyen-tranh/[slug]-chap-[chap]")
const getComicComment = () => import("./src/runs/truyen-tranh/comment/get")

const Rankings: Ranking[] = [
  {
    value: "ngay",
    match: "/tim-truyen?status=-1&sort=13",
    name: {
      "vi-VN": "Ngày",
      "en-US": "Date",
    },
  },
  {
    value: "tuan",
    match: "/tim-truyen?status=-1&sort=12",
    name: {
      "vi-VN": "Tuần",
      "en-US": "Week",
    },
  },
  {
    value: "thang",
    match: "/tim-truyen?status=-1&sort=11",
    name: {
      "vi-VN": "Tháng",
      "en-US": "Month",
    },
  },
]
const headersNettruyen = {
  referer: "https://www.nettruyenmax.com",
}
const Servers: Server[] = [
  {
    name: "Server 1",
    has: () => true,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parse: (item) => withProxyImage(item.src!, headersNettruyen),
  },
  {
    name: "Server 2",
    has: (item) => item.original !== null && item.original !== item.src,
    parse(item) {
      if (item.original?.indexOf("focus-opensocial.googleusercontent") !== -1) {
        return withProxyImage(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          decodeURIComponent(item.original!.split("&url", 2)[1]),
          headersNettruyen,
        )
      }

      return withProxyImage(
        `https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=${encodeURIComponent(
          item.original,
        )}`,
        headersNettruyen,
      )
    },
  },
  {
    name: "Server 3",
    has: (item) => item.cdn !== null,

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parse: (item) => withProxyImage(item.cdn!, headersNettruyen),
  },
  {
    name: "Server 4",
    has: (item, { cdn, cdn2 }) => item.cdn !== null && !!cdn && !!cdn2,
    parse: (item, { cdn, cdn2 }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return withProxyImage(item.cdn!.replace(cdn!, cdn2!), headersNettruyen)
    },
  },
]

export default class Nettruyen implements API {
  public readonly package = meta

  public readonly Rankings = Rankings
  public readonly Servers = Servers

  public readonly get: FetchGet<"text">
  public readonly post: FetchPost<"text">

  constructor(get: FetchGet<"text">, post: FetchPost<"text">) {
    this.get = get
    this.post = post
  }

  async index() {
    const IndexModule = await Index()
    return IndexModule.default(this)
  }

  async getComic(zlug: string) {
    const getComicModule = await getComic()
    return getComicModule.default(this, zlug)
  }

  async getComicChapter<Fast extends boolean>(
    mangaId: ID,
    epId: ID,
    fast: Fast,
  ) {
    const lastI = epId.lastIndexOf("-i") >>> 0
    const getComicChapterModule = await getComicChapter()

    return getComicChapterModule.default<Fast>(
      this,
      mangaId + "/" + epId.slice(0, lastI) + "/" + epId.slice(lastI + 2),
      fast,
    )
  }

  async getComicComments(
    comicId: number,
    orderByNews: boolean,
    chapterId = -1,
    parentId = 0,
    page: number,
    comicKey: string,
  ) {
    const getComicCommentModule = await getComicComment()

    return getComicCommentModule.default(
      this,
      comicId,
      orderByNews,
      chapterId,
      parentId,
      page,
      comicKey,
    )
  }

  async getListChapters(mangaId: ID) {
    const getListChaptersModule = await getListChapters()

    return getListChaptersModule.default(this, mangaId)
  }

  async searchQuickly(keyword: string, page: number) {
    const searchQuicklyModule = await searchQuickly()

    return searchQuicklyModule.default(this, keyword, page)
  }

  async search(keyword: string, page: number) {
    const searchModule = await search()

    return searchModule.default(this, keyword, page)
  }

  async getRanking(type: string, page: number, filter: Record<string, string>) {
    const match = Rankings.find((item) => item.value === type)?.match
    // eslint-disable-next-line functional/no-throw-statement
    if (!match) throw new Error("not_found")

    const GeneralModule = await General()

    return GeneralModule.default(this, match, page, filter)
  }

  async getCategory(
    type: string,
    page: number,
    filter: Record<string, string | string[]>,
  ) {
    const GeneralModule = await General()

    return GeneralModule.default(this, `/tim-truyen/${type}`, page, filter)
  }

  public resolveUrlComicChapter(url: string) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const { pathname } = new URL(url)

    if (!pathname.includes("/truyen-tranh/"))
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`Url invalid format comic chapter. ('${url}')`)

    const [, mangaId, ...epId] = pathname.split("/")

    return {
      mangaId,
      epId: epId.join("/"),
    }
  }
}
