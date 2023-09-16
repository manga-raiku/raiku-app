import { CURL } from "../../const"

export default async function subscribe(id: number) {
  const { data } = await post({
    url: `${CURL}/frontend/user/regiter-subscribe`,
    data: { id },
  })

  return data === "1"
}
