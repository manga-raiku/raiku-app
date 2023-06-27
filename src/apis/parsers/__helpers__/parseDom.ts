import { load } from "cheerio"
import { parseDocument } from "htmlparser2"

export function parseDom(html: string) {
  return load(parseDocument(html))
}
