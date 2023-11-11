<template>
  <q-layout view="hHh Lpr lFf">
    <AppHeader v-model:show-drawer="showDrawer" />
    <AppDrawer v-model="showDrawer" />

    <q-page-container
      :class="{
        '!pt-0': route.meta.noSpaceHeader
      }"
    >
      <router-view v-if="true" v-slot="{ Component }">
        <keep-alive :max="10">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <q-page v-else>
        <NotExistsExtension />
      </q-page>

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
  </q-layout>
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
// =========== suth

import NotExistsExtension from "./NotExistsExtension.vue"

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
</script>
