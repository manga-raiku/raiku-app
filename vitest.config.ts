import { OnuResolver } from "onu-ui"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./setup.vitest.ts",
  },
  resolve: {
    alias: {
      app: __dirname,
      path: "path-cross/posix",
    },
  },
  plugins: [
    AutoImport({
      resolvers: [OnuResolver()],
      // targets to transform
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],

      // global imports to register
      imports: [
        // presets
        "vue",
        "vue-router",
        {
          "@iconify/vue": ["Icon"],
          "@vueuse/core": ["computedAsync"],
          "@tachibana-shin/capacitor-filesystem": ["Filesystem", "Directory", "Encoding"],
        },
      ],
      dirs: ["src/logic/*.ts", "src/composables/*.ts", "src/constants/*.ts"],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
})
