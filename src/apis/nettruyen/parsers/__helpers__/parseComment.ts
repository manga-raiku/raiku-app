import type { Cheerio, Element } from "cheerio"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"

import { getImage } from "./getImage"

interface RComment {
  id: number
  author: {
    avatar: string
    name: string
    level: {
      current: number
      perNext: number
    }
    chapter: string
  }
  content: string | null
  like: number
  dislike: number
  created_at: number
  replies: RComment[]
}

export function parseComment($item: Cheerio<Element>, now: number): RComment {
  const id = parseInt(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $item.attr("id")!.match(/\d+/)![0]
  )

  const author = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    avatar: getImage($item.find(".avatar img"))!,
    name: $item.find(".authorname").text().trim(),
    level: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current: parseInt($item.find(".member > span:eq(0)").attr("data-level")!),
      perNext: parseFloat(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $item
          .find(".member > .progress-bar")
          .attr("style")!
          .match(/width:\s*(\d+)/)![1]
      ),
    },
    chapter: $item.find(".cmchapter").text().trim(),
  }
  const content = $item.find(".comment-content").html()
  const like = parseInt($item.find(".vote-up-count").text())
  const dislike = parseInt($item.find(".vote-down-count").text())
  // eslint-disable-next-line camelcase
  const created_at = parseTimeAgo($item.find("abbr:eq(0)").text(), now)

  const repiles: RComment[] = $item
    .find(".item.child")
    .toArray()
    .map((item) => parseComment($item.find(item), now))

  // eslint-disable-next-line camelcase, @typescript-eslint/no-explicit-any
  return { id, author, content, like, dislike, created_at, repiles } as any
}
