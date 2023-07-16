import { PostWorker } from "../../../wrap-worker"

export default async function like(id: string) {
  const { data } = await post(`/frontend/comment/like`, {
    id,
  })

  return JSON.parse(data).success === 1
}
