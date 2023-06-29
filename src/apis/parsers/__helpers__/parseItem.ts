import type { Cheerio, CheerioAPI, Element } from "cheerio"

import { parseAnchor } from "./parseAnchor"
import { parseCount } from "./parseCount"
import { parsePath } from "./parsePath"
import { parseTime } from "./parseTime"

export function parseItem($: CheerioAPI, $item: Cheerio<Element>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const path = parsePath($item.find("a").attr("href")!)
  const image =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $item.find("img").attr("data-original") ?? $item.find("img").attr("src")!
  const name = $item.find("h3").text().trim()
  const chapter = $item
    .find("a[title^='Chapter']")
    .toArray()
    .map((item) => {
      const $item = $(item)
      return {
        ...parseAnchor($item),
        update: parseTime($item.next(".time").text().trim()),
      }
    })
  const lastUpdate = parseTime($item.find(".time").text().trim())
  const [views = null, comments = null, likes = null] = $item
    .find(".view .pull-left")
    .text()
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((item) => parseCount(item.trim()))

  return { path, image, name, chapter, lastUpdate, views, comments, likes }
}
