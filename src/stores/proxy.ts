import { toReactive, useStorage } from "@vueuse/core"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"
import { defineStore } from "pinia"

interface ProxyInfo {
  readonly name: string | null
  readonly modeQuery: boolean
  readonly headers?: Record<string, string>
  readonly query?: Record<string, string>
  readonly body?: Record<string, string> | string
  readonly encodeURI?: boolean
  readonly readonly?: boolean
}

const PROXIES_DEFAULT: Record<string, ProxyInfo> = {
  [new URL("https://corsproxy.org").toString()]: {
    name: null,
    modeQuery: true,
    encodeURI: true,
    readonly: true
  },
  [new URL("https://api.allorigins.win/raw").toString()]: {
    name: "url",
    modeQuery: true,
    encodeURI: true,
    readonly: true
  }
}

export const useProxyStore = defineStore("proxy", () => {
  const proxies = toReactive(
    useStorage<Record<string, ProxyInfo>>("proxies", {})
  )
  Object.assign(proxies, PROXIES_DEFAULT)
  const _enabled = useStorage<string>("proxy-enabled", "")
  const enabled = computed<string>({
    get: () =>
      _enabled.value in proxies ? _enabled.value : Object.keys(proxies)[0],
    set: (value) => (_enabled.value = value)
  })
  const useNativeAPI = useStorage<boolean>("use-native-api", APP_NATIVE_MOBILE)
  const useExtAPI = useStorage<boolean>("use-ext-api", APP_INFO.extension)

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
    const key = new URL(url).toString()
    if (proxies[key]?.readonly) return
    return delete proxies[key]
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
        `${proxy.name ?? ""}${proxy.name ? "=" : ""}${
          proxy.encodeURI ? encodeURIComponent(req.url) :encodeURI( req.url).replace(/\?/g, encodeURIComponent("?"))
        }`
    } else {
      if (!req.data) req.data = {}
      req.data[enabled.value] = encodeURIComponent(req.url)
    }

    req.url = url
    return req
  }

  async function getAllProxy() {
    return proxies
  }

  return {
    proxies,
    has,
    add,
    remove,
    enable,
    enabled,
    get,
    resolution,
    getAllProxy,
    useNativeAPI,
    useExtAPI
  }
})
