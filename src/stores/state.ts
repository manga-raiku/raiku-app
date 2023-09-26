import { defineStore } from "pinia"

export const useStateStore = defineStore("state", () => {
  const showPluginManagerDialog = ref(false)
  const showPluginAddDialog = ref(false)
  const showPluginSelectDialog = ref(false)

  return {
    showPluginManagerDialog,
    showPluginAddDialog,
    showPluginSelectDialog,
  }
})
