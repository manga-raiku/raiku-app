import { LocalNotifications } from "@capacitor/local-notifications"
import { i18n } from "boot/i18n"
import { Notify } from "quasar"
import type { PackageDisk } from "stores/plugin"

export const permissionNotification: Promise<void> = (async () => {
  if ((await LocalNotifications.checkPermissions()).display !== "granted") {
    return new Promise((resolve, reject) => {
      const requestPermissions = () =>
        LocalNotifications.requestPermissions()
          .then(() => resolve())
          .catch(reject)

      window.addEventListener("click", requestPermissions, { once: true })
    })
  }
})()

void LocalNotifications.addListener(
  "localNotificationActionPerformed",
  async (action) => {
    if (action.notification.extra?.type === "update_plugin") {
      const { id } = action.notification.extra.data as Omit<
        PackageDisk,
        "plugin"
      >

      // const stateStore = useStateStore()
      const pluginStore = usePluginStore()

      console.log("[notify click]: user request update plugin %s", id)

      // stateStore.showPluginManagerDialog = true

      const r = await pluginStore.updatePlugin(id)

      if (r)
        void Notify.create({
          message: i18n.global.t("da-cap-nhat-plugin-r-name", [r.name])
        })
    }
  }
)
