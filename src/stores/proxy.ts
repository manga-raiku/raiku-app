import { toReactive, useStorage } from "@vueuse/core"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"
import { defineStore } from "pinia"

interface ProxyInfo {
  readonly name: string | null
  readonly modeQuery: boolean
  readonly headers?: Record<string, string>
  readonly query?: Record<string, string>
  readonly body?: Record<string, string> | string
}

export const useProxyStore = defineStore("proxy", () => {
  const proxies = toReactive(
    useStorage<Record<string, ProxyInfo>>("proxies", {
      "https://corsproxy.org": {
        name: null,
        modeQuery: true
      }
    })
  )
  const _enabled = useStorage<string>("proxy-enabled", "")
  const enabled = computed<string>({
    get: () =>
      _enabled.value in proxies ? _enabled.value : Object.keys(proxies)[0],
    set: (value) => (_enabled.value = value)
  })

  if (import.meta.env.DEV)
    watchEffect(() => {
      if (enabled.value in proxies === false) {
        console.warn("[Proxy]: proxy enabled removed!")
      }
    })

  function has(url: string) {
    return new URL(url).toString() in proxies
  }
  function add(url: string, proxy: ProxyInfo) {
    proxies[new URL(url).toString()] = proxy
  }
  function remove(url: string) {
    return delete proxies[new URL(url).toString()]
  }

  function enable(url: string) {
    enabled.value = new URL(url).toString()
  }
  function get() {
    return enabled.value
  }
  function resolution(req: GetOption | PostOption) {
    const proxy = proxies[enabled.value]
    // const { name, headers , query , body }
    // merge headers
    req.headers =
      proxy.headers || req.headers
        ? {
            ...proxy.headers,
            ...req.headers
          }
        : undefined
    req.data =
      proxy.body || req.data
        ? {
            ...(typeof proxy.body === "string"
              ? Object.fromEntries(
                  Array.from(new URLSearchParams(proxy.body).entries())
                )
              : proxy.body),
            ...(typeof req.data === "string"
              ? Object.fromEntries(
                  Array.from(new URLSearchParams(req.data).entries())
                )
              : req.data)
          }
        : undefined

    let url = enabled.value
    let hasQuery = url.includes("?")
    if (proxy.query) {
      url +=
        (hasQuery ? "&" : "?") + new URLSearchParams(proxy.query).toString()
      hasQuery = true
    }

    if (proxy.modeQuery) {
      url +=
        (hasQuery ? "&" : "?") +
        `${proxy.name ?? ""}${proxy.name ? "=" : ""}${encodeURIComponent(
          req.url
        )}`
    } else {
      if (!req.data) req.data = {}
      req.data[enabled.value] = encodeURIComponent(req.url)
    }

    req.url = url
    return req
  }

  return { proxies, has, add, remove, enable, get, resolution }
})
