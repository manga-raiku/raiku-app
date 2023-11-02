<template>
  <q-drawer
    v-if="$q.screen.gt.sm && route.meta.hiddenDrawerScope !== true"
    :model-value="true"
    show-if-above
    :width="Math.min(400, ~~$q.screen.width / 4)"
    :breakpoint="500"
    class="bg-dark-page overflow-visible column flex-nowrap"
  >
    <q-toolbar>
      <q-toolbar-title>{{ $t("cai-dat") }}</q-toolbar-title>
    </q-toolbar>

    <div class="h-full overflow-y-auto scrollbar-custom">
      <q-list class="mx-2">
        <template
          v-for="{ icon, text, to, href } in [
            {
              icon: Icons.document,
              text: 'Tài khoản',
              to: '/app/myaccount'
            },
            ...buttons
          ]"
          :key="text"
        >
          <q-item
            clickable
            v-ripple
            class="min-h-0 my-2 rounded-xl"
            :to="to"
            :href="href"
            :target="href ? '_blank' : undefined"
            active-class=""
            exact-active-class="bg-[rgba(255,255,255,0.1)] text-main"
          >
            <q-item-section avatar class="pr-0 min-w-0">
              <component
                v-if="!to || router.resolve(to).fullPath !== route.fullPath"
                :is="icon[0]"
                width="23"
                height="23"
              />
              <component v-else :is="icon[1]" width="23" height="23" />
            </q-item-section>
            <q-item-section class="ml-5">
              <q-item-label class="flex items-center">
                {{ text }}
                <i-solar-arrow-right-up-outline
                  v-if="href"
                  class="size-1em text-gray-400 ml-2"
                />
              </q-item-label>
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
import { Icons } from "src/Icons"
import type { Icon } from "src/Icons"

import antDesignAppleOutlined from "~icons/ant-design/apple-outlined"

const router = useRouter()
const route = useRoute()
const i18n = useI18n()

const title = "Ứng dụng này"
const description = title
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const buttons: ComputedRef<
  {
    href?: string
    to?: string
    icon: [Icon, Icon]
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
    href: "https://ko-fi.com/tachib_shin",
    icon: Icons.user_heart,
    text: i18n.t("tai-tro-ung-ho")
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
    text: i18n.t("pwa-cho-ios-va-desktop")
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
])
</script>
