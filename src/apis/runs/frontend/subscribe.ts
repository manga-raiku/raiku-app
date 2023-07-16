export default async function subscribe(id: string) {
  const { data } = await post(`/frontend/user/regiter-subscribe`, { id })

  return data === "1"
}
