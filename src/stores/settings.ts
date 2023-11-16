import { defineStore } from "pinia"
import { getNavigatorLanguage } from "src/i18n"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    locale: getNavigatorLanguage(),
    suggestInstallApp: true,
    suggestInstallExt: true
  }),
  persist: true
})
