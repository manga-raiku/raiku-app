import type { CheerioAPI } from "cheerio"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"

import type { AppInfo, FetchGet, FetchPost } from "./API"
import type { ListenerThread } from "./thread/create-worker-plugin"

declare global {
  // eslint-disable-next-line no-var
  var parseDom: (html: string) => CheerioAPI
  // eslint-disable-next-line no-var
  var get: FetchGet<GetOption["responseType"]>
  // eslint-disable-next-line no-var
  var post: FetchPost<PostOption["responseType"]>
  // eslint-disable-next-line no-var
  var AppInfo: AppInfo
  // eslint-disable-next-line no-var
  var setReferrers: ListenerThread["setReferrers"]
}
