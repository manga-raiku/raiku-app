import {
  normalizeChName,
  parseAnchor,
  parseDom,
  parseNumber,
  parsePath,
} from "raiku-pgs"

import { meta } from "../../package"

import { getImage } from "./__helpers__/getImage"
import { getParamComicAndChap } from "./__helpers__/getParamComicAndChap"
import { parseItem } from "./__helpers__/parseItem"

export default function index(html: string, now: number) {
  const $ = parseDom(html)

  const recommend = $("#ctl00_divAlt1 .item")
    .toArray()
    .map((item) => parseItem($, $(item), now))
  // eslint-disable-next-line camelcase
  const last_update = $("#ctl00_divCenter .item")
    .toArray()
    .map((item) => parseItem($, $(item), now))
  const top = $("#topMonth li")
    .toArray()
    .map((item) => {
      const $item = $(item)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const image = getImage($item.find("img"))!
      const route = {
        name: "comic",
        params: {
          sourceId: meta.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          comic: parsePath($item.find("a").attr("href")!),
        },
      }
      const name = $item.find("h3").text().trim()

      const { path, name: chapName } = parseAnchor($item.find(".chapter a"))
      // eslint-disable-next-line camelcase
      const last_chapter = {
        route: {
          name: "comic chap",
          params: {
            sourceId: meta.id,
            ...getParamComicAndChap(path),
          },
        },
        name: normalizeChName(chapName),
        updated_at: parseNumber($item.find(".chapter .view").text().trim()),
      }

      // eslint-disable-next-line camelcase
      return { image, route, name, last_chapter }
    })

  // eslint-disable-next-line camelcase
  return { recommend, last_update, top }
}
