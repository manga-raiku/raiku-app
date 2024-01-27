import { listen, put } from "@fcanvas/communicate"
import { setReferrers } from "client-ext-animevsub-helper"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"

import type { API, AppInfo, ComicChapter, FetchGet, FetchPost } from "../API"

import type { ListenerWorker } from "./private/code/append-worker-plugin-mjs"
import appendWorkerPluginMjs from "./private/code/append-worker-plugin-mjs?braw"

const EXPIRES_WAIT_WORKER = 60_000 // 60s

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ListenerThread = {
  get: FetchGet<GetOption["responseType"]>
  post: FetchPost<PostOption["responseType"]>
  setReferrers: typeof setReferrers
}

type AsyncRecord<T extends API> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : Promise<T[K]>
}

interface APIPorted extends Omit<AsyncRecord<API>, "Servers"> {
  "servers:has": (
    conf: ComicChapter
  ) => Readonly<{ id: number; name: string }[]>
  "servers:parse": (id: number, conf: ComicChapter) => readonly string[]
  destroy: () => void
}

class WorkerSession {
  private worker: Worker | null = null
  private timeoutAutoDestroy: NodeJS.Timeout | number | null = null

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly code: string,
    private readonly get: FetchGet<GetOption["responseType"]>,
    private readonly post: FetchPost<PostOption["responseType"]>,
    private readonly devMode: boolean,
    private readonly AppInfo: AppInfo
  ) {}

  public async createWorker() {
    if (this.worker) {
      console.warn("[worker-plugin]: This session's worker already exists.")
      return this.worker
    }

    // setup port
    const codeWorker = `${
      this.devMode
        ? `self.AppInfo=${JSON.stringify(this.AppInfo)};${this.code}`
        : `!(()=>{self.AppInfo=${JSON.stringify(this.AppInfo)};${this.code}})()`
    };\n\n${appendWorkerPluginMjs.replace(
      /__DEBUG__/g,
      (__DEV__ || this.devMode) + ""
    )}`
    const url = URL.createObjectURL(
      new Blob([codeWorker], { type: "text/javascript" })
    )

    this.worker = new Worker(url, this.devMode ? { type: "module" } : undefined)
    this.worker.addEventListener("error", (error) => {
      console.error(error)
      this.destroy()
      URL.revokeObjectURL(url)
    })
    this.worker.addEventListener("messageerror", (event) => {
      console.error(event)
      this.destroy()
      URL.revokeObjectURL(url)
    })
    this.resetAutoDestroy()

    listen(
      this.worker,
      "load",
      () => {
        URL.revokeObjectURL(url)
      },
      { once: true }
    )
    listen<ListenerThread, "get">(
      this.worker,
      "get",
      async (options) => {
        const response = await this.get(options)

        if (response.data?.toString() === "[object ArrayBuffer]") {
          // transfer
          return {
            return: response,
            transfer: [response.data]
          }
        }

        return response
      },
      { debug: __DEV__ }
    )
    listen<ListenerThread, "post">(
      this.worker,
      "post",
      async (options) => {
        const response = await this.post(options)

        if (response.data?.toString() === "[object ArrayBuffer]") {
          // transfer
          return {
            return: response,
            transfer: [response.data]
          }
        }

        return response
      },
      { debug: __DEV__ }
    )
    listen<ListenerThread, "setReferrers">(
      this.worker,
      "setReferrers",
      setReferrers,
      { debug: __DEV__ }
    )

    await put<ListenerWorker, "setup">(this.worker, "setup")

    return this.worker
  }

  public async getWorker(): Promise<Worker> {
    if (!this.worker) return this.createWorker()
    return this.worker
  }

  public resetAutoDestroy() {
    if (this.timeoutAutoDestroy) clearTimeout(this.timeoutAutoDestroy)

    this.timeoutAutoDestroy = setTimeout(() => {
      this.timeoutAutoDestroy = null
      this.destroy()
    }, EXPIRES_WAIT_WORKER)
  }

  public destroy() {
    this.worker?.terminate()
    if (this.timeoutAutoDestroy) clearTimeout(this.timeoutAutoDestroy)
    this.timeoutAutoDestroy = null
    this.worker = null
  }
}

export function createWorkerPlugin(
  code: string,
  get: FetchGet<GetOption["responseType"]>,
  post: FetchPost<PostOption["responseType"]>,
  devMode: boolean,
  AppInfo: AppInfo
): APIPorted {
  const workerSession = new WorkerSession(code, get, post, devMode, AppInfo)

  const proxy = new Proxy({} as APIPorted, {
    get(_target, p) {
      if (p === "__v_skip") return true // mark raw for vue reactivity

      if (p === "toJSON") {
        console.warn("[worker-plugin]: toJSON called but can't control.")

        return () => "{}"
      }
      const worker = workerSession.getWorker()
      if (p === "Rankings")
        return worker.then((worker) =>
          put<ListenerWorker, "get">(worker, "get", p.toString())
        )
      if (p === "servers:has") {
        return async (conf: ComicChapter) =>
          put<ListenerWorker, "servers:has">(await worker, "servers:has", conf)
      }
      if (p === "servers:parse") {
        return async (id: number, conf: ComicChapter) =>
          put<ListenerWorker, "servers:parse">(
            await worker,
            "servers:parse",
            id,
            conf
          )
      }
      if (p === "catch" || p === "then" || p === "finally") return undefined
      if (p === "destroy") return workerSession.destroy.bind(workerSession)

      // eslint-disable-next-line functional/functional-parameters, @typescript-eslint/no-explicit-any
      return async (...args: any[]) =>
        put<ListenerWorker, "api">(await worker, "api", p.toString(), args)
    }
  })

  return proxy
}
