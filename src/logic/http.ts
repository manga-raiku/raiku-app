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

// Proxy: https://corsproxy.io/

export function proxyGet<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return fetch(
    `https://corsproxy.org/?${encodeURIComponent(options.url)}`,
    {
      headers: options.headers
    }
  ).then(async (res) => {
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
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries()
      ]),
      url: res.url
    }
  })
}

export function proxyPost<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<PostOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return fetch(
    `https://corsproxy.org/?${encodeURIComponent(options.url)}`,
    {
      method: "post",
      headers: options.headers,
      body:
        typeof options.data === "object"
          ? Object.entries(options.data).reduce((form, [name, value]) => {
              form.set(name, value + "")
              return form
            }, new FormData())
          : options.data
    }
  ).then(async (res) => {
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
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries()
      ]),
      url: res.url
    }
  })
}

export const get = Http.version ? httpGet : proxyGet
export const post = Http.version ? httpPost : proxyPost
