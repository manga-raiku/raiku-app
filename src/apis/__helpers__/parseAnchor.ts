import type { Cheerio, Element } from "cheerio"

import { parsePath } from "./parsePath"

export function parseAnchor(anchor: Cheerio<Element>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const path = parsePath(anchor.attr("href")!)!
  const name = anchor.text().trim()

  return { path, name }
}
