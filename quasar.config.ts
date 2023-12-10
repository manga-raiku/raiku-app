/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { join } from "path"

// eslint-disable-next-line n/no-extraneous-import
import type { RootNode, TemplateChildNode } from "@vue/compiler-core"
import dotenv from "dotenv"
import { cleanEnv, json, str } from "envalid"
import { extend } from "quasar"
import { configure } from "quasar/wrappers"

import { productName } from "./package.json"
import { vitePlugins } from "./vite-plugins"

dotenv.config()

function removeDataTestAttrs(
  node: RootNode | TemplateChildNode
): void | (() => void) | (() => void)[] {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop) =>
      prop.type === 6 /* NodeTypes.ATTRIBUTE */
        ? prop.name !== "data-test"
        : true
    )
  }
}

export default configure((/* ctx */ { modeName, prod }) => {
  const APP_NATIVE_MOBILE = ["capacitor", "cordova"].includes(modeName)

  cleanEnv(process.env, {
    SUPABASE_PROJECT_URL: str(),
    SUPABASE_PROJECT_KEY: str(),
    ...(APP_NATIVE_MOBILE
      ? {}
      : {
          FIREBASE_CONFIG: json()
        })
  })

  return {
    eslint: {
      fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: false,
      errors: prod
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      "supabase",
      "i18n",
      "head",
      "firebase-analytics",
      "local-notification",
      ...(APP_NATIVE_MOBILE ? ["capgo"] : []),
      "unocss"
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // "roboto-font", // optional, you are not bound to it
      "material-icons" // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },

      vueRouterMode: "history", // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      rebuildCache: false, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,

      env: Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(process.env as unknown as any).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_name, value]) => !(value as string).includes("\\")
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as unknown as any,
      // rawDefine: {},
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        extend(true, viteConf, {
          server: {
            // configure vite for HMR with Gitpod
            hmr: process.env.GITPOD_WORKSPACE_URL
              ? {
                  // removes the protocol and replaces it with the port we're connecting to
                  host: process.env.GITPOD_WORKSPACE_URL.replace(
                    "https://",
                    "9000-"
                  ),
                  protocol: "wss",
                  clientPort: 443
                }
              : process.env.CODESPACE_NAME
              ? {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  host: `${process.env.CODESPACE_NAME}-9000.${process.env
                    .GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN!}`,
                  protocol: "wss",
                  clientPort: 443
                }
              : true
          },
          resolve: {
            alias: {
              "vue-router": join(__dirname, "modules-client/vue-router.js")
            }
          }
        })
      },
      viteVuePluginOptions: {
        template: {
          compilerOptions: {
            nodeTransforms: !process.env.DEV ? [removeDataTestAttrs] : []
          }
        }
      },

      vitePlugins
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: false // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        dark: true,
        loadingBar: {
          color: "sakura"
        },
        notify: {
          classes: "rounded-30px"
        }
      },

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Notify", "Dialog", "Loading"]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "render" // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: "injectManifest", // or 'generateSW'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      // extendGenerateSWOptions (cfg) {}
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      extendInjectManifestOptions(cfg) {
        cfg.globIgnores ??= []
        cfg.globIgnores.push("_redirects")
      }
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
      appName: productName
    },

    bin: process.env.TEST
      ? {
          linuxAndroidStudio: "./noop.sh",
          windowsAndroidStudio: "./noop"
        }
      : undefined,

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "manga-raiku"
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"]

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
