/* eslint-disable camelcase */
import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"

import { parseComment } from "../../__helpers__/parseComment"

export default function epId(html: string, now: number) {
  const $ = parseDom(html)

  const name = $("h1").text().split("-").slice(0, -1).join("-").trim()
  const { path: manga } = parseAnchor(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > a")
  )
  const uid = parseInt(html.match(/gOpts\.comicId=(\d+)/)?.[1] ?? "")
  const ep_id = parseInt(html.match(/gOpts\.chapterId=(\d+)/)?.[1] ?? "")
  const cdn = html.match(/gOpts\.cdn="([^"]+)"/)?.[1]
  const cdn2 = html.match(/gOpts\.cdn2="([^"]+)"/)?.[1]
  const updated_at = parseTimeAgo(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > i")
      .text()
      .trim()
      .slice(16, -1),
    now
  )
  const pages = $(".reading-detail img")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const src = $item.attr("src")
      const original = $item.attr("data-original")
      const cdn = $item.attr("data-cdn")

      return { src, original, cdn }
    })

  const comments = $("#nt_comments .comment-list .item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
  const comments_count = parseInt($(".comment-count").text())
  const comments_page_number =
    parseInt(
      $("#ctl00_mainContent_divPager > ul > li:nth-child(14) > a")
        .last()
        .attr("href")
        ?.slice(1) ?? "1"
    ) || 1

  return {
    name,
    uid,
    manga,
    ep_id,
    updated_at,
    pages,
    cdn,
    cdn2,

    comments,
    comments_count,
    comments_page_number,
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
    parse: (item: Page) => withProxyDeno(item.src!, headersNettruyen),
  },
  {
    name: "Server 2",
    has: (item: Page) => item.original !== null && item.original !== item.src,
    parse(item) {
      if (item.original?.indexOf("focus-opensocial.googleusercontent") !== -1) {
        return withProxyDeno(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          decodeURIComponent(item.original!.split("&url", 2)[1]),
          headersNettruyen
        )
      }

      return withProxyDeno(
        `https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=${encodeURIComponent(
          item.original
        )}`,
        headersNettruyen
      )
    },
  },
  {
    name: "Server 3",
    has: (item: ReturnType<typeof epId>["pages"][0]) => item.cdn !== null,

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parse: (item) => withProxyDeno(item.cdn!, headersNettruyen),
  },
  {
    name: "Server 4",
    has: (item, { cdn, cdn2 }) => item.cdn !== null && !!cdn && !!cdn2,
    parse: (item, { cdn, cdn2 }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return withProxyDeno(item.cdn!.replace(cdn!, cdn2!), headersNettruyen)
    },
  },
]
