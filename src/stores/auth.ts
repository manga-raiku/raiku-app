/* eslint-disable camelcase */

import cookie from "js-cookie"
import { defineStore } from "pinia"
import { parse } from "set-cookie-parser"
import { computed, nextTick, ref, toRaw, watch } from "vue"
import cookie from 'js-cookie'
import GetUser from "src/apis/runs/user"
import Login from "src/apis/runs/frontend/login"

interface User {
  avatar?: string
  email: string // const
  last_name: string
  first_name:string
  sex: string | null
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref(cookie.get("token") ?? null as null | string)
  const user_data = ref(parseJSON(cookie.get("user_data")) as null | User)

  const isLogged = computed(() => {
    return !!token.value && !!user_data.value
  })

  if (token_name.value && token_value.value)
    // eslint-disable-next-line promise/catch-or-return, promise/always-return
    GetUser(token.value).then((data) => {
      setUser({
        avatar: data.avatar,
        email: data.email,
        last_name: data.last_name,
        first_name: data.first_name,
        sex: data.sex,
      })
      setTokenByCookie(data.cookie)
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
    token.value =
    cookie.set("token", "", { expires: -1 })
  }
  function setTokenByCookie(cookie: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = cookie
      .split(",")
      .map((item) => parse(item))
      .flat(1)
      .find((item) => item.name === "_qlg")!
    // set token
    setToken(token.value)
    return token
  }
  // ** actions **
  async function login(email: string, password: string) {
    const data = await Login(email, password)

    setUser({
      avatar: data.avatar,
      email: data.email,
      last_name: data.last_name,
      first_name: data.first_name,
      sex: data.sex,
    })
    setTokenByCookie(data.cookie)


    return data
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
