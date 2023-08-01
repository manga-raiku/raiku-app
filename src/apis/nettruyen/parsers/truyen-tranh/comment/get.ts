import { parseDom } from "src/apis/__helpers__/parseDom"

import { parseComment } from "../../__helpers__/parseComment"

export default function (html: string, now: number) {
  const $ = parseDom(html)

  return $(".item")
    .toArray()
    .map((item) => parseComment($(item), now))
}
