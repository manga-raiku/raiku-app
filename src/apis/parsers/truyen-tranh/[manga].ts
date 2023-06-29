import { parseAnchor } from "../__helpers__/parseAnchor"
import { parseComment } from "../__helpers__/parseComment"
import { parseCount } from "../__helpers__/parseCount"
import { parseDate } from "../__helpers__/parseDate"
import { parseDom } from "../__helpers__/parseDom"
import { parseTime } from "../__helpers__/parseTime"

export default function manga(html: string) {
  const $ = parseDom(html)

  const $detail = $("#item-detail")
  const name = $detail.find(".title-detail").text().trim()
  const othername = $detail.find(".other-name").text().trim()
  const lastUpdate = parseDate(
    $detail
      .find("time.small")
      .text()
      .trim()
      .replace("[Cập nhật lúc: ", "")
      .slice(0, -1)
  )
  const image =
    $detail.find("img").attr("data-original") ??
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $detail.find("img").attr("src")!

  const author = parseAnchor($detail.find(".author p:not(.name)").find("a"))
  const status = $detail.find(".status p:not(.name)").text()
  const genres = $detail
    .find(".kind p:not(.name)")
    .find("a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const views = parseInt(
    $detail.find(".kind").next().find("p:not(.name)").text().replace(/\./, "")
  )
  const $rate = $detail.find("span[itemprop='aggregateRating']")
  const rate =
    parseFloat($rate.find("[itemprop=ratingValue]").text()) /
    parseFloat($rate.find("[itemprop=bestRating]").text())
  // eslint-disable-next-line camelcase
  const count_rate = parseInt($rate.find("[itemprop=ratingCount]").text())
  // eslint-disable-next-line camelcase
  const count_follow = parseCount($(".follow b").text())

  const description = $(".detail-content p").text()

  const chapters = $detail
    .find("#nt_listchapter ul .chapter")
    .toArray()
    .map((item) => {
      const $item = $(item)

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: parseInt($item.find("a").attr("data-id")!),
        ...parseAnchor($item),
        update: parseTime($item.next("div").text().trim()),
        views: parseCount($item.next("div").next().text().trim()),
      }
    })
  const comments = $(".comment-list .item")
    .toArray()
    .map((item) => parseComment($, item))

  return {
    name,
    othername,
    lastUpdate,
    image,
    author,
    status,
    genres,
    views,
    rate,
    // eslint-disable-next-line camelcase
    count_rate,
    // eslint-disable-next-line camelcase
    count_follow,
    description,
    chapters,
    comments,
  }
}
