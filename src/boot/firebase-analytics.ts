// Import the functions you need from the SDKs you need
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics"
import { boot } from "quasar/wrappers"

if (APP_NATIVE_MOBILE)
  void FirebaseAnalytics.initializeFirebase(
    JSON.parse(process.env.FIREBASE_CONFIG)
  )

export const logEvent = FirebaseAnalytics.logEvent
export const setScreenName = FirebaseAnalytics.setScreenName
export const setUserProperty = FirebaseAnalytics.setUserProperty
export const setUserId = FirebaseAnalytics.setUserId

export default boot(({ router }) => {
  router.afterEach((to) => {
    void setScreenName({ screenName: to.name?.toString() ?? to.path })
  })
})
