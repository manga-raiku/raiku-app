import { CURL } from "../../const"

export default async function regiterLike(id: number) {
  const { data } = await post({
    url: `${CURL}/frontend/user/regiter-like`,
    data: { id },
  })

  return JSON.parse(data).success === 1
}
