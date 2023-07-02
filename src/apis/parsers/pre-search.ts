import { parseDom } from "./__helpers__/parseDom"
import { parsePath } from "./__helpers__/parsePath"

export default function presearch(html: string) {
  const $ = parseDom(html)

  return $("li > a")
    .toArray()
    .map((item) => {
      const $item = $(item)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = parsePath($item.attr("href")!)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const image = $item.find("img").attr("src")!
      const name = $item.find(".name").text()
      const othername = $item.find(".othername").text()
      const chapter = $item.find(".search_info p:eq(2)").text()

      return { path, image, name, othername, chapter }
    })
}
