/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { listen, ping, put } from "@fcanvas/communicate"
import type { GetOption } from "client-ext-animevsub-helper"

import type { API, ComicChapter, FetchGet, FetchPost } from "../../../API"
import type { ListenerThread } from "../../create-worker-plugin"
import { parseDom } from "../../parseDom"

ping(self, "load")

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ListenerWorker = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: (type: string, args: any[]) => any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (type: string) => any
  "servers:has": (
    page: ComicChapter["pages"][0],
    conf: ComicChapter,
  ) => readonly {
    readonly id: number
    readonly name: string
  }[]
  "servers:parse": (
    id: number,
    page: ComicChapter["pages"][0],
    conf: ComicChapter,
  ) => string
}

Object.assign(self, { parseDom })

const get: FetchGet<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "get">(self, "get", options)
}
const post: FetchPost<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "post">(self, "post", options)
}

Object.assign(self, { get, post })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(self as unknown as any).__DEFINE_API__) {
  listen<ListenerWorker, "api">(
    self,
    "api",
    () => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        'The code may not contain "defineApi" or something has broken this data structure.',
      )
    },
    { debug: !!process.env.DEV },
  )
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = new ((self as unknown as any).__DEFINE_API__ as typeof API)(
    get,
    post,
  )

  listen<ListenerWorker, "api">(
    self,
    "api",
    (type, args) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api as unknown as any)[type].apply(api, args)
    },
    { debug: !!process.env.DEV },
  )
  listen<ListenerWorker, "get">(self, "get", (type) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (api as unknown as any)[type] // no limit function
  })
  listen<ListenerWorker, "servers:has">(self, "servers:has", (page, conf) => {
    return api.Servers.filter((server) => server.has(page, conf)).map(
      ({ name }, id) => ({ id, name }),
    )
  })
  listen<ListenerWorker, "servers:parse">(
    self,
    "servers:parse",
    (id: number, page, conf) => api.Servers[id].parse(page, conf),
  )
}
