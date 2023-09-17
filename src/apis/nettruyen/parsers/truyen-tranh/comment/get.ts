import type { Comment } from "src/apis/API"
import { parseDom } from "src/apis/__helpers__/parseDom"

import { parseComment } from "../../__helpers__/parseComment"

export default function (html: string, now: number): readonly Comment[] {
  const $ = parseDom(html)

  return $(".item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
}
