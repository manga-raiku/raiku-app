import { normalizeChName, parsePath } from "raiku-pgs/plugin"

import { meta } from "../../config"

import { getImage } from "./__helpers__/getImage"
import { getParamComic } from "./__helpers__/getParamComic"

export default function (html: string): readonly {
  readonly route: {
    name: "comic"
    params: {
      sourceId: string
      comic: string
    }
  }
  readonly name: string
  readonly image: string
  readonly last_chapter: string
  readonly othername: string
  readonly tags: string[]
}[] {
  const $ = parseDom(html)

  return $("li")
    .toArray()
    .map((item) => {
      const $item = $(item)

      const route: {
        name: "comic"
        params: {
          sourceId: string
          comic: string
        }
      } = {
        name: "comic",
        params: {
          sourceId: meta.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          comic: getParamComic(parsePath($item.find("a").attr("href")!)),
        },
      }

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
      return { route, name, image, last_chapter, othername, tags }
    })
}
