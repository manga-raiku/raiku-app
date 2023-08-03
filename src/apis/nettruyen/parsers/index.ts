import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parseNumber } from "src/apis/__helpers__/parseNumber"
import { parsePath } from "src/apis/__helpers__/parsePath"

import { getImage } from "./__helpers__/getImage"
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = parsePath($item.find("a").attr("href")!)
      const name = $item.find("h3").text().trim()

      // eslint-disable-next-line camelcase
      const $last_chapter = parseAnchor($item.find(".chapter a"))
      // eslint-disable-next-line camelcase
      const last_chapter = {
        // eslint-disable-next-line camelcase
        ...$last_chapter,
        // eslint-disable-next-line camelcase
        name: normalizeChName($last_chapter.name),
        updated_at: parseNumber($item.find(".chapter .view").text().trim()),
      }

      // eslint-disable-next-line camelcase
      return { image, path, name, last_chapter }
    })

  // eslint-disable-next-line camelcase
  return { recommend, last_update, top }
}
