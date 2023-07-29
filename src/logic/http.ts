import type { GetOption } from "client-ext-animevsub-helper"
import { Http } from "client-ext-animevsub-helper"
import { i18n } from "src/boot/i18n"

const noExt = () =>
  Promise.reject(
    Object.assign(
      new Error(
        i18n.global.t(
          "trang-web-can-extension-animevsub-helper-de-hoat-dong-binh-thuong"
        )
      ),
      { extesionNotExists: true }
    )
  )

async function httpGet(
  url: string | GetOption,
  headers?: Record<string, string>
) {
  console.log("get: ", url)

  const response = await Http.get(
    typeof url === "object"
      ? url
      : {
          url: url + "#nettruyen",
          headers,
        }
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
  headers?: Record<string, string>
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

export const get = Http.version ? httpGet : noExt
export const post = Http.version ? httpPost : noExt
