<route lang="yaml">
meta:
  hiddenHeader: true
  hiddenFooter: false
  hiddenDrawer: true
  beforeEach: true if $lt.md else "/app/myaccount"
  isTab: true
</route>

<template>
  <q-header class="transparent">
    <q-toolbar>
      <q-space />

      <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
        <q-icon name="search" />
      </q-btn>
      <AppHeaderSearchMB v-model:searching="showSearchMB" />

      <q-btn
        v-if="!APP_NATIVE_MOBILE"
        round
        unelevated
        class="mr-2"
        target="_blank"
        href="https://github.com/anime-vsub/extension-animevsub-helper"
      >
        <img
          src="~assets/animevsub-helper-512.png"
          width="24"
          height="24"
          alt="animevsub helper icon"
          :class="{
            'grayscale-100': !Http.version
          }"
        />

        <q-menu
          class="bg-dark-menu !max-w-30% rounded-xl"
          anchor="bottom middle"
          self="top middle"
        >
          <div class="px-3 py-2">
            <div v-if="Http.version">v{{ Http.version }}</div>
            <div v-else>
              {{ $t("msg-suggest-ext") }}
            </div>
          </div>
        </q-menu>
      </q-btn>

      <AppHeaderFollows v-if="APP_STANDALONE" />
      <AppHeaderHistory v-if="APP_STANDALONE" />
      <AppHeaderNotify />

      <q-btn round unelevated class="mr-2" @click="showSearchMB = true">
        <component :is="Icons.settings[0]" width="22" height="22" />
      </q-btn>
    </q-toolbar>
  </q-header>

  <q-page v-if="$q.screen.lt.md" class="main">
    <!-- <video
      src="~/assets/yae-miko-genshin-impact.mp4"
      autoplay
      loop
      muted
      class="fixed w-full object-cover sm:hidden min-h-[calc(100%-65%+58px)]"
    /> -->
    <!-- <img
      src="~/assets/picture_sakura.svg"
      alt="picture_sakura"
      class="w-full h-full object-cover min-h-[calc(100%-65%+58px)] fixed top-0 left-0"
    /> -->

    <div class="px-4">
      <q-list padding class="pt-0">
        <q-item
          v-if="!authStore.profile"
          clickable
          v-ripple
          to="/app/sign-in?redirect=/app"
          class="mx--4"
        >
          <q-item-section avatar>
            <q-avatar class="size-50px">
              <i-solar-user-circle-bold-duotone class="size-50px" />
            </q-avatar>
          </q-item-section>
          <q-item-section class="text-16px">
            <q-item-label>{{ $t("dang-nhap") }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-else clickable v-ripple to="/app/myaccount">
          <q-item-section avatar>
            <q-avatar size="50px">
              <img
                :src="
                  authStore.profile?.avatar_url ??
                  `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
                "
              />
            </q-avatar>
          </q-item-section>
          <q-item-section class="text-16px">
            <q-item-label>{{ authStore.profile?.full_name }}</q-item-label>
          </q-item-section>
        </q-item>

        <template v-for="item in buttons" :key="item.text">
          <q-separator v-if="item.divider" class="bg-[rgba(255,255,255,0.1)]" />

          <q-item
            clickable
            v-ripple
            :href="item.href"
            :to="item.to"
            @click="item.onClick"
            class="rounded-xl"
          >
            <q-item-section avatar class="min-w-0">
              <component :is="item.icon[0]" width="25" height="25" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.text }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="item.onClick || item.side" side>
              <template v-if="!item.onClick">
                {{ item.side?.value }}
              </template>
              <i-fluent-chevron-right-24-regular v-else />
            </q-item-section>

            <q-item-section v-if="item.switcher" side>
              <q-toggle v-model="item.switcher.value" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>

    <!-- <q-input v-model="binaryAuth" placeholder="Enter binary auth" /> -->
  </q-page>

  <canvas
    class="fixed z-0 top-0 left-0 pointer-events-none"
    ref="canvasRef"
    :width="$q.screen.width"
    :height="$q.screen.height"
  />
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { Http } from "client-ext-animevsub-helper"
import { Icons } from "src/Icons"
import type { Icon } from "src/Icons"
import { APP_NATIVE_MOBILE, APP_STANDALONE } from "src/constants"

import antDesignAppleOutlined from "~icons/ant-design/apple-outlined"
import phTabsDuotone from "~icons/ph/tabs-duotone"

const authStore = useAuthStore()
const $q = useQuasar()
const i18n = useI18n()
const settingsStore = useSettingsStore()
const stateStore = useStateStore()

const showSearchMB = ref(false)

const buttons: ComputedRef<
  {
    divider?: boolean
    switcher?: Ref<boolean>
    href?: string
    to?: string
    icon: [Icon, Icon]
    onClick?: () => void
    text: string
    side?: Ref<string>
  }[]
> = computed(() => [
  {
    to: "/app/settings",
    icon: Icons.settings,
    text: i18n.t("cai-dat")
  },
  {
    to: "/app/settings/check-network",
    icon: Icons.bug,
    text: i18n.t("kiem-tra-loi-mang")
  },
  {
    divider: true,
    // to: "/app/settings/plugins",
    onClick: () => (stateStore.showPluginManagerDialog = true),
    icon: Icons.mingcute,
    text: i18n.t("quan-ly-plugin")
  },
  {
    onClick: () => (stateStore.showProxyManagerDialog = true),
    icon: Icons.vpn,
    text: i18n.t("quan-ly-proxy")
  },
  {
    switcher: computed({
      get: () => settingsStore.enableKeepAlive,
      set: (v) => (settingsStore.enableKeepAlive = v)
    }),
    icon: [phTabsDuotone, phTabsDuotone],
    text: i18n.t("kich-hoat-keep-alive")
  },
  {
    divider: true,
    href: "mailto://contact@mangaraiku.eu.org?title=Feedback%20app%20git.shin.raiku",
    icon: Icons.info_circle,
    text: i18n.t("phan-hoi-hoac-bao-loi")
  },
  {
    href: "https://ko-fi.com/tachib_shin",
    icon: Icons.user_heart,
    text: i18n.t("tai-tro-ung-ho")
  },
  {
    href: "https://github.com/manga-raiku/manga-raiku",
    icon: Icons.code_bold,
    text: i18n.t("ma-nguon-mo")
  },
  {
    href: "https://mangaraiku.eu.org",
    icon: [antDesignAppleOutlined, antDesignAppleOutlined],
    text: i18n.t("pwa-cho-ios-va-desktop")
  },
  {
    to: "/app/about",
    icon: Icons.notebook,
    text: i18n.t("gioi-thieu"),
    side: computedAsync(async () => {
      try {
        return (await App.getInfo()).version
      } catch {
        return version
      }
    })
  }
])

const canvasRef = ref<HTMLCanvasElement>()
const instance = getCurrentInstance()
watch(canvasRef, (ref) => {
  if (!ref) return

  const { draw, stop } = useSakura(ref)

  draw()
  onBeforeUnmount(stop, instance)
})
</script>

<style lang="scss" scoped>
.main:before {
  content: "";
  @apply absolute top--52px left-0 w-full;
  height: calc(100% + 52px);
  background: {
    image: url("src/assets/picture_sakura.svg");
    repeat: no-repeat;
    size: cover;
  }
  filter: blur(9px) brightness(0.6);
}
</style>
