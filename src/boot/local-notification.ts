import { LocalNotifications } from "@capacitor/local-notifications"

export const permissionNotification: Promise<void> = (async () => {
  if ((await LocalNotifications.checkPermissions()).display !== "granted") {
    await LocalNotifications.requestPermissions()
  }
})()
