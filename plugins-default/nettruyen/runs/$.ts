import { withProxyImage } from "logic/with-proxy-image"
import type {
  API,
  Chapter,
  ComicChapter,
  FetchGet,
  FetchPost,
  ID,
  MetaManga,
  Package,
  Ranking,
  Server,
} from "raiku-pgs"

import General from "./[general]"
import favicon from "./favicon.png?base64"
import getListChapters from "./get-list-chapters"
import searchQuickly from "./pre-search"
import search from "./tim-kiem"
import getComic from "./truyen-tranh/[slug]"
import getComicChapter from "./truyen-tranh/[slug]-chap-[chap]"
import getComicComment from "./truyen-tranh/comment/get"

import Index from "./index"

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

export class Nettruyen implements API {
  public readonly package: Package = {
    id: "raiku.plugin.nettruyen",
    name: "Net Truyen",
    favicon,
    version: "0.0.1",
    description: "Plugin nguồn Net Truyen",
    author: "Tachibana Shin <tachibshin@duck.com>",
    updatedAt: Date.now(),
    source: "",
  }

  public readonly Rankings = Rankings
  public readonly Servers = Servers

  public readonly get: FetchGet<"text">
  public readonly post: FetchPost<"text">

  constructor(get: FetchGet<"text">, post: FetchPost<"text">) {
    this.get = get
    this.post = post
  }

  index(): Promise<
    Readonly<{
      sliders: MetaManga[]
      hot: MetaManga[]
      last_update: MetaManga[]
    }>
  > {
    return Index(this)
  }

  getComic(zlug: string) {
    return getComic(this, zlug)
  }

  async getComicChapter<Fast extends boolean>(
    mangaId: ID,
    epId: ID,
    fast: Fast,
  ): Promise<
    Fast extends true
      ? ComicChapter
      : ComicChapter & {
          readonly chapters: Chapter[]
        }
  > {
    return getComicChapter<Fast>(this, mangaId + "/" + epId, fast)
  }

  getComicComments(
    comicId: number,
    orderByNews: boolean,
    chapterId = -1,
    parentId = 0,
    page: number,
    comicKey: string,
  ) {
    return getComicComment(
      this,
      comicId,
      orderByNews,
      chapterId,
      parentId,
      page,
      comicKey,
    )
  }

  getListChapters(mangaId: ID) {
    return getListChapters(this, mangaId)
  }

  searchQuickly(keyword: string, page: number) {
    return searchQuickly(this, keyword, page)
  }

  search(keyword: string, page: number) {
    return search(this, keyword, page)
  }

  getRanking(type: string, page: number, filter: Record<string, string>) {
    const match = Rankings.find((item) => item.value === type)?.match
    // eslint-disable-next-line functional/no-throw-statement
    if (!match) throw new Error("not_found")

    return General(this, match, page, filter)
  }

  getCategory(
    type: string,
    page: number,
    filter: Record<string, string | string[]>,
  ) {
    return General(this, `/tim-truyen/${type}`, page, filter)
  }

  public resolveUrlComicChapter(url: string) {
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
