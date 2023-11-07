import { defineStore } from "pinia"

export const useStateStore = defineStore("state", () => {
  const showPluginManagerDialog = ref(false)
  const showPluginAddDialog = ref(false)
  const showPluginSelectDialog = ref(false)

  const showProxyManagerDialog = ref(false)
const showProxyAddDialog = ref(false)

  return {
    showPluginManagerDialog,
    showPluginAddDialog,
    showPluginSelectDialog,

    showProxyManagerDialog,
    showProxyAddDialog
  }
})
