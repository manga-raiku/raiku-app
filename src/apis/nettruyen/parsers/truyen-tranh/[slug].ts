import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseDom } from "src/apis/__helpers__/parseDom"
import { parseNumber } from "src/apis/__helpers__/parseNumber"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"

import { getImage } from "../__helpers__/getImage"
import { parseComment } from "../__helpers__/parseComment"

export default function slug(html: string, now: number) {
  const $ = parseDom(html)

  const $detail = $("#item-detail")

  const name = $detail.find("h1").text().trim()
  const uid = parseInt(html.match(/gOpts\.comicId=(\d+)/)?.[1] ?? "")
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = html.match(/gOpts\.key=('|")([^"']+)\1/)![2]!
  // eslint-disable-next-line camelcase
  const updated_at = parseTimeAgo(
    $detail.find("time").text().trim().slice(16, -1),
    now,
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = getImage(
    $("#item-detail > div.detail-info > div > div.col-xs-4.col-image > img"),
  )!

  const othername = $detail.find(".othername p:not(.name)").text().trim()
  const author = $detail
    .find(".author p:not(.name)")
    .find("a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const status = $detail.find(".status p:not(.name)").text().trim()
  const genres = $detail
    .find(".kind p:not(.name)")
    .find("a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const views = parseInt(
    $detail.find(".kind").next().find("p:not(.name)").text().replace(/\./, ""),
  )
  const $rate = $detail.find("span[itemprop=aggregateRating]")
  const rate =
    parseFloat($rate.find("[itemprop=ratingValue]").text()) /
    parseFloat($rate.find("[itemprop=bestRating]").text())
  // eslint-disable-next-line camelcase
  const count_rate = parseInt($rate.find("[itemprop=ratingCount]").text())
  const follows = parseNumber($(".follow b").text())
  const description = $(".detail-content p").text()

  const chapters = $("#nt_listchapter .chapter")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const { path, name } = parseAnchor($item.find("a"))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = parseInt($item.find("a").attr("data-id")!)
      // eslint-disable-next-line camelcase
      const updated_at = parseTimeAgo($item.next().text(), now) || null
      const views = parseNumber($item.next().next().text().trim())

      // eslint-disable-next-line camelcase
      return { id, path, name: normalizeChName(name), updated_at, views }
    })

  const comments = $("#nt_comments .comment-list .item")
    .toArray()
    .map((item) => parseComment($, $(item), now))
  // eslint-disable-next-line camelcase
  const comments_count = parseInt($(".comment-count").text())
  // eslint-disable-next-line camelcase
  const comments_page_number =
    parseInt(
      $("#ctl00_mainContent_divPager > ul > li:nth-child(14) > a")
        .last()
        .attr("href")
        ?.slice(1) ?? "1",
    ) || 1

  return {
    name,
    othername,
    uid,
    key,
    // eslint-disable-next-line camelcase
    updated_at,
    image,
    author,
    status,
    genres,
    views,
    rate,
    // eslint-disable-next-line camelcase
    count_rate,
    follows,
    description,
    chapters,

    comments,
    // eslint-disable-next-line camelcase
    comments_count,
    // eslint-disable-next-line camelcase
    comments_page_number,
  }
}
