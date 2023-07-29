/* eslint-disable camelcase */
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"

export default function epId(html: string, now: number) {
  const $ = parseDom(html)

  const name = $("h1").text().split("-").slice(0, -1).join("-").trim()
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

  return { name, uid, ep_id, updated_at, pages, cdn, cdn2 }
}

type Page = ReturnType<typeof epId>["pages"][0]

export const SERVERS: {
  name: string
  has: (page: Page) => boolean
  get: (page: Page, conf: ReturnType<typeof epId>) => string
}[] = [
  {
    name: "Server 1",
    has: () => true,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    get: (item: Page) => item.src!,
  },
  {
    name: "Server 2",
    has: (item: Page) => item.original !== null,
    get(item) {
      if (item.original?.indexOf("focus-opensocial.googleusercontent") !== -1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return decodeURIComponent(item.original!.split("&url", 2)[1])
      }

      return `https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=${encodeURIComponent(
        item.original
      )}`
    },
  },
  {
    name: "Server 3",
    has: (item: ReturnType<typeof epId>["pages"][0]) => item.cdn !== null,

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    get: (item) => item.cdn!,
  },
  {
    name: "Server 4",
    has: (item) =>
      item.cdn !== null &&
      item.original?.indexOf("focus-opensocial.googleusercontent") !== -1,
    get: (item, { cdn, cdn2 }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return item.cdn!.replace(cdn!, cdn2!)
    },
  },
]
