import replace from "@rollup/plugin-replace"
import { defineConfig } from "vite"
import type { Plugin } from "vite"

import vitePluginBuildRaw from "../../modules/vite-plugin-build-raw"

export default defineConfig({
  build: {
    sourcemap: "inline",
    lib: {
      entry: ["./lib/plugin.ts", "./lib/thread.ts"],
      name: "RaikuPgs",
      formats: ["cjs", "es"],

      fileName: (format, entry) => entry + (format === "es" ? ".js" : ".cjs")
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["cheerio", "htmlparser2", "client-ext-animevsub-helper"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: {
        //   cheerio: "cheerio",
        //   htmlparser2: "htmlparser2",
        // },
      }
    }
  },
  plugins: [
    vitePluginBuildRaw() as unknown as Plugin,
    replace({
      __DEV__: "process.env.NODE_ENV === 'development'",
      __DEBUG__: "__DEBUG__"
    }) as unknown as Plugin
  ]
})
