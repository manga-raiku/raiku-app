<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: false
  hiddenDrawer: true
  auth: null if $lt.md else $lt.md
</route>

<template>
  <q-page v-if="$q.screen.lt.md">
    <video
      src="~/assets/yae-miko-genshin-impact.mp4"
      autoplay
      loop
      muted
      class="h-full object-cover"
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
            <q-item-label>Đăng nhập</q-item-label>
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
import { Icons } from "src/constants"
import type { Icon } from "src/constants"

import antDesignAppleOutlined from "~icons/ant-design/apple-outlined"

const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()

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
    text: "Tài trợ / Ủng hộ",
  },
  {
    to: "/app/settings",
    icon: Icons.settings,
    text: "Cài đặt",
  },
  {
    href: "mailto://contact@mangaraiku.eu.org?title=Feedback%20app%20git.shin.raiku",
    icon: Icons.info_circle,
    text: "Phản hồi",
  },
  {
    href: "https://github.com/manga-raiku/manga-raiku",
    icon: Icons.code_bold,
    text: "Mã nguồn mở",
  },
  {
    href: "https://mangaraiku.eu.org",
    icon: [antDesignAppleOutlined, antDesignAppleOutlined],
    text: "Phiên bản PWA cho iPhone và máy tính",
  },
  {
    to: "/app/settings/check-network",
    icon: Icons.bug,
    text: "Kiểm tra lỗi mạng",
  },
  {
    to: "/app/about",
    icon: Icons.notebook,
    text: "Giới thiệu",
    side: computedAsync(async () => {
      try {
        return (await App.getInfo()).version
      } catch {
        return version
      }
    }),
  },
]

watch(
  () => $q.screen.lt.md,
  (mobile) => {
    if (!mobile) router.push("/app/myaccount")
  },
  { immediate: true },
)
</script>
