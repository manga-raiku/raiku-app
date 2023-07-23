<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      v-if="route.meta?.hiddenHeader !== true"
      class="bg-dark-page py-1 px-2"
      :class="{
        '!bg-transparent': route.meta?.transparentHeader,
      }"
    >
      <q-toolbar>
        <router-link to="/" class="flex flex-nowrap items-end mr-8">
          <img src="~assets/app_icon.svg" width="35" height="35" />
          <span style="font-family: Caveat" class="text-[25px] text-main"
            >Manga Raiku</span
          >
        </router-link>

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

        <q-space />

        <AppHeaderSearch />

        <AppHeaderGithub />
        <AppHeaderFollows />
        <AppHeaderHistory />
        <AppHeaderNotify />

        <AppHeaderUser />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page
        :style-fn="
          route.meta?.offset
            ? (offset, height) => ({
                height:
                  route.meta?.offset && route.meta.existsFooter
                    ? '100%'
                    : height + 'px',
                width:
                  route.meta?.offset && route.meta.existsFooter
                    ? '100%'
                    : undefined,
                marginTop:
                  offset === 0 ||  route.meta?.absolute
                    ? undefined
                    : (route.meta.existsFooter ? -50 : -offset) + 'px',
              })
            : undefined
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
  </q-layout>

  <canvas
    class="hidden fixed z-0 top-0 left-0"
    ref="canvasRef"
    :width="$q.screen.width"
    :height="$q.screen.height"
  />
</template>

<script lang="ts" setup>
import "@fontsource/caveat"

import "@fontsource/poppins"
// =========== suth

import { Http } from "client-ext-animevsub-helper"

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
</script>
