import { PostWorker } from "raiku-pgs"

import type Parse from "../parsers/user"
import Worker from "../workers/user?worker&inline"

import { CURL } from "./../const"

export default async function (token: string) {
  const { data, headers } = await get({
    url: `${CURL}/quan-ly-tai-khoan.html`,
    headers: {
      cookie: `_qlg=${token}`,
    },
  })

  return {
    ...(await PostWorker<typeof Parse>(Worker, data)),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cookie: new Headers(headers).get("set-cookie")!,
  }
}
