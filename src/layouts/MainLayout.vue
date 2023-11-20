<template>
  <q-layout view="hHh Lpr lFf">
    <AppHeader v-model:show-drawer="showDrawer" />
    <AppDrawer v-model="showDrawer" />

    <q-page-container
      :class="{
        '!pt-0': route.meta.noSpaceHeader
      }"
    >
      <router-view v-if="appAllowWork" v-slot="{ Component }">
        <keep-alive :max="10">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <AllowWork v-else :loading="appAllowWork === undefined" />

      <NotifyOffline v-model="showNotifyOffline" />
    </q-page-container>

    <AppFooter v-if="$q.screen.lt.md" :model-value="!route.meta.hiddenFooter" />
    <BBarNetwork
      v-if="
        ($q.screen.lt.md || route.meta.hiddenFooter) && !networkStore.isOnline
      "
    />

    <!-- plugin manager -->
    <PluginManagerDialog v-model="stateStore.showPluginManagerDialog" />
    <PluginAddDialog
      v-model="stateStore.showPluginAddDialog"
      @installed="stateStore.showPluginAddDialog = false"
    />
    <!-- /plugin manager -->

    <!-- proxy manager -->
    <ProxyManagerDialog v-model="stateStore.showProxyManagerDialog" />
    <ProxyAddDialog
      v-model="stateStore.showProxyAddDialog"
      @installed="stateStore.showProxyAddDialog = false"
    />
    <!-- /proxy manager -->

    <template v-if="!APP_NATIVE_MOBILE">
      <!-- popup suggest install app -->
      <SuggestInstallApp />
      <!-- /popup suggest install app -->
      <!-- popup suggest extension -->
      <SuggestExtension />
      <!-- /popup suggest extension -->
    </template>

    <!-- check for update -->
    <CheckForUpdate />
    <!-- /check for update -->
  </q-layout>
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
// =========== suth

import { App } from "@capacitor/app"
import { packageName } from "app/package.json"
import { APP_NATIVE_MOBILE } from "src/constants"

import AllowWork from "./AllowWork.vue"

const route = useRoute()
const $q = useQuasar()
const stateStore = useStateStore()
const networkStore = useNetworkStore()

const showDrawer = ref(false)

// ======== offline control ========
const showNotifyOffline = ref(false)
watchImmediate(
  () => networkStore.isOnline,
  (isOnline) => {
    showNotifyOffline.value = !isOnline
  }
)

function parse(str: string) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

const appAllowWork = APP_NATIVE_MOBILE
  ? computedAsync<boolean>(async () => {
      const activeCache = parse(localStorage.getItem("active") ?? "")

      if (activeCache && Date.now() - activeCache.now <= 1000 * 3600 * 24) {
        return true
      }
      const [res, { id }] = await Promise.all([
        fetch(
          "https://raw.githubusercontent.com/manga-raiku/raiku-app/main/native-active"
        ),
        App.getInfo()
      ])

      const active =
        res.status !== 404 &&
        (res.status === 200 || res.status === 201) &&
        id === packageName
      if (!active) return false

      localStorage.setItem(
        "active",
        JSON.stringify({
          now: Date.now()
        })
      )
      return true
    })
  : true
</script>
