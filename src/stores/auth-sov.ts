import type { Session, UserAttributes } from "@supabase/supabase-js"
import { defineStore } from "pinia"

export const useAuthSpb = defineStore("auth-spb", () => {
  const session = shallowRef<Session | null>(null)
  const user = computed(() => session.value?.user ?? null)
  // eslint-disable-next-line promise/catch-or-return
  supabase.auth.getSession().then((res) => (session.value = res.data.session))
  supabase.auth.onAuthStateChange((event, ses) => {
    session.value = ses
  })

  function login(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  }
  function logout() {
    return supabase.auth.signOut()
  }
  function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }
  function resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.protocol}://${location.pathname}/update-password`,
    })
  }
  function setNewPassword(password: string) {
    return supabase.auth.updateUser({
      password,
    })
  }
  function sendNOnce() {
    return supabase.auth.reauthenticate()
  }
  async function updatePassword(nonce: string, password: string) {
    return supabase.auth.updateUser({
      password,
      nonce,
    })
  }
  async function updateUser(data: Omit<UserAttributes, "password">) {
    return supabase.auth.updateUser(data)
  }

  return {
    session,
    user,
    login,
    logout,
    signUp,
    resetPassword,
    setNewPassword,
    sendNOnce,
    updatePassword,
    updateUser,
  }
})
