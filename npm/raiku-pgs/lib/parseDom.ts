import type { CheerioAPI } from "cheerio"

declare global {
  // eslint-disable-next-line no-var
  var parseDom: (html: string) => CheerioAPI
}
