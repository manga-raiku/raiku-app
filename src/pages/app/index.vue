<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: false
  hiddenDrawer: true
  beforeEach: true if $lt.md else "/app/myaccount"
</route>

<template>
  <q-page
    v-if="$q.screen.lt.md"
    :style-fn="
      (offset, height) => {
        return {
          height: height + 'px'
        }
      }
    "
  >
    <!-- <video
      src="~/assets/yae-miko-genshin-impact.mp4"
      autoplay
      loop
      muted
      class="fixed w-full object-cover sm:hidden min-h-[calc(100%-65%+58px)]"
    /> -->
    <img
      src="~/assets/picture_sakura.svg"
      alt="picture_sakura"
      class="w-full object-cover min-h-[calc(100%-65%+58px)]"
    />

    <div
      class="fixed w-full h-[calc(65%-58px)] bottom-58px left-0 rounded-25px bg-dark-page px-4 overflow-y-scroll scrollbar-custom"
    >
      <q-list padding>
        <q-item
          v-if="!authStore.profile"
          clickable
          v-ripple
          to="/app/sign-in?redirect=/app"
        >
          <q-item-section avatar>
            <q-avatar>
              <i-solar-user-circle-bold-duotone class="size-50px" />
            </q-avatar>
          </q-item-section>
          <q-item-section class="text-16px">
            <q-item-label>{{ $t("dang-nhap") }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-else clickable v-ripple to="/app/myaccount">
          <q-item-section avatar>
            <q-avatar>
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

        <q-separator class="my-3" />

        <q-item
          clickable
          v-ripple
          v-for="item in buttons"
          :key="item.text"
          :to="item.to"
          :href="item.href"
        >
          <q-item-section avatar>
            <component :is="item.icon[0]" class="size-25px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="item.side" side>{{
            item.side.value
          }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- <q-input v-model="binaryAuth" placeholder="Enter binary auth" /> -->
  </q-page>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { Icons } from "src/Icons"
import type { Icon } from "src/Icons"

import antDesignAppleOutlined from "~icons/ant-design/apple-outlined"

const authStore = useAuthStore()
const $q = useQuasar()
const i18n = useI18n()

const buttons: {
  href?: string
  to?: string
  icon: [Icon, Icon]
  text: string
  side?: Ref<string>
}[] = [
  {
    href: "https://ko-fi.com/tachib_shin",
    icon: Icons.user_heart,
    text: i18n.t("tai-tro-ung-ho")
  },
  {
    to: "/app/settings",
    icon: Icons.settings,
    text: i18n.t("cai-dat")
  },
  {
    href: "mailto://contact@mangaraiku.eu.org?title=Feedback%20app%20git.shin.raiku",
    icon: Icons.info_circle,
    text: i18n.t("phan-hoi")
  },
  {
    href: "https://github.com/manga-raiku/manga-raiku",
    icon: Icons.code_bold,
    text: i18n.t("ma-nguon-mo")
  },
  {
    href: "https://mangaraiku.eu.org",
    icon: [antDesignAppleOutlined, antDesignAppleOutlined],
    text: i18n.t("phien-ban-pwa-cho-iphone-va-may-tinh")
  },
  {
    to: "/app/settings/check-network",
    icon: Icons.bug,
    text: i18n.t("kiem-tra-loi-mang")
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
]
</script>
