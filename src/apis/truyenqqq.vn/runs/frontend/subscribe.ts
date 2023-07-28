export default async function subscribe(id: number) {
  const { data } = await post("/frontend/user/regiter-subscribe", { id })

  return data === "1"
}
