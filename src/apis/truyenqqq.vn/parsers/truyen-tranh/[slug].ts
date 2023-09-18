import {
  parseAnchor,
  parseDate,
  parseDom,
  parseNumber,
  parsePath,
} from "raiku-pgs"
import { normalizeChName } from "src/logic/normalize-ch-name"

import { parseComment } from "../__helpers__/parseComment"

export default function manga(html: string, now: number) {
  const $ = parseDom(html)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = parseInt($("#book_id").attr("value")!)
  // eslint-disable-next-line camelcase, @typescript-eslint/no-non-null-assertion
  const team_id = parseInt($("#team_id").attr("value")!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = $(".book_avatar img").attr("src")!
  const name = $(".book_other h1").text().trim()
  const othername = $(".other-name").text()
  const author = $(".author a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const status = $(".status p:not(.name)").text().trim()
  const likes = parseInt(
    $(".status").next().find("p:not(.name)").text().replace(/,/g, ""),
  )
  const follows = parseInt(
    $(".status").next().next().find("p:not(.name)").text().replace(/,/g, ""),
  )
  const followed = $(".btn-subscribe .fa-heart").length === 0
  const views = parseNumber(
    $(".status")
      .next()
      .next()
      .next()
      .find("p:not(.name)")
      .text()
      .replace(/,/g, ""),
  )
  const genres = $(".list01 a")
    .toArray()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => parseAnchor($(item))!)
  const $readContinue = $(".story-detail-menu > .li04 a").attr("href")
  const readContinue = $readContinue ? parsePath($readContinue) : null
  const description = $(".detail-content").text().trim()
  const chapters = $(".works-chapter-item")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const $time = $item.find(".time-chap")
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = parseAnchor($item.find("a"), normalizeChName)!

      return {
        ...data,
        update: parseDate($time.text()),
        readed: $item.find(".active").length > 0,
      }
    })
  const comments = $(".info-comment")
    .toArray()
    .map((item) => parseComment($(item), now))

  return {
    id,
    // eslint-disable-next-line camelcase
    team_id,
    image,
    name,
    othername,
    author,
    status,
    likes,
    follows,
    followed,
    views,
    genres,
    readContinue,
    description,
    chapters,
    comments,
  }
}
