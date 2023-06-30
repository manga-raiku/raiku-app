import { parseAnchor } from "../__helpers__/parseAnchor"
import { parseComment } from "../__helpers__/parseComment"
import { parseDate } from "../__helpers__/parseDate"
import { parseDom } from "../__helpers__/parseDom"
import { parsePath } from "../__helpers__/parsePath"

export default function manga(html: string, now: number) {
  const $ = parseDom(html)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = $(".book_avatar img").attr("src")!
  const name = $(".book_other h1").text().trim()
  const othername = $(".other-name").text()
  const author = $(".author a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const status = $(".status p:not(.name)").text()
  const likes = parseInt(
    $(".status").next().find("p:not(.name)").text().replace(/,/g, "")
  )
  const follows = parseInt(
    $(".status").next().next().find("p:not(.name)").text().replace(/,/g, "")
  )
  const views = parseInt(
    $(".status")
      .next()
      .next()
      .next()
      .find("p:not(.name)")
      .text()
      .replace(/,/g, "")
  )
  const genres = $(".list01 a")
    .toArray()
    .map((item) => parseAnchor($(item)))
  const $readContinue = $(".story-detail-menu > .li04 a").attr("href")
  const readContinue = $readContinue ? parsePath($readContinue) : null
  const description = $(".detail-content").text().trim()
  const chapters = $(".works-chapter-item")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const $time = $item.find(".time-chap")
      return {
        ...parseAnchor($item.find("a")),
        update: parseDate($time.text()),
      }
    })
  const comments = $(".info-comment")
    .toArray()
    .map((item) => parseComment($(item), now))

  return {
    image,
    name,
    othername,
    author,
    status,
    likes,
    follows,
    views,
    genres,
    readContinue,
    description,
    chapters,
    comments,
  }
}
