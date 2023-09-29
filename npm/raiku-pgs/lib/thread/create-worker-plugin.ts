import { listen, put } from "@fcanvas/communicate"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"

import type { API, ComicChapter, FetchGet, FetchPost } from "../API"

import type { ListenerWorker } from "./private/code/append-worker-plugin-mjs"
import appendWorkerPluginMjs from "./private/code/append-worker-plugin-mjs?braw"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ListenerThread = {
  get: FetchGet<GetOption["responseType"]>
  post: FetchPost<PostOption["responseType"]>
}

type AsyncRecord<T extends API> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : Promise<T[K]>
}

interface APIPorted extends Omit<AsyncRecord<API>, "Servers"> {
  "servers:has": (
    page: ComicChapter["pages"][0],
    conf: ComicChapter,
  ) => Readonly<{ id: number; name: string }[]>
  "servers:parse": (
    id: number,
    page: ComicChapter["pages"][0],
    conf: ComicChapter,
  ) => string
}

export function createWorkerPlugin(
  code: string,
  get: FetchGet<GetOption["responseType"]>,
  post: FetchPost<PostOption["responseType"]>,
): APIPorted {
  // setup port
  const codeWorker = `${code};${appendWorkerPluginMjs.replace(
    /process\.env\.DEV/g,
    process.env.DEV + "",
  )}`
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const url = URL.createObjectURL(
    new Blob([codeWorker], { type: "text/javascript" }),
  )

  const worker = new Worker(url, __DEV__ ? { type: "module" } : undefined)
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  listen(worker, "load", () => URL.revokeObjectURL(url), { once: true })
  listen<ListenerThread, "get">(
    worker,
    "get",
    async (options) => {
      const response = await get(options)

      if (response.data?.toString() === "[object ArrayBuffer]") {
        // transfer
        return {
          return: response,
          transfer: [response.data],
        }
      }

      return response
    },
    { debug: !!process.env.DEV },
  )
  listen<ListenerThread, "post">(
    worker,
    "post",
    async (options) => {
      const response = await post(options)

      if (response.data?.toString() === "[object ArrayBuffer]") {
        // transfer
        return {
          return: response,
          transfer: [response.data],
        }
      }

      return response
    },
    { debug: !!process.env.DEV },
  )

  const proxy = new Proxy({} as APIPorted, {
    get(_target, p) {
      if (p === "Rankings")
        return put<ListenerWorker, "get">(worker, "get", p.toString())
      if (p === "servers:has") {
        return (page: ComicChapter["pages"][0], conf: ComicChapter) =>
          put<ListenerWorker, "servers:has">(worker, "servers:has", page, conf)
      }
      if (p === "servers:parse") {
        return (
          id: number,
          page: ComicChapter["pages"][0],
          conf: ComicChapter,
        ) =>
          put<ListenerWorker, "servers:parse">(
            worker,
            "servers:parse",
            id,
            page,
            conf,
          )
      }
      if (p === "catch" || p === "then" || p === "finally") return undefined

      // eslint-disable-next-line functional/functional-parameters, @typescript-eslint/no-explicit-any
      return (...args: any[]) =>
        put<ListenerWorker, "api">(worker, "api", p.toString(), args)
    },
  })

  return proxy
}
