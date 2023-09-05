<template>
  <q-drawer
    v-if="$q.screen.gt.sm"
    :model-value="true"
    show-if-above
    :width="250"
    :breakpoint="500"
    class="bg-dark-page overflow-visible column flex-nowrap"
  >
    <q-toolbar>
      <q-toolbar-title>Cài đặt</q-toolbar-title>
    </q-toolbar>

    <div class="h-full overflow-y-auto scrollbar-custom">
      <q-list class="mx-2">
        <template
          v-for="{ icon, text, to, href } in [
            {
              icon: Icons.document,
              text: 'Tài khoản',
              to: '/app/myaccount',
            },
            ...buttons,
          ]"
          :key="text"
        >
          <q-item
            clickable
            v-ripple
            class="min-h-0 my-2 rounded-xl"
            :to="to"
            :href="href"
            active-class=""
            exact-active-class="bg-[rgba(255,255,255,0.1)] text-main"
          >
            <q-item-section avatar class="pr-0 min-w-0">
              <Icon
                v-if="!to || router.resolve(to).fullPath !== route.fullPath"
                :icon="icon[0]"
                width="23"
                height="23"
              />
              <Icon v-else :icon="icon[1]" width="23" height="23" />
            </q-item-section>
            <q-item-section class="ml-5">
              <q-item-label class="text-[16px]">{{ text }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </q-drawer>

  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { Icons, isCapacitor } from "src/constants"

const router = useRouter()
const route = useRoute()
const buttons: {
  href?: string
  to?: string
  icon: [string, string]
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
    icon: ["ant-design:apple-outlined", "ant-design:apple-outlined"],
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
        return isCapacitor ? (await App.getInfo()).version : version
      } catch {
        return version
      }
    }),
  },
]
</script>
