/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { listen, ping, put } from "@fcanvas/communicate"
import type { GetOption } from "client-ext-animevsub-helper"

import type { API, FetchGet, FetchPost } from "../../../API"
import type { ListenerThread } from "../../create-worker-plugin"
import { parseDom } from "../../parseDom"

ping(self, "load")

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ListenerWorker = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: (type: string, args: any[]) => any[]
}

Object.assign(self, { parseDom })

const get: FetchGet<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "get">(self, "get", options)
}
const post: FetchPost<GetOption["responseType"]> = (options) => {
  return put<ListenerThread, "post">(self, "post", options)
}

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
}
