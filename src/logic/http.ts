import { CapacitorHttp as NativeHttp } from "@capacitor/core"
import type { GetOption, PostOption } from "client-ext-animevsub-helper"
import { Http } from "client-ext-animevsub-helper"

type Response<Type extends GetOption["responseType"]> = Omit<
  Awaited<ReturnType<typeof Http.get>>,
  "data"
> & {
  data: Type extends "json"
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : Type extends "arraybuffer"
    ? ArrayBuffer
    : string
}

// ======= Http for extension =========
async function httpGet<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  console.log("GET: ", options)

  const response = await Http.get(options).then((response) => {
    if (response.status === 403 || response.status === 520) {
      console.log("response fail")
    }

    return response
  })

  console.log("RETURN GET: ", response)
  // eslint-disable-next-line functional/no-throw-statement
  if (response.status !== 200 && response.status !== 201) throw response

  return response as Response<ReturnType>
}

async function httpPost<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<PostOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  console.log("GET: ", options)

  const response = await Http.post(options)

  console.log("RETURN POST: ", response)
  // eslint-disable-next-line functional/no-throw-statement
  if (response.status !== 200 && response.status !== 201) throw response

  return response as Response<ReturnType>
}
// ======= /Http for extension ========

// ======= Http for proxy ========
// Proxy: https://corsproxy.io/
let proxyStore: ReturnType<typeof useProxyStore>
function proxyGet<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  proxyStore ??= useProxyStore()
  const config = proxyStore.resolution(options)

  return fetch(config.url, config).then(async (res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any
    switch (options.responseType) {
      case "arraybuffer":
        data = await res.arrayBuffer()
        break
      case "json":
        data = JSON.parse(await res.text())
        break
      default:
        data = await res.text()
    }
    return {
      data,
      status: res.status,
      headers: headersToObject(res.headers),
      url: res.url
    }
  })
}

function proxyPost<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<PostOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  proxyStore ??= useProxyStore()
  const config = proxyStore.resolution(options)

  return fetch(config.url, {
    method: "post",
    ...config,
    body:
      typeof config.data === "object"
        ? Object.entries(config.data).reduce((form, [name, value]) => {
            form.set(name, value + "")
            return form
          }, new FormData())
        : config.data
  }).then(async (res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any
    switch (options.responseType) {
      case "arraybuffer":
        data = await res.arrayBuffer()
        break
      case "json":
        data = JSON.parse(await res.text())
        break
      default:
        data = await res.text()
    }
    return {
      data,
      status: res.status,
      headers: headersToObject(res.headers),
      url: res.url
    }
  })
}
// ======= /Http for proxy ========

// ======= Http for native ========
function nativeGet<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return NativeHttp.get(options).then((response) => {
    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status < 301 &&
      response.status > 304
    )
      // eslint-disable-next-line functional/no-throw-statement
      throw response
    if (options.responseType !== "json" && typeof response.data === "object")
      response.data = JSON.stringify(response.data)
    return response
  })
}
function nativePost<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return NativeHttp.post(options).then((response) => {
    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status < 301 &&
      response.status > 304
    )
      // eslint-disable-next-line functional/no-throw-statement
      throw response
    if (options.responseType !== "json" && typeof response.data === "object")
      response.data = JSON.stringify(response.data)
    return response
  })
}
// ======= /Http for native ========

export function get<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  if (APP_NATIVE_MOBILE || APP_INFO.extension) {
    proxyStore ??= useProxyStore()
  }

  if (APP_NATIVE_MOBILE && proxyStore.useNativeAPI) return nativeGet(options)
  if (APP_INFO.extension && proxyStore.useExtAPI) return httpGet(options)

  return proxyGet(options)
}
export function post<ReturnType extends GetOption["responseType"] | undefined>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  if (APP_NATIVE_MOBILE || APP_INFO.extension) {
    proxyStore ??= useProxyStore()
  }

  if (APP_NATIVE_MOBILE && proxyStore.useNativeAPI) return nativePost(options)
  if (APP_INFO.extension && proxyStore.useExtAPI) return httpPost(options)

  return proxyPost(options)
}
