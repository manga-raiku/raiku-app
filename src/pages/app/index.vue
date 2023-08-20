<template>
  <q-page>
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
        <q-item clickable v-ripple to="/app/login">
          <q-item-section avatar>
            <q-avatar>
              <Icon icon="solar:user-circle-bold-duotone" class="size-50px" />
            </q-avatar>
          </q-item-section>
          <q-item-section class="text-16px">
            <q-item-label>Đăng nhập</q-item-label>
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
            <Icon :icon="item.icon" class="size-25px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="item.side" side>{{ item.side }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- <q-input v-model="binaryAuth" placeholder="Enter binary auth" /> -->
  </q-page>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { isCapacitor } from "src/constants"

const buttons = [
  {
    href: "https://ko-fi.com/tachib_shin",
    icon: "solar:user-heart-bold-duotone",
    text: "Tài trợ / Ủng hộ",
  },
  {
    to: "/app/settings",
    icon: "solar:settings-bold-duotone",
    text: "Cài đặt",
  },
  {
    href: "mailto://contact@mangaraiku.eu.org?title=Feedback%20app%20git.shin.raiku",
    icon: "solar:info-circle-bold-duotone",
    text: "Phản hồi",
  },
  {
    href: "https://github.com/manga-raiku/manga-raiku",
    icon: "solar:code-bold-duotone",
    text: "Mã nguồn mở",
  },
  {
    href: "https://mangaraiku.eu.org",
    icon: "logos:pwa",
    text: "Web tiến bộ cho iOS và máy tính",
  },
  {
    to: "/app/settings/check-network",
    icon: "solar:bug-bold-duotone",
    text: "Kiểm tra lỗi mạng",
  },
  {
    to: "/app/info",
    icon: "solar:notebook-bookmark-bold-duotone",
    text: "Giới thiệu",
    side: computedAsync(async () => {
      try {
        return isCapacitor ? (await App.getInfo()).version : version
      } catch {
        return version
      }
    }),
  },
]
</script>
