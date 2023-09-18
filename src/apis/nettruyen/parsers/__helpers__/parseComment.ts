/* eslint-disable camelcase */
import type { Cheerio, CheerioAPI, Element } from "cheerio"
import { parseTimeAgo } from "raiku-pgs"
import type { Comment } from "raiku-pgs"
import { normalizeChName } from "src/logic/normalize-ch-name"

import { getImage } from "./getImage"

export function parseComment(
  $: CheerioAPI,
  $item: Cheerio<Element>,
  now: number,
): Comment {
  const id = parseInt(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $item.attr("id")!.match(/\d+/)![0],
  )

  const per = $item
    .find(".member > .progress-bar")
    .attr("style")
    ?.match(/width:\s*(\d+)/)?.[1]

  const author = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    avatar: getImage($item.find(".avatar img"))!,
    name: $item.find(".authorname").text().trim(),
    level: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current: parseInt($item.find(".member > span:eq(0)").attr("data-level")!),
      perNext: per ? parseFloat(per) : null,
    },
    chapter: normalizeChName($item.find(".cmchapter").text().trim()),
  }
  // patch content
  $item.find(".comment-content img").each((i, item) => {
    const $item2 = $(item)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $item2.attr("src", getImage($item2)!)
  })
  const content = $item.find(".comment-content").html()
  const like = parseInt($item.find(".vote-up-count").text())
  const dislike = parseInt($item.find(".vote-down-count").text())
  const created_at = parseTimeAgo($item.find("abbr:eq(0)").text(), now)

  const repiles: Comment[] = $item
    .find(".item.child")
    .toArray()
    .map((item) => parseComment($, $item.find(item), now))

  return {
    id,
    author,
    content,
    like,
    dislike,
    created_at,
    repiles,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}
