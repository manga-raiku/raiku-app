import type { Comment } from "raiku-pgs/plugin"

import { parseComment } from "../../__helpers__/parseComment"

export default function (html: string, now: number): readonly Comment[] {
  const $ = parseDom(html)

  return $(".item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
}
