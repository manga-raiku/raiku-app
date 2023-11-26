import { LocalNotifications } from "@capacitor/local-notifications"

export const permissionNotification: Promise<void> = (async () => {
  if ((await LocalNotifications.checkPermissions()).display !== "granted") {
    const requestPermissions = async () =>
      await LocalNotifications.requestPermissions()
    window.addEventListener("click", requestPermissions, { once: true })
  }
})()
