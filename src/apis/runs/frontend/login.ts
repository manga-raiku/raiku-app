export default async function login(email: string, password: string) {
  const { data } = await post("/frontend/public/login", {
    email,
    password,
    expire: "1",
  })

  const json = JSON.parse(data)

  if (json.status === 0) throw new Error(json.error)
  
  return {
    cookie: new Headers(headers).get("set-cookie")!,
  }
}
