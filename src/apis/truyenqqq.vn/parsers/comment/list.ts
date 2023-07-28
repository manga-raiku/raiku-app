import { parseComment } from "src/apis/__helpers__/parseComment"
import { parseDom } from "src/apis/__helpers__/parseDom"

export default function (html: string, now: number) {
  const $ = parseDom(html)

  return $(".info-comment")
    .toArray()
    .map((item) => parseComment($(item), now))
}
