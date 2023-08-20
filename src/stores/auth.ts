/* eslint-disable camelcase */

import cookie from "js-cookie"
import { defineStore } from "pinia"
import Login from "src/apis/nettruyen/runs/auth/login"
import GetUser from "src/apis/nettruyen/runs/auth/user"

interface User {
  userGuid: string
  avatar: string
  token: string
  fullName: string
  email: string | null
  readToken: string
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref(cookie.get("token") ?? (null as null | string))
  const user_data = ref(parseJSON(cookie.get("user_data")) as null | User)

  const isLogged = computed(() => {
    return !!token.value || !!user_data.value
  })

  if (token.value)
    // eslint-disable-next-line promise/catch-or-return, promise/always-return
    GetUser(token.value).then((data) => {
      setUser(data)
    })

  function setUser(value: User) {
    user_data.value = value
    cookie.set("user_data", JSON.stringify(value), {
      expires: 30,
      sameSite: "None",
      secure: true,
    })
  }
  function setToken(value: string) {
    token.value = value
    cookie.set("token", value, {
      expires: 30,
      sameSite: "None",
      secure: true,
    })
  }
  function deleteUser() {
    user_data.value = null
    cookie.set("user_data", "", { expires: -1 })
  }
  function deleteToken() {
    token.value = null
    cookie.set("token", "", { expires: -1 })
  }
  function setTokenByCookie(cookie: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = cookie.match(/\.ASPXAUTH=([^";]+)/)![1]
    // set token
    setToken(token)
    return token
  }
  // ** actions **
  async function login(email: string, password: string) {
    const data = await Login(email, password)
    setTokenByCookie(data.cookie)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await GetUser(token.value!)

    setUser(user)

    return user
  }
  async function logout() {
    deleteToken()
    deleteUser()
  }

  return {
    user_data,
    token,
    isLogged,
    login,
    logout,
    setUser,
  }
})

function parseJSON(value?: string) {
  if (!value) return null

  try {
    return JSON.parse(value) ?? null
  } catch {
    return null
  }
}
