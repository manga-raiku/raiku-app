// eslint-disable-next-line camelcase
export default async function like(id: number, book_id: number) {
  const { data } = await post("/frontend/comment/remove", {
    id,
    // eslint-disable-next-line camelcase
    book_id,
  })

  return JSON.parse(data).success === 1
}
