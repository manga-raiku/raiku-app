import type { Cheerio, CheerioAPI } from "cheerio"

import { parseDate } from "./parseDate"

interface Comment {
  author: {
    avatar: string | null
    name: string
    level: number
  }
  created: number
  chapter: string
  content: string | null
  voteUp: number
  voteDown: number
  replies: Comment[]
}
export function parseComment(
  $: CheerioAPI,
  comment: Cheerio<Element>
): Comment {
  const $comment = $(comment)

  const author = {
    avatar:
      $comment.find(".avatar img").attr("data-original") ??
      $comment.find(".avatar img").attr("src") ??
      null,
    name: $comment.find(".authorname").text().trim(),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    level: parseInt($comment.find(".member > span").attr("data-level")!),
  }
  const created = parseDate(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $comment
      .find("abbr")
      .attr("title")!
      .replace("SA", "AM")
      .replace("CH", "PM")
  )
  const chapter = $comment
    .find(".cmchapter")
    .text()
    .trim()
    .replace("Chapter ", "")
  const content = $comment.find(".comment-content").html()
  const voteUp = parseInt($comment.find(".vote-up-count").text())
  const voteDown = parseInt($comment.find(".vote-down-count").text())
  const replies = $comment
    .find(".summary")
    .find(".item")
    .toArray()
    .map((item) => parseComment($, item))

  return { author, created, chapter, content, voteUp, voteDown, replies }
}
