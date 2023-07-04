import { parseDom } from "./__helpers__/parseDom"
import { parseItem } from "./__helpers__/parseItem"
import { parsePath } from "./__helpers__/parsePath"

export default function general(html: string, now: number) {
  const $ = parseDom(html)

  const name = $(".homepage_tags h1").text().trim()
  const description = $(".tags_detail").text().trim()

  const filter = $(".story-list-bl01 tr")
    .toArray()
    .map((item) => {
      const $item = $(item)

      const type = $item.find("th").text()
      const select = $item
        .find("select option")
        .toArray()
        .map((item) => {
          const $item = $(item)

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const path = parsePath($item.attr("value")!)
          const name = $item.text()
          return { path, name }
        })

      if (select.length === 0) {
        // eslint-disable-next-line functional/no-let
        let key = ""
        const items = $item
          .find(".choose a")
          .toArray()
          .map((item) => {
            const $item = $(item)

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [key$1, value] = [
              ...new URL(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ($item.attr("href")!),
                "http://localhost"
              ).searchParams.entries(),
            ].at(-1)!

            key = key$1
            const name = $item.text()

            return { value, name }
          })

        return { type, key, items }
      }

      return { type, select }
    })

  const items = $("#main_homepage .list_grid li")
    .toArray()
    .map((item) => parseItem($, $(item), now))

  const curPage = parseInt($(".page_redirect .active").text())
  const maxPage = parseInt(
    $(".page_redirect > *")
      .last()
      .attr("href")
      ?.match(/\/trang-(\d+)/)?.[1] ?? curPage + ""
  )

  return { name, description, filter, items, curPage, maxPage }
}
