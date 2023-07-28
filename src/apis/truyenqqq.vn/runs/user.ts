import type Parse from "../parsers/user"
import Worker from "../workers/user?worker"
import { PostWorker } from "../wrap-worker"

export default async function (token: string) {
  const { data, headers } = await get("/quan-ly-tai-khoan.html", {
    cookie: `_qlg=${token}`,
  })

  return {
    ...(await PostWorker<typeof Parse>(Worker, data)),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cookie: new Headers(headers).get("set-cookie")!,
  }
}
