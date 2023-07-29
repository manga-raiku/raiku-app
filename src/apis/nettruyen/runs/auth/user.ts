import { API_CURL } from "../../const";

export default async function (token: string) {
  const { data } = await post(
    `${API_CURL}/Comic/Services/ComicService.asmx/CheckAuth`,
    {},
    {
      cookie: `.ASPXAUTH=${token}`,
    }
  )

  const $data = JSON.parse(data)

  return {
    uid: $data.userGuid as string,
    avatar: $data.avatar as string,
    token:$data.token as string,
    name: $data.fullName as string,
    email: $data.email as string | null,
    readToken: $data.readToken as string
  }
}
