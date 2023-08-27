import type { Session, UserAttributes } from "@supabase/supabase-js"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth-spb", () => {
  const session = shallowRef<Session | null>(null)
  const user = computed(() => session.value?.user ?? null)
  // eslint-disable-next-line promise/catch-or-return
  supabase.auth.getSession().then((res) => (session.value = res.data.session))
  supabase.auth.onAuthStateChange((event, ses) => {
    session.value = ses
  })

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }
  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  }
  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) throw error
    return data
  }
  async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.protocol}://${location.pathname}/update-password`,
    })

    if (error) throw error
    return data
  }
  async function setNewPassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) throw error
    return data
  }
  async function sendNOnce() {
    const { data, error } = await supabase.auth.reauthenticate()

    if (error) throw error
    return data
  }
  async function updatePassword(nonce: string, password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
      nonce,
    })

    if (error) throw error
    return data
  }
  async function updateUser(row: Omit<UserAttributes, "password">) {
    const { data, error } = await supabase.auth.updateUser(row)

    if (error) throw error
    return data
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
