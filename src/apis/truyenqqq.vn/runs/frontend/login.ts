export default async function login(email: string, password: string) {
  const { data, headers } = await post("/frontend/public/login", {
    email,
    password,
    expire: "1",
  })

  const json = JSON.parse(data)

  // eslint-disable-next-line functional/no-throw-statement
  if (json.status === 0) throw json.error

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cookie: new Headers(headers).get("set-cookie")!,
  }
}
