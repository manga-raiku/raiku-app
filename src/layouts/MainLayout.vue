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
        <component :is="Component" />
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

  <canvas
    class="hidden fixed z-0 top-0 left-0"
    ref="canvasRef"
    :width="$q.screen.width"
    :height="$q.screen.height"
  />
</template>

<script lang="ts" setup>
import "@fontsource/poppins"
// =========== suth

import NotExistsExtension from "./NotExistsExtension.vue"

const route = useRoute()
const $q = useQuasar()
const stateStore = useStateStore()
const networkStore = useNetworkStore()

const canvasRef = ref<HTMLCanvasElement>()
const instance = getCurrentInstance()
watch(canvasRef, (ref) => {
  if (!ref) return

  const { draw, stop } = useSakura(ref)

  draw()
  onBeforeUnmount(stop, instance)
})

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

<style lang="scss">
.tabs-main .q-router-link--exact-active {
  svg {
    color: var(--sakura);
  }
}
.tabs-main .q-tab {
  width: (100% / 5) !important;
}
</style>
