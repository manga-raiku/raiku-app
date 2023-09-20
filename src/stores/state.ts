import { defineStore } from 'pinia';

export const useStateStore = defineStore('state', () => {
  const showPluginManagerDialog = ref(false)

  return { showPluginManagerDialog }
})
