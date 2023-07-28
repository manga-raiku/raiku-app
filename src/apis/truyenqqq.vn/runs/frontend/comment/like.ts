export default async function like(id: number) {
  const { data } = await post("/frontend/comment/like", {
    id,
  })

  return JSON.parse(data).success === 1
}
