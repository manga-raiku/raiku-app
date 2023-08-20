import { API_CURL } from "../../const"

export default async function (token: string) {
  const { data } = await post(
    `${API_CURL}/Comic/Services/ComicService.asmx/CheckAuth`,
    {},
    {
      cookie: `.ASPXAUTH=${token}`,
    },
  )

  const $data = JSON.parse(data) as {
    userGuid: string
    avatar: string
    token: string
    fullName: string
    email: string | null
    readToken: string
  }

  return $data
}
