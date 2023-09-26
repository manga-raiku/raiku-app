import { parseDom } from "raiku-pgs/plugin"

import { parseComment } from "../__helpers__/parseComment"

export default function (html: string, now: number) {
  const $ = parseDom(html)

  return $(".info-comment")
    .toArray()
    .map((item) => parseComment($(item), now))
}
