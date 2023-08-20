import Pages from "@tachibana-shin/vite-plugin-pages"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import DefineOptions from "unplugin-vue-define-options/vite"
import type { Plugin } from "vite"
import RemoveConsole from "vite-plugin-remove-console"
import ReWriteAll from "vite-plugin-rewrite-all"
import Layouts from "vite-plugin-vue-layouts"

import vitePluginBuildRaw from "./modules/vite-plugin-build-raw"
import vitePluginI18nLangs from "./modules/vite-plugin-i18n-langs"

export const vitePlugins: (Plugin | Plugin[])[] = [
  Pages({
    routeStyle: "nuxt3",
    importMode: () => "async",
  }),
  // ['unplugin-vue-router/vite', {}],
  ReWriteAll(),
  RemoveConsole(),
  Layouts({
    defaultLayout: "MainLayout",
  }),
  UnoCSS({
    configFile: "./uno.config.ts",
  }),

  AutoImport({
    resolvers: [],
    // targets to transform
    include: [/\.tsx?$/, /\.vue$/, /\.vue\?vue/],

    // global imports to register
    imports: [
      // presets
      "vue",
      "vue-router",
      {
        "@iconify/vue": ["Icon"],
        "@vueuse/core": ["computedAsync"],
        quasar: ["useQuasar"],
        "vue-request": ["useRequest"],
        "vue-i18n": ["useI18n"],
        "@tachibana-shin/capacitor-filesystem": [
          "Filesystem",
          "Directory",
          "Encoding",
        ],
      },
    ],
    dirs: [
      "src/logic/**/*.ts",
      "src/logic/**/*.tsx",
      "src/stores/**/*.ts",
      "src/composables/*.ts",
    ],
    eslintrc: {
      enabled: true, // Default `false`
      filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
  }),

  Components({
    resolvers: [
      (componentName: string) => {
        // where `componentName` is always CapitalCase
        if (componentName.toLowerCase() === "icon")
          return {
            name: componentName,
            from: "@iconify/vue",
          }
      },
    ],
  }),

  DefineOptions(),
  vitePluginBuildRaw(),
  vitePluginI18nLangs(),
]
