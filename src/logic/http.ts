import type { GetOption } from "client-ext-animevsub-helper"
import { Http } from "client-ext-animevsub-helper"

async function httpGet(
  url: string | GetOption,
  headers?: Record<string, string>,
) {
  console.log("get: ", url)

  const response = await Http.get(
    typeof url === "object"
      ? url
      : {
          url: url + "#nettruyen",
          headers,
        },
  ).then((response) => {
    if (response.status === 403 || response.status === 520) {
      console.log("response fail")
    }

    return response
  })

  console.log("get-result: ", response)
  // eslint-disable-next-line functional/no-throw-statement
  if (response.status !== 200 && response.status !== 201) throw response

  return response as Omit<typeof response, "data"> & { data: string }
}

async function httpPost(
  url: string,
  data: string | Record<string, number | string | boolean>,
  headers?: Record<string, string>,
) {
  console.log("post: ", {
    url,
    data,
    headers,
  })

  const response = await Http.post({
    url: url + "#nettruyen",
    headers,
    data,
  })

  console.log("post-result: ", response)
  // eslint-disable-next-line functional/no-throw-statement
  if (response.status !== 200 && response.status !== 201) throw response

  return response as Omit<typeof response, "data"> & { data: string }
}

export function proxyGet(
  url: string | GetOption,
  headers?: Record<string, string>,
): ReturnType<typeof httpGet> {
  return fetch(
    `https://corsproxy.io/?${encodeURIComponent(
      typeof url === "string" ? url : url.url,
    )}`,
    {
      headers: new Headers(headers ?? (url as GetOption)?.headers),
    },
  ).then(async (res) => {
    return {
      data: await res.text(),
      status: res.status,
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries(),
      ]),
      url: res.url,
    }
  })
}

export function proxyPost(
  url: string,
  data: string | Record<string, number | string | boolean>,
  headers?: Record<string, string>,
): ReturnType<typeof httpPost> {
  return fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
    method: "post",
    headers: new Headers(headers),
    body:
      typeof data === "string"
        ? data
        : Object.entries(data).reduce((form, [key, value]) => {
            form.set(key, value + "")
            return form
          }, new FormData()),
  }).then(async (res) => {
    return {
      data: await res.text(),
      status: res.status,
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries(),
      ]),
      url: res.url,
    }
  })
}

export const get = Http.version ? httpGet : proxyGet
export const post = Http.version ? httpPost : proxyPost
