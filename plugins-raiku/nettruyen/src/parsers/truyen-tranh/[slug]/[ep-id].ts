/* eslint-disable camelcase */
import { parseAnchor, parseDom, parseTimeAgo } from "raiku-pgs"
import type { ComicChapter } from "raiku-pgs"

import { parseComment } from "../../__helpers__/parseComment"

export default function epId(html: string, now: number): ComicChapter {
  const $ = parseDom(html)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = $("#ctl00_Head1 > meta:nth-child(12)").attr("content")!

  const name = $("h1").text().split("-").slice(0, -1).join("-").trim()
  const { path: path_manga } = parseAnchor(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > a"),
  )
  const manga_id = parseInt(html.match(/gOpts\.comicId=(\d+)/)?.[1] ?? "") + ""
  const ep_id = parseInt(html.match(/gOpts\.chapterId=(\d+)/)?.[1] ?? "") + ""
  const cdn = html.match(/gOpts\.cdn="([^"]+)"/)?.[1]
  const cdn2 = html.match(/gOpts\.cdn2="([^"]+)"/)?.[1]
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const key = html.match(/gOpts\.key=('|")([^"']+)\1/)![2]!
  const updated_at = parseTimeAgo(
    $("#ctl00_divCenter > div > div:nth-child(1) > div.top > i")
      .text()
      .trim()
      .slice(16, -1),
    now,
  )
  const pages = $(".reading-detail img")
    .toArray()
    .map((item) => {
      const $item = $(item)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const src = $item.attr("src")!
      const original = $item.attr("data-original")
      const cdn = $item.attr("data-cdn")

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src: src.includes("/logos/logo-nettruyen.png") ? original! : src!,
        original,
        cdn,
      }
    })

  const comments = $("#nt_comments .comment-list .item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
  const comments_count = parseInt($(".comment-count").text())
  const comments_pages =
    parseInt(
      $("#ctl00_mainContent_divPager > ul > li:nth-child(14) > a")
        .last()
        .attr("href")
        ?.slice(1) ?? "1",
    ) || 1

  return {
    name,
    image,
    manga_id,
    // key,
    path_manga,
    ep_id,
    updated_at,
    pages,
    cdn,
    cdn2,

    comments,
    comments_count,
    comments_pages,
  }
}
