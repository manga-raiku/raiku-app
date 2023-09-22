import type { Cheerio, CheerioAPI, Element } from "cheerio"
import type { MetaManga } from "raiku-pgs"
import {
  normalizeChName,
  parseAnchor,
  parseNumber,
  parsePath,
  parseTimeAgo,
} from "raiku-pgs"

import { meta } from "../../../package"

import { getImage } from "./getImage"
import { getParamComic } from "./getParamComic"
import { getParamComicAndChap } from "./getParamComicAndChap"

function findWithFirstText(
  $: CheerioAPI,
  $list: Cheerio<Element>,
  text: string,
) {
  return $(
    $list.toArray().find((el) => {
      const $el = $(el)
      const c = $el.text().trim()

      if (c.startsWith(text)) return true

      return false
    }),
  )
    .text()
    .trim()
    .slice(text.length)
    .trim()
}

export function parseItem(
  $: CheerioAPI,
  $item: Cheerio<Element>,
  now: number,
): MetaManga {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = getImage($item.find("img"))!
  const route = {
    name: "comic",
    params: {
      sourceId: meta.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      comic: getParamComic(parsePath($item.find("a").attr("href")!)),
    },
  } as const
  const name = $item.find("h3").text().trim()
  const $ps = $item.find(".message_main p")
  const othername = findWithFirstText($, $ps, "Tên khác:")
  const tags = findWithFirstText($, $ps, "Thể loại:")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  const status = findWithFirstText($, $ps, "Tình trạng:")
  const author = findWithFirstText($, $ps, "Tác giả:")
  const description = $item.find(".box_text").text()
  // eslint-disable-next-line camelcase
  const last_chapters = $item
    .find("h3 + a, .chapter a")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const data = parseAnchor($item)
      const time = $item.next()

      const route = {
        name: "comic chap",
        params: {
          sourceId: meta.id,
          ...getParamComicAndChap(data.path),
        },
      } as const

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: parseInt($item.attr("href")!.match(/(\d+)\/?$/)![1]) + "",
        route,
        name: normalizeChName(data.name),
        updated_at:
          time.is(".time") && time.text()
            ? parseTimeAgo(time.text(), now)
            : null,
        views: null,
      }
    })

  const [views, comments, likes] = $item
    .find(".pull-left")
    .text()
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((item) => parseNumber(item))
  const label = $(".icon.icon-hot").length > 0 ? "Hot" : null

  // const visited =
  //   $item.find("div > div.view.viewed > a").length > 0
  //     ? parseAnchor($item.find("div > div.view.viewed > a"))
  //     : null
  // if (visited) visited.name = visited.name.replace("Đọc tiếp Chapter ", "")
  // // eslint-disable-next-line camelcase
  // const read_at = $item.find(".read-action .continue").text()
  //   ? parseTimeAgo($item.find(".read-action .continue").text(), now)
  //   : null

  return {
    image,
    route,
    name,
    othername,
    tags,
    status,
    author,
    description,
    // eslint-disable-next-line camelcase
    last_chapters,
    views,
    comments,
    likes,
    label,
    // visited,
    // // eslint-disable-next-line camelcase
    // ...(read_at ? { read_at } : undefined),
  }
}
