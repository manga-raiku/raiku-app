import { parseAnchor } from "../__helpers__/parseAnchor"
import { parseDom } from "../__helpers__/parseDom"
import { parseItem } from "../__helpers__/parseItem"

export default function GetFollowedBlockComics(html: string) {
  const $ = parseDom(html)

  return $("li")
    .toArray()
    .map((item) => {
      const $item = $(item)

      return {
        ...parseItem($, $item),
        readContinue: parseAnchor($item.find(".viewed a")),
      }
    })
}
