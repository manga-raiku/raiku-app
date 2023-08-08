<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      v-if="!isCapacitor && route.meta?.hiddenHeader !== true"
      class="bg-dark-page py-1 px-2 header-blur"
      :class="{
        '!bg-transparent': route.meta?.transparentHeader,
      }"
    >
      <q-toolbar>
        <AppHeaderIconApp :no-name="$q.screen.lt.sm" class="mr-8" />

        <template v-if="$q.screen.md || $q.screen.gt.md">
          <router-link
            to="/"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Trang chủ</router-link
          >
          <router-link
            to="/the-loai"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Thể loại</router-link
          >
          <router-link
            to="/bang-xep-hang/ngay"
            class="mx-4 text-15px font-family-poppins text-weight-normal transition-color duration-200 ease text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)]"
            exact-active-class="!text-main-3 text-weight-medium"
            >Bảng xếp hạng</router-link
          >
        </template>

        <q-space />

        <template v-if="$q.screen.md || $q.screen.gt.md">
          <AppHeaderSearch />
          <AppHeaderGithub />
        </template>
        <template v-else>
          <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
            <q-icon name="search" />
          </q-btn>
          <AppHeaderSearchMB v-model:searching="showSearchMB" />
        </template>

        <AppHeaderFollows />
        <AppHeaderHistory />
        <AppHeaderNotify />

        <AppHeaderUser />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-if="Http.version" v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
      <q-page v-else>
        <NotExistsExtension />
      </q-page>
    </q-page-container>

    <q-footer v-if="isCapacitor" v-show='!route.meta?.hiddenFooter' class="bg-dark-page">
      <q-tabs
        indicator-color="transparent"
        active-color="white"
        class="bg-transparent text-grey-5 !shadow-2 text-[12px] tabs-main font-family-poppins children:w-20% children:min-w-0"
        no-caps
      >
        <q-route-tab replace class="pt-1" to="/">
          <Icon
            icon="solar:home-smile-angle-bold-duotone"
            width="24"
            height="24"
            class="mb-1"
          />
          Trang chủ
        </q-route-tab>
        <q-route-tab replace class="pt-1" to="/tim-kiem">
          <Icon
            icon="iconamoon:search-duotone"
            width="24"
            height="24"
            class="mb-1"
          />
          Tìm kiếm
        </q-route-tab>
        <q-route-tab replace class="pt-1" to="/the-loai">
          <Icon
            icon="solar:box-minimalistic-bold-duotone"
            width="24"
            height="24"
            class="mb-1"
          />
          Thể loại
        </q-route-tab>
        <q-route-tab replace class="pt-1" to="/library">
          <Icon
            icon="solar:library-bold-duotone"
            width="24"
            height="24"
            class="mb-1"
          />
          Thư viện
        </q-route-tab>
        <q-route-tab replace class="pt-1" to="/tai-khoan">
          <Icon
            icon="solar:user-rounded-bold-duotone"
            width="24"
            height="24"
            class="mb-1"
          />
          Tôi
        </q-route-tab>
      </q-tabs>
    </q-footer>
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

import { Http } from "client-ext-animevsub-helper"
import { isCapacitor } from "src/constants"

import NotExistsExtension from "./NotExistsExtension.vue"
// key bind

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

const showSearchMB = ref(false)
</script>

<style lang="scss" scoped>
.tabs-main :deep(.q-router-link--exact-active) {
  svg {
    color: var(--sakura);
  }
}
</style>
