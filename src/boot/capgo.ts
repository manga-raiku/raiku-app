import { CapacitorUpdater } from "@capgo/capacitor-updater"

export const notifyAppReady = CapacitorUpdater.notifyAppReady()

// void CapacitorUpdater.addListener("updateAvailable", async (res) => {
//   try {
//     const { value } = await Dialog.confirm({
//       title: "Update Available",
//       message: `Version ${res.bundle.version} is available. Would you like to update now?`
//     })

//     if (value) void CapacitorUpdater.set(res.bundle)
//   } catch (error) {
//     console.log(error)
//   }
// })
