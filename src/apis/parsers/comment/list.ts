import { parseAnchor } from "../__helpers__/parseAnchor"
import { parseComment } from "../__helpers__/parseComment"
import { parseDate } from "../__helpers__/parseDate"
import { parseDom } from "../__helpers__/parseDom"
import { parsePath } from "../__helpers__/parsePath"

export default function (html: string, now: number) {
  const $ = parseDom(html)

  return $(".info-comment")
    .toArray()
    .map((item) => parseComment($(item), now))
}
