import { parseDom } from "./__helpers__/parseDom"
import { parseItem } from "./__helpers__/parseItem"

export default function index(html: string) {
  const $ = parseDom(html)

  const recommend = $("#ctl00_divAlt1 .item")
    .toArray()
    .map((item) => parseItem($, $(item)))
  const updated = $("#ctl00_divCenter .item")
    .toArray()
    .map((item) => parseItem($, $(item)))
  const hotOfMonth = $("#topMonth .comic-item")
    .toArray()
    .map((item) => parseItem($, $(item)))

  return { recommend, updated, hotOfMonth }
}
