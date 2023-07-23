import type Parse from "../parsers/user"
import Worker from "../workers/user?worker"
import { PostWorker } from "../wrap-worker"

export default async function (token: string) {
  const { data } = await get("/quan-ly-tai-khoan.html", {
    cookie: `_qlg=${token}`,
  })

  return {
    ...(await PostWorker<typeof Parse>(Worker, data)),
    cookie: new Headers(headers).get("set-cookie")!,
  }
}
