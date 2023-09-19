import { parseDom, parsePath } from "raiku-pgs"
import { normalizeChName } from "raiku-pgs"
import { getImage } from "./__helpers__/getImage"

export default function (html: string) {
  const $ = parseDom(html)

  return $("li")
    .toArray()
    .map((item) => {
      const $item = $(item)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = parsePath($item.find("a").attr("href")!)
      const name = $item.find("h3").text().trim()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const image = getImage($item.find("img"))!
      const $h4i = $item.find("h4 i")
      // eslint-disable-next-line camelcase
      const last_chapter = normalizeChName($h4i.first().text())
      const othername = $h4i.length > 2 ? $h4i.eq(1).text().trim() : ""
      const tags = $h4i
        .last()
        .text()
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      // eslint-disable-next-line camelcase
      return { path, name, image, last_chapter, othername, tags }
    })
}
