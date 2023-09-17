import { CURL } from "../../../const"

export default async function like(id: number) {
  const { data } = await post({
    url: `${CURL}/frontend/comment/like`,
    data: {
      id,
    },
  })

  return JSON.parse(data).success === 1
}
