/* eslint-disable camelcase */
import type { ComicChapter } from "src/apis/API"
import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"

import { parseComment } from "../../__helpers__/parseComment"

export default function epId(html: string, now: number): ComicChapter {
  const $ = parseDom(html)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = $("#ctl00_Head1 > meta:nth-child(12)").attr("content")!

  const name = $("h1").text().split("-").slice(0, -1).join("-").trim()
  const { path: path_manga } = parseAnchor(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > a"),
  )
  const manga_id = parseInt(html.match(/gOpts\.comicId=(\d+)/)?.[1] ?? "") + ""
  const ep_id = parseInt(html.match(/gOpts\.chapterId=(\d+)/)?.[1] ?? "") + ""
  const cdn = html.match(/gOpts\.cdn="([^"]+)"/)?.[1]
  const cdn2 = html.match(/gOpts\.cdn2="([^"]+)"/)?.[1]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = html.match(/gOpts\.key=('|")([^"']+)\1/)![2]!
  const updated_at = parseTimeAgo(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > i")
      .text()
      .trim()
      .slice(16, -1),
    now,
  )
  const pages = $(".reading-detail img")
    .toArray()
    .map((item) => {
      const $item = $(item)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const src = $item.attr("src")!
      const original = $item.attr("data-original")
      const cdn = $item.attr("data-cdn")

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src: src.includes("/logos/logo-nettruyen.png") ? original! : src!,
        original,
        cdn,
      }
    })

  const comments = $("#nt_comments .comment-list .item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
  const comments_count = parseInt($(".comment-count").text())
  const comments_pages =
    parseInt(
      $("#ctl00_mainContent_divPager > ul > li:nth-child(14) > a")
        .last()
        .attr("href")
        ?.slice(1) ?? "1",
    ) || 1

  return {
    name,
    image,
    manga_id,
    // key,
    path_manga,
    ep_id,
    updated_at,
    pages,
    cdn,
    cdn2,

    comments,
    comments_count,
    comments_pages,
  }
}

type Page = ReturnType<typeof epId>["pages"][0]

const headersNettruyen = {
  referer: "https://www.nettruyenmax.com",
}

export const SERVERS: {
  name: string
  has: (page: Page, conf: ReturnType<typeof epId>) => boolean
  parse: (page: Page, conf: ReturnType<typeof epId>) => string
}[] = [
  {
    name: "Server 1",
    has: () => true,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parse: (item: Page) => withProxyImage(item.src!, headersNettruyen),
  },
  {
    name: "Server 2",
    has: (item: Page) => item.original !== null && item.original !== item.src,
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
    has: (item: ReturnType<typeof epId>["pages"][0]) => item.cdn !== null,

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
