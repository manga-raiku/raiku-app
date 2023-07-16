export default async function regiterLike(id: string) {
  const { data } = await post(`/frontend/user/regiter-like`, { id })

  return JSON.parse(data).success === 1
}
