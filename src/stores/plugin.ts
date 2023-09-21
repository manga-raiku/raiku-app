import { defineStore } from "pinia"
import type { API, Package } from "raiku-pgs"
import semverGt from "semver/functions/gt"

interface PackageDisk extends Package {
  readonly source: string
  readonly installedAt: number
  readonly updatedAt: number
}

const httpGet = get
const httpPost = post

export const usePluginStore = defineStore("plugin", () => {
  const pluginsInstalled = shallowReactive<
    Map<
      string,
      {
        readonly plugin: API
        readonly meta: Package
      }
    >
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
        if (!file.name.endsWith(".meta")) return
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
    // 🍀🍁🍂 The url representing the plugin must satisfy 2 requirements:
    // - It contains the file `plugin.sha256` (https://<url>/plugin.sha256) which is the `SHA-256` hash of the plugin.
    // - It contains the file `plugin.meta` (https//<url>/plugin.meta) which is the information of the plugin.
    // - It contains the file `<plugin>.js` identified by the `filename` attribute in the `plugin.meta` file.

    // download 2file
    const meta = await fetch(
      `https://proxy.mangaraiku.eu.org/?url=${source}/plugin.meta`,
    ).then((res) => {
      // eslint-disable-next-line functional/no-throw-statement
      if (res.status === 404) throw STATUS_PLUGIN_INSTALL.NOT_FOUND
      if (res.ok) return res.json() as Promise<Package>

      // eslint-disable-next-line functional/no-throw-statement
      throw res
    })
    const javascript = await fetch(
      `https://proxy.mangaraiku.eu.org/?url=${new URL(
        meta.filename,
        source,
      ).toString()}`,
    ).then((res) => {
      // eslint-disable-next-line functional/no-throw-statement
      if (res.status === 404) throw STATUS_PLUGIN_INSTALL.NOT_FOUND2
      if (res.ok) return res.text()

      // eslint-disable-next-line functional/no-throw-statement
      throw res
    })

    // try parsing the XSS source code and getting the package information
    const plugin: API = await evalModule(javascript)
      .catch((err: any) => {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error(`[Error]: during plugin compile failure. (${err})`)
      })
      .then((Class: typeof API) => new Class(httpGet, httpPost))

    const updatedAt = Date.now()
    const installedAt = await Filesystem.readFile({
      path: `plugins/${meta.id}.meta`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    })
      .then((res) => JSON.parse(res.data).installedAt)
      .catch(() => updatedAt)

    Object.assign(meta, {
      source,
      installedAt,
      updatedAt,
    })

    await Promise.all([
      Filesystem.writeFile({
        path: `plugins/${meta.id}.meta`,
        directory: Directory.External,
        encoding: Encoding.UTF8,
        data: JSON.stringify(meta),
        recursive: true,
      }),
      Filesystem.writeFile({
        path: `plugins/${meta.id}.mjs`,
        directory: Directory.External,
        encoding: Encoding.UTF8,
        data: javascript,
        recursive: true,
      }),
    ])

    pluginsInstalled.set(meta.id, { meta, plugin })

    return meta
  }
  async function removePlugin(id: string) {
    await Promise.all([
      Filesystem.deleteFile({
        path: `plugins/${id}.meta`,
        directory: Directory.External,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      }).catch(() => {}),
      Filesystem.deleteFile({
        path: `plugins/${id}.mjs`,
        directory: Directory.External,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      }).catch(() => {}),
    ])
    pluginsInstalled.delete(id)
  }
  async function updatePlugin(id: string) {
    const meta = await Filesystem.readFile({
      path: `plugins/${id}.meta`,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    }).then((res) => JSON.parse(res.data) as PackageDisk)

    const metaOnline = await fetch(`${meta.source}/plugin.meta`).then(
      (res) => res.json() as Promise<PackageDisk>,
    )

    if (!semverGt(metaOnline.version, meta.version)) {
      // don't need update
      return false
    }

    await installPlugin(metaOnline.source)

    return true
  }

  async function checkForUpdate() {
    const { files } = await Filesystem.readdir({
      path: "plugins",
      directory: Directory.External,
    })

    const pluginsCanUpdate = new Map<string, Package>()
    const tasks = files.map(async ({ name }) => {
      if (!name.endsWith(".meta")) return

      const { id, source, version } = JSON.parse(
        await Filesystem.readFile({
          path: `plugins/${name}`,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        }).then((res) => res.data),
      )
      const metaOnline = await fetch(
        new URL("plugin.meta", source).toString(),
      ).then((res) => res.json())
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
        path: `plugins/${sourceId}.meta`,
        directory: Directory.External,
      })

      try {
        await Filesystem.stat({
          path: `plugins/${sourceId}.mjs`,
          directory: Directory.External,
        })

        return STATUS_PLUGIN_INSTALL.INSTALLED
      } catch {
        return STATUS_PLUGIN_INSTALL.ADDED_BUT_NEED_DOWNLOAD
      }
    } catch {
      return STATUS_PLUGIN_INSTALL.NOT_INSTALL
    }
  }

  async function _get(sourceId: string) {
    const onCache = pluginsInstalled.get(sourceId)
    if (onCache) return onCache

    console.time(`Time load plugin "${sourceId}"`)

    let meta: PackageDisk, plugin: API

    try {
      meta = await Filesystem.readFile({
        path: `plugins/${sourceId}.meta`,
        directory: Directory.External,
        encoding: Encoding.UTF8,
      }).then(({ data }) => JSON.parse(data) as PackageDisk)
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      console.timeEnd(`Time load plugin "${sourceId}"`)

      // eslint-disable-next-line functional/no-throw-statement
      throw STATUS_PLUGIN_INSTALL.NOT_INSTALL
    }
    try {
      plugin = await Filesystem.readFile({
        path: `plugins/${meta.id}.mjs`,
        directory: Directory.External,
        encoding: Encoding.UTF8,
      })
        .then(({ data }) => evalModule(data))
        .then((Class: typeof API) => new Class(httpGet, httpPost))
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      console.timeEnd(`Time load plugin "${sourceId}"`)

      // eslint-disable-next-line functional/no-throw-statement
      throw STATUS_PLUGIN_INSTALL.ADDED_BUT_NEED_DOWNLOAD
    }

    const pluginLinked = { meta, plugin } as const
    pluginsInstalled.set(meta.id, pluginLinked)

    console.timeEnd(`Time load plugin "${sourceId}"`)

    return pluginLinked
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
    return pluginMain.value ||  Filesystem.readdir({
      path: "plugins",
      directory: Directory.External,
    })
      .then((res) => res.files.find((item) => item.name.endsWith(".meta"))?.name.replace(/\.meta$/, ""))
      .catch(() => null)
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
