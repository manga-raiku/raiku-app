// Import the functions you need from the SDKs you need
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics"
import { boot } from "quasar/wrappers"

if (!APP_NATIVE_MOBILE)
  void FirebaseAnalytics.initializeFirebase(
    JSON.parse(process.env.FIREBASE_CONFIG)
  )

export const logEvent = FirebaseAnalytics.logEvent
export const setScreenName = FirebaseAnalytics.setScreenName
export const setUserProperty = FirebaseAnalytics.setUserProperty
export const setUserId = FirebaseAnalytics.setUserId

export default boot(({ router }) => {
  router.afterEach((to, from) => {
    if (to.path === from.path) return

    void setScreenName({ screenName: to.name?.toString() ?? to.path })

    // screen view
    void logEvent({
      name: "screen_view",
      params: {
        ...to,
        screen_name: to.name?.toString() ?? to.path
      }
    })

    // page view
    void logEvent({
      name: "page_view",
      params: {
        ...to,
        page_title: to.name?.toString() ?? to.path,
        page_path: to.path,
        page_location: window.location?.href,
        send_page_view: true
      }
    })
  })
})
