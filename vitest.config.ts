/* eslint-disable n/no-extraneous-import */
import { join } from "path"

import { quasar, transformAssetUrls } from "@quasar/vite-plugin"
import vue from "@vitejs/plugin-vue"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

import { vitePlugins } from "./vite-plugins"

// vite.config.ts

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "test/vitest/setup-file.ts",
    testTimeout: 60_000,
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ]
  },

  resolve: {
    alias: {
      "vue-router": join(__dirname, "modules-client/vue-router.js")
    }
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: "src/quasar-variables.scss"
    }),
    tsconfigPaths(),
    ...vitePlugins.map(([fn, conf]) => fn(conf))
  ]
})
