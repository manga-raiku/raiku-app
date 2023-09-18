import { defineStore } from "pinia"
import type { API } from "src/apis/API"

export const useCounterStore = defineStore("plugin", () => {
  const plugins = shallowReactive<
    {
      readonly plugin: API
      readonly hash: string
      readonly source: string
      installedAt: number
    }[]
  >([])

  function installPlugin(source: string) {
    // 🍀🍁🍂 The url representing the plugin must satisfy 2 requirements:
    // - It contains the file `plugin.sha256` (https://<url>/plugin.sha256) which is the `SHA-256` hash of the plugin.
    // - It contains the file `plugin.js` (https://<url>/plugin.js) which is the unique source code of the plugin. (It's best to compile into a single file and avoid using a CDN to host dependencies because the plugins may have to work offline).

    // download 2file
2file[2file
]
  }
})
