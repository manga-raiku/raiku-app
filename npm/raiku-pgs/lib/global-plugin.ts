import type { CheerioAPI } from "cheerio"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"

import type { FetchGet, FetchPost } from "./API"

declare global {
  // eslint-disable-next-line no-var
  var parseDom: (html: string) => CheerioAPI
  // eslint-disable-next-line no-var
  var get: FetchGet<GetOption["responseType"]>
  // eslint-disable-next-line no-var
  var post: FetchPost<PostOption["responseType"]>
}
