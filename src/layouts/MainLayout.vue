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
    </q-page-container>

    <div class="fixed bottom-0 left-0 w-full">Offline mode</div>

    <AppFooter />

    <PluginManagerDialog v-model="stateStore.showPluginManagerDialog" />
    <PluginAddDialog
      v-model="stateStore.showPluginAddDialog"
      @installed="stateStore.showPluginAddDialog = false"
    />
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

const canvasRef = ref<HTMLCanvasElement>()
const instance = getCurrentInstance()
watch(canvasRef, (ref) => {
  if (!ref) return

  const { draw, stop } = useSakura(ref)

  draw()
  onBeforeUnmount(stop, instance)
})

const showDrawer = ref(false)

// ========= plugin manager ========
const stateStore = useStateStore()

// ======== offline control ========
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
