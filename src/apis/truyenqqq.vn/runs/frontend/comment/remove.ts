import { CURL } from "src/apis/truyenqqq.vn/const"

// eslint-disable-next-line camelcase
export default async function like(id: number, book_id: number) {
  const { data } = await post({
    url: `${CURL}/frontend/comment/remove`,
    data: {
      id,
      // eslint-disable-next-line camelcase
      book_id,
    },
  })

  return JSON.parse(data).success === 1
}
