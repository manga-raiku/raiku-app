/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { listen, ping, put } from "@fcanvas/communicate"
import type { GetOption } from "client-ext-animevsub-helper"

import type { API, ComicChapter, FetchGet, FetchPost } from "../../../API"
import type { ListenerThread } from "../../create-worker-plugin"
import { parseDom } from "../../parseDom"
ping(self, "load")

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, functional/no-mixed-type
export type ListenerWorker = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: (type: string, args: any[]) => any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (type: string) => any
  "servers:has": (conf: ComicChapter) => readonly {
    readonly id: number
    readonly name: string
  }[]
  "servers:parse": (id: number, conf: ComicChapter) => readonly string[]
  setup: API["setup"]
}

Object.assign(self, { parseDom })

const get: FetchGet<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "get">(self, "get", options)
}
const post: FetchPost<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "post">(self, "post", options)
}
const setReferrers: ListenerThread["setReferrers"] = (referrers) => {
  return put<ListenerThread, "setReferrers">(self, "setReferrers", referrers)
}

Object.assign(self, { get, post, setReferrers })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(self as unknown as any).__DEFINE_API__) {
  listen<ListenerWorker, "api">(
    self,
    "api",
    () => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        'The code may not contain "defineApi" or something has broken this data structure.'
      )
    },
    { debug: __DEBUG__ }
  )
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = new ((self as unknown as any).__DEFINE_API__ as typeof API)()

  listen<ListenerWorker, "api">(
    self,
    "api",
    (type, args) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api as unknown as any)[type].apply(api, args)
    },
    { debug: __DEBUG__ }
  )
  listen<ListenerWorker, "get">(
    self,
    "get",
    (type) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api as unknown as any)[type] // no limit function
    },
    { debug: __DEBUG__ }
  )
  listen<ListenerWorker, "servers:has">(
    self,
    "servers:has",
    (conf) => {
      return api.Servers.filter((server) => server.has(conf)).map(
        ({ name }, id) => ({ id, name })
      )
    },
    { debug: __DEBUG__ }
  )
  listen<ListenerWorker, "servers:parse">(
    self,
    "servers:parse",
    (id: number, conf) => api.Servers[id].parse(conf),
    { debug: __DEBUG__ }
  )
  listen<ListenerWorker, "setup">(self, "setup", () => api.setup(), {
    debug: __DEBUG__
  })
}
