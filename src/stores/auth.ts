import type { Session, UserAttributes } from "@supabase/supabase-js"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth-spb", () => {
  const session = shallowRef<Session | null>(null)
  const user = computed(() => session.value?.user ?? null)
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
  async function updatePassword(nonce: string, password: string) {
    return await supabase.auth.updateUser({
      password,
      nonce,
    })
  }
  async function updateUser(row: Omit<UserAttributes, "password">) {
    return await supabase.auth.updateUser(row)
  }

  return {
    session,
    user,
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
  }
})
