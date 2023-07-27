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
            to="/the-loai/school-life-37.html?country=4"
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
      <q-page
        :style-fn="
          (offset, height) => {
            if (route.meta?.offset)
              return {
                height:
                  route.meta?.offset && route.meta.existsFooter
                    ? '100%'
                    : height + 'px',
                width:
                  route.meta?.offset && route.meta.existsFooter
                    ? '100%'
                    : undefined,
                marginTop:
                  offset === 0 || route.meta?.absolute
                    ? undefined
                    : (route.meta.existsFooter ? -50 : -offset) + 'px',
              }
            return {
              height: height + 'px',
              marginTop: 50 + 'px',
            }
          }
        "
        :class="{
          'fixed top-0': route.meta?.absolute,
        }"
        :padding="route.meta?.padding"
      >
        <router-view v-if="Http.version" v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        <NotExistsExtension v-else />
      </q-page>
    </q-page-container>

    <q-footer v-if="isCapacitor" class="bg-dark-page">
      <q-tabs
        indicator-color="transparent"
        exact-active-color="white"
        class="bg-transparent text-grey-5 !shadow-2 text-[12px] tabs-main"
        no-caps
      >
        <q-route-tab
          replace
          exact-active-class="tab-active"
          class="pt-1"
          to="/"
        >
          <Icon
            icon="fluent:home-24-regular"
            width="24"
            height="24"
            class="mb-1 regular"
          />
          <Icon
            icon="fluent:home-24-filled"
            width="24"
            height="24"
            class="mb-1 filled"
          />
          Trang chủ
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

<style lang="scss">
.filled {
  display: none;
}

.tab-active {
  color: #fff;

  .regular {
    display: none;
  }

  .filled {
    display: inline-block;
  }
}
</style>
