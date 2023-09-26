import { defineStore } from "pinia"
import type { API, Package } from "raiku-pgs/plugin"
import { createWorkerPlugin, execPackageMjs } from "raiku-pgs/thread"
import semverGt from "semver/functions/gt"

/**
 * Repo plugin need has 4 files:
 * - package.mjs ~ file contains compiled code to initialize Workers for the plugin
 * - plugin.mjs ~ file contains introductory configurations for the plugin it `exports` a `meta` object of type `Package`
 *
 * !important: The reason we don't build file address configuration is because we want to minimize plugin load time
 */

interface PackageDisk extends Package {
  readonly source: string
  readonly installedAt: number
  readonly updatedAt: number
  readonly plugin: string
}

const httpGet = get
const httpPost = post

export const usePluginStore = defineStore("plugin", () => {
  const pluginsInstalled = shallowReactive<
    Map<string, { readonly meta: PackageDisk; readonly plugin: API }>
  >(new Map())
  const pluginMain = ref<string | null>()

  async function getAllPlugins() {
    const files = await Filesystem.readdir({
      path: "plugins",
      directory: Directory.External,
    })
      .then(({ files }) => files)
      .catch(() => [])

    return Promise.all(
      files.map(async (file) => {
        const meta = await Filesystem.readFile({
          path: `plugins/${file.name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        }).then(({ data }) => JSON.parse(data) as PackageDisk)

        return meta
      }),
    ).then((res) => res.filter(Boolean) as PackageDisk[])
  }

  async function installPlugin(source: string) {
    const [packageMjs, pluginMjs] = await Promise.all([
      fetch(new URL("package.mjs", source)).then((res) => {
        if (res.ok) return res.text()
        // eslint-disable-next-line functional/no-throw-statement
        throw res
      }),
      fetch(new URL("plugin.mjs", source)).then((res) => {
        if (res.ok) return res.text()
        // eslint-disable-next-line functional/no-throw-statement
        throw res
      }),
    ])
    // run init package.mjs
    const meta = await execPackageMjs(packageMjs)

    const updatedAt = Date.now()
    const installedAt = await Filesystem.readFile({
      path: `plugins/${meta.id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    })
      .then((res) => JSON.parse(res.data).installedAt)
      .catch(() => updatedAt)

    const plugin = createWorkerPlugin(pluginMjs, httpGet, httpPost)

    Object.assign(meta, {
      source,
      installedAt,
      updatedAt,
      plugin: pluginMjs,
    })

    await Filesystem.writeFile({
      path: `plugins/${meta.id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
      data: JSON.stringify(meta),
      recursive: true,
    })

    pluginsInstalled.set(meta.id, {
      meta: meta as PackageDisk,
      plugin,
    })

    return meta
  }
  async function removePlugin(id: string) {
    await Filesystem.deleteFile({
      path: `plugins/${id}`,
      directory: Directory.External,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch(() => {})
    pluginsInstalled.delete(id)
  }
  async function updatePlugin(id: string) {
    const meta = await Filesystem.readFile({
      path: `plugins/${id}`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    }).then((res) => JSON.parse(res.data) as PackageDisk)

    const metaOnline = await fetch(`${meta.source}/plugin.mjs`)
      .then((res) => res.text())
      .then((text) => execPackageMjs(text))

    if (!semverGt(metaOnline.version, meta.version)) {
      // don't need update
      return false
    }

    await installPlugin(meta.source)

    return true
  }

  async function checkForUpdate() {
    const { files } = await Filesystem.readdir({
      path: "plugins",
      directory: Directory.External,
    })

    const pluginsCanUpdate = new Map<string, Package>()
    const tasks = files.map(async ({ name }) => {
      const { id, source, version } = JSON.parse(
        await Filesystem.readFile({
          path: `plugins/${name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        }).then((res) => res.data),
      )
      const metaOnline = await fetch(new URL("plugin.mjs", source).toString())
        .then((res) => res.text())
        .then((code) => execPackageMjs(code))
      // check for updated
      if (!semverGt(metaOnline.version, version)) {
        // don't need update
        return
      }

      pluginsCanUpdate.set(id, metaOnline)
    })

    await Promise.all(tasks)

    return pluginsCanUpdate
  }

  async function checkPluginInstalled(sourceId: string) {
    try {
      await Filesystem.stat({
        path: `plugins/${sourceId}`,
        directory: Directory.External,
      })

      return STATUS_PLUGIN_INSTALL.INSTALLED
    } catch {
      return STATUS_PLUGIN_INSTALL.NOT_INSTALL
    }
  }

  async function _get(sourceId: string) {
    const onCache = pluginsInstalled.get(sourceId)
    if (onCache) return onCache

    console.time(`Time load plugin "${sourceId}"`)

    try {
      const meta = await Filesystem.readFile({
        path: `plugins/${sourceId}`,
        directory: Directory.External,
        encoding: Encoding.UTF8,
      }).then(({ data }) => JSON.parse(data) as PackageDisk)
      const plugin = createWorkerPlugin(meta.plugin, httpGet, httpPost)

      const v = { meta, plugin }
      pluginsInstalled.set(meta.id, v)
      console.timeEnd(`Time load plugin "${sourceId}"`)

      return v
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      console.timeEnd(`Time load plugin "${sourceId}"`)

      // eslint-disable-next-line functional/no-throw-statement
      throw STATUS_PLUGIN_INSTALL.NOT_INSTALL
    }
  }

  const storeTaskGet = new Map<string, ReturnType<typeof _get>>()
  async function get(sourceId: string) {
    const task = storeTaskGet.get(sourceId)

    if (task) return task

    const newTask = _get(sourceId)
    storeTaskGet.set(sourceId, newTask)

    return newTask
  }

  const pluginMainPromise = computed(() => {
    return (
      pluginMain.value ||
      Filesystem.readdir({
        path: "plugins",
        directory: Directory.External,
      })
        .then((res) => res.files[0].name)
        .catch(() => null)
    )
  })

  const getPluginMain = computedAsync(async () => {
    const pluginMain = await pluginMainPromise.value

    return pluginMain ? get(pluginMain) : undefined
  })

  return {
    pluginMain,
    pluginMainPromise,
    getPluginMain,

    get,

    getAllPlugins,
    installPlugin,
    removePlugin,
    updatePlugin,
    checkForUpdate,
  }
})
