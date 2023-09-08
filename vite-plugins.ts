import ScalaJS from "@scala-js/vite-plugin-scalajs"
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

export const vitePlugins: [
  (conf: object | undefined) => Plugin | Plugin[],
  object | undefined,
][] = [
  [vitePluginI18nLangs, {}],
  [
    Pages,
    {
      routeStyle: "nuxt3",
      importMode: () => "async",
    },
  ],
  [ReWriteAll, {}],
  [() => RemoveConsole, {}],
  [
    Layouts,
    {
      defaultLayout: "MainLayout",
    },
  ],
  [
    UnoCSS,
    {
      configFile: "./uno.config.ts",
    },
  ],
  [
    AutoImport,
    {
      resolvers: [],
      include: [/\.tsx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
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
        "src/boot/*.ts",
        "src/*.ts",
      ],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
    },
  ],
  [
    Components,
    {
      resolvers: [
        (componentName: string) => {
          if (componentName.toLowerCase() === "icon")
            return {
              name: componentName,
              from: "@iconify/vue",
            }
        },
      ],
    },
  ],
  [DefineOptions, {}],
  [vitePluginBuildRaw, {}],
  [ScalaJS, {}],
]
