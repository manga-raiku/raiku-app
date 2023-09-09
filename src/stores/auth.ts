import type { Session, UserAttributes } from "@supabase/supabase-js"
import type { Database } from "app/database"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth-spb", () => {
  const session = shallowRef<Session | null>(null)
  let controllerUpdateProfile: AbortController | null = null
  const profile = computedAsync<
    Database["public"]["Tables"]["profiles"]["Row"] | null
  >(
    async (onCleanup) => {
      onCleanup(() => {
        controllerUpdateProfile?.abort()
        controllerUpdateProfile = null
      })
      controllerUpdateProfile?.abort()
      controllerUpdateProfile = null
      if (session.value) {
        controllerUpdateProfile = new AbortController()

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.value.user.id)
          .abortSignal(controllerUpdateProfile.signal)
          .single()

        // eslint-disable-next-line functional/no-throw-statement
        if (error) throw error

        return data
      }
      return null
    },
    null,
    { lazy: true, onError: (err) => console.warn(err) },
  )

  const setup = ref<Promise<void>>()
  setup.value = supabase.auth
    .getSession()
    // eslint-disable-next-line no-void
    .then((res) => void (session.value = res.data.session))
    .finally(() => {
      setup.value = undefined
    })
  supabase.auth.onAuthStateChange((event, ses) => {
    session.value = ses
  })

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  }
  async function signInOAuth2(provider: "google" | "twitter") {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.href,
      },
    })
  }
  async function signOut() {
    return supabase.auth.signOut()
  }
  async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password })
  }
  async function resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.protocol}://${location.pathname}/update-password`,
    })
  }
  async function setNewPassword(password: string) {
    return await supabase.auth.updateUser({
      password,
    })
  }
  async function sendNOnce() {
    return await supabase.auth.reauthenticate()
  }
  async function updatePassword(password: string) {
    return await supabase.auth.updateUser({
      password,
    })
  }
  async function updateUser(row: Omit<UserAttributes, "password">) {
    return await supabase.auth.updateUser(row)
  }

  async function assert() {
    await setup.value
    // eslint-disable-next-line functional/no-throw-statement
    if (!session.value) throw new Error("need_login")

    return session.value
  }

  return {
    session,
    profile,
    setup,

    signIn,
    signInOAuth2,
    signOut,
    signUp,
    resetPassword,
    setNewPassword,
    sendNOnce,
    updatePassword,
    updateUser,

    assert,
  }
})
