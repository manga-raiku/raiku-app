import {
  LocalNotifications,
  type LocalNotificationSchema
} from "@capacitor/local-notifications"
import { i18n } from "boot/i18n"
import { defineStore } from "pinia"
import type { ID, Package } from "raiku-pgs/plugin"
import { createWorkerPlugin, execPackageMjs } from "raiku-pgs/thread"
import semverGt from "semver/functions/gt"

/**
 * Repo plugin need has 4 files:
 * - package.mjs ~ file contains compiled code to initialize Workers for the plugin
 * - plugin.mjs ~ file contains introductory configurations for the plugin it `exports` a `meta` object of type `Package`
 *
 * !important: The reason we don't build file address configuration is because we want to minimize plugin load time
 */

export interface PackageDisk extends Package {
  readonly source: string
  readonly installedAt: number
  readonly updatedAt: number
  readonly plugin: string
  readonly devMode: boolean
}

export interface PluginOnMemory {
  readonly meta: PackageDisk
  readonly plugin: ReturnType<typeof createWorkerPlugin>
}

export enum UpdatePluginStatus {
  CHECKING,
  PEDDING,
  NEW_VERSION,
  ERROR,
  NOTHING
}

const httpGet = get
const httpPost = post

export const usePluginStore = defineStore("plugin", () => {
  const pluginsInstalled = shallowReactive<
    Map<string, PluginOnMemory | Promise<PluginOnMemory>>
  >(new Map())
  const pluginMain = ref<string | null>(
    localStorage.getItem("plugin-main") || null
  )
  watch(pluginMain, (name) => {
    if (name) localStorage.setItem("plugin-main", name)
    else localStorage.removeItem("plugin-main")
  })

  const busses = new EventBus<{
    "install plugin": [PackageDisk]
    "remove plugin": [string]
  }>()

  const getAllPlugins = useModule(() => {
    async function _getAllPlugins() {
      const files = await Filesystem.readdir({
        path: "plugins",
        directory: Directory.External
      })
        .then(({ files }) => files)
        .catch(() => [])

      return Promise.all(
        files.map(async (file) => {
          const meta = await Filesystem.readFile({
            path: `plugins/${file.name}`,
            directory: Directory.External,
            encoding: Encoding.UTF8
          }).then(({ data }) => {
            const plugin = JSON.parse(data)
            delete plugin.plugin

            return plugin as Omit<PackageDisk, "plugin">
          })

          return meta
        })
      ).then((res) => res.filter(Boolean))
    }

    let promiseGetAllPlugins: ReturnType<typeof _getAllPlugins>
    async function getAllPlugins() {
      if (promiseGetAllPlugins) return promiseGetAllPlugins

      promiseGetAllPlugins = _getAllPlugins()

      return promiseGetAllPlugins
    }

    return getAllPlugins
  })

  async function installPlugin(source: string, devMode: boolean) {
    const [packageMjs, pluginMjs] = await Promise.all([
      fetch(join(source, "package.mjs")).then((res) => {
        if (res.ok) return res.text()
        // eslint-disable-next-line functional/no-throw-statement
        throw res
      }),
      fetch(join(source, "plugin.mjs")).then((res) => {
        if (res.ok) return res.text()
        // eslint-disable-next-line functional/no-throw-statement
        throw res
      })
    ])
    // run init package.mjs
    const meta = await execPackageMjs(packageMjs, devMode, APP_INFO)
    if (!checkSupport(meta.support))
      // eslint-disable-next-line functional/no-throw-statement
      throw new PluginError(meta.id, STATUS_PLUGIN_INSTALL.NOT_SUPPORT_PLATFORM)

    const updatedAt = Date.now()
    const installedAt = await Filesystem.readFile({
      path: `plugins/${meta.id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8
    })
      .then((res) => JSON.parse(res.data).installedAt)
      .catch(() => updatedAt)

    const plugin = createWorkerPlugin(
      pluginMjs,
      httpGet,
      httpPost,
      devMode,
      APP_INFO
    )

    const metaDisk: PackageDisk = {
      ...meta,
      source,
      installedAt,
      updatedAt,
      plugin: pluginMjs,
      devMode
    }

    await Filesystem.writeFile({
      path: `plugins/${meta.id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
      data: JSON.stringify(metaDisk),
      recursive: true
    })
    ;(await pluginsInstalled.get(meta.id))?.plugin.destroy()
    refreshPluginMain.value++
    storeTaskGet.delete(meta.id)
    pluginsInstalled.set(meta.id, {
      meta: meta as PackageDisk,
      plugin
    })
    busses.emit("install plugin", meta as PackageDisk)

    return meta
  }
  async function removePlugin(id: string) {
    await Filesystem.deleteFile({
      path: `plugins/${id}`,
      directory: Directory.External

      // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch(() => {})
    ;(await pluginsInstalled.get(id))?.plugin.destroy()
    pluginsInstalled.delete(id)
    updateState.delete(id)
    busses.emit("remove plugin", id)
  }
  async function updatePlugin(id: string) {
    const meta = await Filesystem.readFile({
      path: `plugins/${id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8
    }).then((res) => JSON.parse(res.data) as PackageDisk)

    const metaOnline = await fetch(`${meta.source}/plugin.mjs`)
      .then((res) => res.text())
      .then((text) => execPackageMjs(text, meta.devMode, APP_INFO))

    if (!semverGt(metaOnline.version, meta.version)) {
      // don't need update
      return false
    }

    const r = await installPlugin(meta.source, meta.devMode)
    updateState.delete(id)

    return r
  }

  async function checkForUpdate(sourceId: ID) {
    const { source, version, devMode } = (await get(sourceId)).meta
    const metaOnline = await fetch(join(source, "plugin.mjs"))
      .then((res) => res.text())
      .then((code) => execPackageMjs(code, devMode, APP_INFO))
    // check for updated
    if (!semverGt(metaOnline.version, version)) {
      // don't need update
      return
    }

    return metaOnline
  }

  async function _getOnDisk(sourceId: string) {
    console.time(`Time load plugin "${sourceId}"`)

    try {
      const promise = (async () => {
        const meta = await Filesystem.readFile({
          path: `plugins/${sourceId}`,
          directory: Directory.External,
          encoding: Encoding.UTF8
        }).then(({ data }) => JSON.parse(data) as PackageDisk)
        const plugin = createWorkerPlugin(
          meta.plugin,
          httpGet,
          httpPost,
          meta.devMode,
          APP_INFO
        )

        const v = { meta, plugin }
        console.timeEnd(`Time load plugin "${sourceId}"`)

        return v
      })()
      pluginsInstalled.set(sourceId, promise)
      return await promise
    } catch (err) {
      pluginsInstalled.delete(sourceId)
      if (import.meta.env.DEV) console.error(err)
      console.timeEnd(`Time load plugin "${sourceId}"`)

      // eslint-disable-next-line functional/no-throw-statement
      throw new PluginError(sourceId, STATUS_PLUGIN_INSTALL.NOT_FOUND)
    }
  }

  const storeTaskGet = new Map<string, ReturnType<typeof _getOnDisk>>()
  async function get(sourceId: string) {
    const onCache = pluginsInstalled.get(sourceId)
    if (onCache) return onCache

    const task = storeTaskGet.get(sourceId)

    if (task) return task

    const newTask = _getOnDisk(sourceId)
    storeTaskGet.set(sourceId, newTask)

    return newTask
  }

  const refreshPluginMain = ref(0)
  const pluginMainPromise = computed(() => {
    return (
      pluginMain.value ||
      (refreshPluginMain.value,
      Filesystem.readdir({
        path: "plugins",
        directory: Directory.External
      })
        .then((res) => res.files[0].name)
        .catch(() => null))
    )
  })

  const getPluginMain = computedAsync(async () => {
    const pluginMain = await pluginMainPromise.value

    return pluginMain ? get(pluginMain) : undefined
  })

  async function getPluginOrDefault(sourceId?: string | null) {
    if (!sourceId) sourceId = await pluginMainPromise.value

    if (!sourceId)
      // eslint-disable-next-line functional/no-throw-statement
      throw sourceId
        ? new PluginError(sourceId, STATUS_PLUGIN_INSTALL.NOT_FOUND)
        : new PluginsNotAvailable()

    return get(sourceId)
  }

  // composition api
  function useApi<OrDefault extends boolean>(
    sourceId: OrDefault extends true
      ? ComputedRef<string | null | undefined>
      : ComputedRef<string>,
    orDefault: OrDefault
  ) {
    return orDefault
      ? computed(() =>
          getPluginOrDefault(sourceId.value).then(({ plugin }) => plugin)
        )
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        computed(() => get(sourceId.value!).then(({ plugin }) => plugin))
  }

  // ===== plugin update checking =====
  const updateState = shallowReactive(
    new Map<
      string,
      | {
          readonly status:
            | UpdatePluginStatus.CHECKING
            | UpdatePluginStatus.PEDDING
            | UpdatePluginStatus.NOTHING
        }
      | {
          readonly status: UpdatePluginStatus.NEW_VERSION
          readonly data: Package
        }
      | {
          readonly status: UpdatePluginStatus.ERROR
          readonly data: unknown
        }
    >()
  )

  async function checkUpdatePlugins(pushNotification = false) {
    const plugins = await getAllPlugins()
    plugins.forEach((plugin) =>
      updateState.set(plugin.id, { status: UpdatePluginStatus.PEDDING })
    )

    await someLimit(
      plugins,
      async (plugin) => {
        updateState.set(plugin.id, { status: UpdatePluginStatus.CHECKING })

        try {
          const pkg = await checkForUpdate(plugin.id)

          if (pkg) {
            updateState.set(plugin.id, {
              status: UpdatePluginStatus.NEW_VERSION,
              data: pkg
            })

            if (pushNotification) {
              void permissionNotification
                .then(() => {
                  const notification: LocalNotificationSchema = {
                    title: i18n.global.t("cap-nhat-plugin-plugin-name", [
                      plugin.name
                    ]),
                    body: i18n.global.t("body-notify-update-plugin", [
                      plugin.version,
                      plugin.name,
                      plugin.id
                    ]),
                    id: Math.round(Math.random() * 0x7fffffff),
                    smallIcon: plugin.favicon,
                    extra: {
                      type: "update_plugin",
                      data: plugin
                    }
                  }

                  return LocalNotifications.schedule({
                    notifications: [notification]
                  })
                })
                .catch((err) => {
                  WARN(err)
                })
            }
          } else
            updateState.set(plugin.id, {
              status: UpdatePluginStatus.NOTHING
            })
        } catch (error) {
          updateState.set(plugin.id, {
            status: UpdatePluginStatus.ERROR,
            data: error
          })
        }

        return false
      },
      5
    )
  }

  void checkUpdatePlugins(true)

  return {
    pluginMain,
    pluginMainPromise,
    getPluginMain,

    get,

    busses,

    getAllPlugins,
    installPlugin,
    removePlugin,
    updatePlugin,

    getPluginOrDefault,

    useApi,

    updateState,
    checkUpdatePlugins
  }
})
