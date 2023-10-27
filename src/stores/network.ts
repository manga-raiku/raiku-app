import { useNetwork } from "@vueuse/core"
import { defineStore } from "pinia"

export const useNetworkStore = defineStore("network", () => {
  const network = useNetwork()

  return network
})
