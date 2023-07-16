import { PostWorker } from "../../../wrap-worker"

export default async function like(id: string, book_id: string) {
  const { data } = await post(`/frontend/comment/remove`, {
    id,
    book_id,
  })

  return JSON.parse(data).success === 1
}
