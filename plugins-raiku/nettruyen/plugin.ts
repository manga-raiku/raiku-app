import type { GetOption } from "client-ext-animevsub-helper"
import {
  type API,
  defineApi,
  type FetchGet,
  type FetchPost,
  type ID,
  type Ranking,
  type Server,
} from "raiku-pgs/plugin"

import { withProxyImage } from "./src/logic/with-proxy-image"
import General from "./src/runs/[general]"
import getListChapters from "./src/runs/get-list-chapters"
import Index from "./src/runs/index"
import searchQuickly from "./src/runs/pre-search"
import search from "./src/runs/tim-kiem"
import getComic from "./src/runs/truyen-tranh/[slug]"
import getComicChapter from "./src/runs/truyen-tranh/[slug]-chap-[chap]"
import getComicComment from "./src/runs/truyen-tranh/comment/get"

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

class Nettruyen implements API {
  public readonly Rankings = Rankings
  public readonly Servers = Servers

  public readonly get: FetchGet<GetOption["responseType"]>
  public readonly post: FetchPost<GetOption["responseType"]>

  constructor(
    get: FetchGet<GetOption["responseType"]>,
    post: FetchPost<GetOption["responseType"]>,
  ) {
    this.get = get
    this.post = post
  }

  async index() {
    return Index(this)
  }

  async getComic(zlug: string) {
    return getComic(this, zlug)
  }

  async getComicChapter<Fast extends boolean>(
    mangaId: ID,
    epId: ID,
    fast: Fast,
  ) {
    const lastI = epId.lastIndexOf("-i") >>> 0

    return getComicChapter(
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

  async getListChapters(mangaId: ID) {
    return getListChapters(this, mangaId)
  }

  async searchQuickly(keyword: string, page: number) {
    return searchQuickly(this, keyword, page)
  }

  async search(keyword: string, page: number) {
    return search(this, keyword, page)
  }

  async getRanking(type: string, page: number, filter: Record<string, string>) {
    const match = Rankings.find((item) => item.value === type)?.match
    // eslint-disable-next-line functional/no-throw-statement
    if (!match) throw new Error("not_found")

    return General(this, match, page, filter)
  }

  async getCategory(
    type: string,
    page: number,
    filter: Record<string, string | string[]>,
  ) {
    return General(this, `/tim-truyen/${type}`, page, filter)
  }
}

defineApi(Nettruyen)
