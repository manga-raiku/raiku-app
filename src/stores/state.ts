import { defineStore } from "pinia"

export const useStateStore = defineStore("state", () => {
  const showPluginManagerDialog = ref(false)
  const showPluginAddDialog = ref(false)
  const showPluginSelectDialog = ref(false)

  const showProxyManagerDialog = ref(false)
  const showProxyAddDialog = ref(false)

  const appFooterPrependRef = ref<HTMLDivElement>()

  return {
    showPluginManagerDialog,
    showPluginAddDialog,
    showPluginSelectDialog,

    showProxyManagerDialog,
    showProxyAddDialog,

    appFooterPrependRef
  }
})
