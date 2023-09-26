import { CURL } from "../const"
import Parse from "../parsers/index"

export default async function index() {
  const { data } = await get({
    url: CURL,
  })

  return Parse(data, Date.now())
}
