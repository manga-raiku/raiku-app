<template>
  <q-btn v-bind="attrs" flat round unelevated>
    <q-avatar v-if="authStore.session || $q.screen.lt.md" size="35px">
      <q-img
        v-if="!$q.screen.lt.md"
        :src="
          authStore.profile?.avatar_url ??
          `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
        "
        no-spinner
      />
      <i-solar-user-circle-bold-duotone v-else class="size-35px" />
    </q-avatar>
    <i-solar-menu-dots-bold v-else class="size-1.5em rotate-90deg" />
    <!-- <component v-else :is="Icons.user_circle[1]" class="size-30px" /> -->
    <!-- <component v-else :is="Icons.settings[0]" width="30" height="30" /> -->

    <q-menu
      v-model="showMenuAccount"
      class="flex flex-nowrap flex-col bg-dark-page shadow-xl md:rounded-xl <md:w-full <md:!left-0 <md:!top-0 <md:!max-w-full <md:!max-h-full <md:!h-full"
      :transition-show="$q.screen.lt.md ? 'jump-up' : undefined"
      :transition-hide="$q.screen.lt.md ? 'jump-down' : undefined"
      :transition-duration="$q.screen.lt.md ? 100 : undefined"
    >
      <q-toolbar v-if="$q.screen.lt.md">
        <q-btn round v-close-popup>
          <i-line-md-close class="size-2em" />
        </q-btn>
      </q-toolbar>

      <q-card
        class="transparent min-w-300px px-2 pb-3 h-full flex-1 min-h-0 flex flex-nowrap flex-col"
      >
        <div v-if="authStore.session && tabMenuAccountActive === 'normal'">
          <q-item class="rounded-xl">
            <q-item-section avatar>
              <q-avatar size="45px">
                <q-img
                  :src="
                    authStore.profile?.avatar_url ??
                    `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
                  "
                  no-spinner
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-weight-medium text-subtitle1">{{
                authStore.profile?.full_name
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="bg-[rgba(255,255,255,0.1)]" />
        </div>
        <div v-else>
          <q-item
            class="rounded-xl"
            clickable
            v-ripple
            :to="`/app/sign-in?redirect=${route.fullPath}`"
          >
            <q-item-section avatar>
              <q-avatar size="45px">
                <component :is="Icons.user_circle[1]" class="size-45px" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-weight-medium text-subtitle1">{{
                $t("dang-nhap")
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="bg-[rgba(255,255,255,0.1)]" />
        </div>

        <div class="flex-1 h-full min-h-0 overflow-y-auto scrollbar-custom">
          <q-list v-if="tabMenuAccountActive === 'normal'">
            <template v-if="authStore.session">
              <q-item
                clickable
                v-ripple
                to="/app/myaccount"
                active-class=""
                class="rounded-xl"
              >
                <q-item-section avatar class="min-w-0">
                  <component
                    :is="Icons.info_circle[0]"
                    width="20"
                    height="20"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("trung-tam-ca-nhan") }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                class="rounded-xl"
                @click="authStore.signOut"
              >
                <q-item-section avatar class="min-w-0">
                  <i-solar-logout-line-duotone width="20" height="20" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("dang-xuat") }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator class="bg-[rgba(255,255,255,0.1)]" />
            </template>

            <template v-if="updatingCache && installedSW">
              <q-item>
                <q-item-section avatar class="min-w-0">
                  <q-circular-progress
                    indeterminate
                    rounded
                    show-value
                    size="35px"
                    color="main"
                  >
                    <i-solar-smartphone-update-bold-duotone
                      width="24"
                      height="24"
                    />
                  </q-circular-progress>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    $t("dang-cap-nhat-ung-dung")
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator class="bg-[rgba(255,255,255,0.1)]" />
            </template>

            <template v-for="item in buttons" :key="item.text">
              <q-separator
                v-if="item.divider"
                class="bg-[rgba(255,255,255,0.1)]"
              />

              <q-item
                clickable
                v-ripple
                :href="item.href"
                :to="item.to"
                @click="item.onClick"
                class="rounded-xl"
              >
                <q-item-section avatar class="min-w-0">
                  <component :is="item.icon[0]" width="20" height="20" />
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
              </q-item>
            </template>
          </q-list>

          <q-list v-if="tabMenuAccountActive === 'locale'">
            <q-item class="rounded-xl">
              <q-item-section avatar class="min-w-0">
                <q-btn
                  round
                  dense
                  unelevated
                  @click="tabMenuAccountActive = 'normal'"
                >
                  <i-fluent-ios-arrow-ltr-24-regular width="20" height="20" />
                </q-btn>
              </q-item-section>
              <q-item-section>{{ $t("chon-ngon-ngu-cua-ban") }}</q-item-section>
            </q-item>

            <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

            <q-item
              v-for="{ name, code } in langs"
              :key="code"
              clickable
              v-ripple
              class="rounded-xl"
              @click="settingsStore.locale = code"
            >
              <q-item-section avatar class="min-w-0">
                <i-fluent-checkmark-24-regular
                  v-if="settingsStore.locale === code"
                  width="20"
                  height="20"
                />
                <span v-else class="block w-[20px]" />
              </q-item-section>
              <q-item-section>{{ name }}</q-item-section>
            </q-item>
          </q-list>

          <q-list v-if="tabMenuAccountActive === 'setting'">
            <q-item class="rounded-xl">
              <q-item-section avatar class="min-w-0">
                <q-btn
                  round
                  dense
                  unelevated
                  @click="tabMenuAccountActive = 'normal'"
                >
                  <i-fluent-ios-arrow-ltr-24-regular width="20" height="20" />
                </q-btn>
              </q-item-section>
              <q-item-section>{{ $t("cai-dat-chung") }}</q-item-section>
            </q-item>

            <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->
          </q-list>
        </div>
      </q-card>
    </q-menu>
  </q-btn>

  <q-btn
    v-if="!authStore.session && !$q.screen.lt.md"
    v-bind="attrs"
    flat
    round
    unelevated
    class="font-weight-normal"
    to="/app/sign-in"
  >
    <i-solar-user-circle-bold-duotone class="size-30px" />
  </q-btn>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { Icons } from "src/Icons"
import type { Icon } from "src/Icons"
import { installedSW, updatingCache } from "src/logic/state-sw"
import langs from "virtual:i18n-langs"

import antDesignAppleOutlined from "~icons/ant-design/apple-outlined"

defineOptions({
  inheritAttrs: false
})

const authStore = useAuthStore()
const route = useRoute()
const settingsStore = useSettingsStore()
const stateStore = useStateStore()
const attrs = useAttrs()
const i18n = useI18n()

const showMenuAccount = ref(false)
// account
// showMenuAccount
const tabMenuAccountActive = ref<"normal" | "locale" | "setting">("normal")
watch(showMenuAccount, (val) => {
  if (val) tabMenuAccountActive.value = "normal"
})

const buttons: {
  divider?: true
  href?: string
  to?: string
  onClick?: () => void
  icon: [Icon, Icon]
  text: string
  side?: Ref<string>
}[] = [
  {
    // eslint-disable-next-line no-void
    onClick: () => void (tabMenuAccountActive.value = "locale"),
    icon: Icons.translate,
    text: i18n.t("ngon-ngu")
  },
  {
    to: "/app/settings",
    icon: Icons.settings,
    text: i18n.t("cai-dat")
  },
  {
    divider: true,
    to: "/app/settings/check-network",
    icon: Icons.bug,
    text: i18n.t("kiem-tra-loi-mang")
  },
  {
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
]
</script>
