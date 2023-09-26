import { parseAnchor, parseDom } from "raiku-pgs/plugin"

export default function (html: string) {
  const $ = parseDom(html)

  return (
    $("a")
      .toArray()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((item) => parseAnchor($(item))!)
  )
}
