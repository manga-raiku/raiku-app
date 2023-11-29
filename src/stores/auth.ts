import { App } from "@capacitor/app"
import { Browser } from "@capacitor/browser"
import type {
  AuthResponse,
  OAuthResponse,
  Session,
  UserAttributes
} from "@supabase/supabase-js"
import { AuthError } from "@supabase/supabase-js"
import type { Database } from "app/database"
import { packageName } from "app/package.json"
import { defineStore } from "pinia"
import { AuthError as AuthErrorApp } from "src/errors/auth"

function openCenteredPopup(url: string, title: string, w: number, h: number) {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop

  const popup = window.open(
    url,
    title,
    `target=_blank,popup=yes,toolbar=0,menubar=0,location=0,width=${
      w / systemZoom
    },height=${h / systemZoom},top=${top},left=${left}`
  )

  if (document.hasFocus()) popup?.focus()

  return popup
}

export const useAuthStore = defineStore("auth", () => {
  if (APP_NATIVE_MOBILE) {
    const router = useRouter()

    void App.addListener("appUrlOpen", async ({ url }) => {
      const [path, hash] = url.slice(url.indexOf("://") + 3).split("#", 2)

      switch (path) {
        case "forgot-password": {
          const query = new URLSearchParams(hash)
          const result = await supabase.auth.setSession({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            access_token: query.get("access_token")!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            refresh_token: query.get("refresh_token")!
          })

          if (result.error) WARN(result)
          else void router.push(`/app/forgot-password?next#${hash}`)

          break
        }
      }
    })
  }

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
    { lazy: true, onError: WARN }
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
      password
    })
  }
  async function signInOAuth2(
    provider: "google" | "twitter"
  ): Promise<OAuthResponse | AuthResponse> {
    if (!APP_NATIVE_MOBILE) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${location.protocol}//${location.host}/app/oauth2`,
            skipBrowserRedirect: true
          }
        })

        if (error) return resolve({ data, error })

        const popup = openCenteredPopup(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          data.url!,
          `Login with OAuth 2 ${data.provider}`,
          600,
          700
        )
        const handler = async (
          event: MessageEvent<{
            type: "popup:oauth->authorized"
            refresh_token: string
          }>
        ) => {
          console.log(event)
          if (event.data?.type === "popup:oauth->authorized") {
            clean()

            const session = await supabase.auth.getSession()
            const user = await supabase.auth.getUser()

            if (session.data)
              resolve({
                data: {
                  session: session.data.session,
                  user: user.data.user
                },
                error: null
              })
            else
              resolve({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: null as unknown as any,
                error: new AuthError("Unknown error", 210)
              })
          }
        }
        const popupTick = setInterval(() => {
          if (!popup || popup.closed) {
            clean()
            resolve({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: null as unknown as any,
              error: new AuthError("Login OAuth canceled by user.", 209)
              //   name: "canceled_by_user",
              //   __isAuthError: true,
              // }
            })
          }
        }, 500)
        const clean = () => {
          window.removeEventListener("message", handler)
          clearInterval(popupTick)
          popup?.close()
        }

        window.addEventListener("message", handler)
      })
    }

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let removeListenAppUrlOpen: () => void
      let removeListenBrowserFinished: () => void
      try {
        removeListenAppUrlOpen = await App.addListener(
          "appUrlOpen",
          async ({ url }) => {
            try {
              const [path, hash] = url
                .slice(url.indexOf("://") + 3)
                .split("#", 2)

              switch (path) {
                case "auth": {
                  const query = new URLSearchParams(hash)
                  removeListenAppUrlOpen()
                  removeListenBrowserFinished()
                  void Browser.close()
                  const result = await supabase.auth.setSession({
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    access_token: query.get("access_token")!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    refresh_token: query.get("refresh_token")!
                  })

                  resolve(result)
                  break
                }
              }
            } catch (err) {
              removeListenAppUrlOpen()
              removeListenBrowserFinished()
              void Browser.close()
              reject(err)
            }
          }
        ).then((res) => res.remove)
        removeListenBrowserFinished = await Browser.addListener(
          "browserFinished",
          () => {
            removeListenAppUrlOpen()
            removeListenBrowserFinished()
            resolve({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: null as unknown as any,
              error: new AuthError("Login OAuth canceled by user.", 209)
              //   name: "canceled_by_user",
              //   __isAuthError: true,
              // }
            })
          }
        ).then((res) => res.remove)

        const { data } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            skipBrowserRedirect: true,
            redirectTo: `${packageName}://auth`
          }
        })

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await Browser.open({ url: data.url! })
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        removeListenAppUrlOpen!()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        removeListenBrowserFinished!()
        void Browser.close()
        reject(err)
      }
    })
  }
  async function signOut() {
    return supabase.auth.signOut()
  }
  async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password })
  }
  async function resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: APP_NATIVE_MOBILE
        ? `${packageName}://forgot-password`
        : `${location.protocol}//${location.host}?app/forgot-password?next`
    })
  }
  async function setNewPassword(password: string) {
    return await supabase.auth.updateUser({
      password
    })
  }
  async function sendNOnce() {
    return await supabase.auth.reauthenticate()
  }
  async function updatePassword(password: string) {
    return await supabase.auth.updateUser({
      password
    })
  }
  async function updateUser(row: Omit<UserAttributes, "password">) {
    return await supabase.auth.updateUser(row)
  }

  async function assert() {
    await setup.value
    // eslint-disable-next-line functional/no-throw-statement
    if (!session.value) throw new AuthErrorApp(AuthErrorApp.Code.REQUIRED_LOGIN)

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

    assert
  }
})
