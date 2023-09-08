<template>
  <q-btn flat round unelevated>
    <q-avatar v-if="authStore.session" size="35px">
      <q-img
        :src="
          authStore.profile?.avatar_url ??
          `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
        "
        no-spinner
      />
    </q-avatar>
    <Icon v-else icon="solar:settings-line-duotone" width="30" height="30" />

    <q-menu
      v-model="showMenuAccount"
      class="flex flex-nowrap flex-col bg-dark-page shadow-xl md:rounded-xl <md:w-full <md:!left-0 <md:!top-0 <md:!max-w-full <md:!max-h-full <md:!h-full"
      :transition-show="$q.screen.lt.md ? 'jump-up' : undefined"
      :transition-hide="$q.screen.lt.md ? 'jump-down' : undefined"
      :transition-duration="$q.screen.lt.md ? 100 : undefined"
    >
      <q-toolbar v-if="$q.screen.lt.md">
        <q-btn round v-close-popup>
          <Icon icon="line-md:close" class="size-2em" />
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
                  <Icon :icon="Icons.info_circle[0]" width="20" height="20" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Trung tâm cá nhân</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                class="rounded-xl"
                @click="authStore.signOut"
              >
                <q-item-section avatar class="min-w-0">
                  <Icon
                    icon="solar:logout-line-duotone"
                    width="20"
                    height="20"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Thoát</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator class="bg-[rgba(255,255,255,0.1)]" />
            </template>
            <template v-else>
              <q-item class="rounded-xl">
                <q-item-section>Cài đặt</q-item-section>
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
                  <Icon :icon="item.icon[0]" width="20" height="20" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.text }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="item.onClick || item.side" side>
                  <template v-if="!item.onClick">
                    {{ item.side?.value }}
                  </template>
                  <Icon v-else icon="fluent:chevron-right-24-regular" />
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
                  <Icon
                    icon="fluent:ios-arrow-ltr-24-regular"
                    width="20"
                    height="20"
                  />
                </q-btn>
              </q-item-section>
              <q-item-section>Chọn ngôn ngữ của bạn</q-item-section>
            </q-item>

            <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

            <q-item
              v-for="{ name, code } in languages"
              :key="code"
              clickable
              v-ripple
              class="rounded-xl"
              @click="settingsStore.locale = code"
            >
              <q-item-section avatar class="min-w-0">
                <Icon
                  v-if="settingsStore.locale === code"
                  icon="fluent:checkmark-24-regular"
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
                  <Icon
                    icon="fluent:ios-arrow-ltr-24-regular"
                    width="20"
                    height="20"
                  />
                </q-btn>
              </q-item-section>
              <q-item-section>Cài đặt chung</q-item-section>
            </q-item>

            <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->
          </q-list>
        </div>
      </q-card>
    </q-menu>
  </q-btn>

  <q-btn
    v-if="!authStore.session"
    flat
    stack
    no-caps
    rounded
    unelevated
    class="font-weight-normal"
    to="/app/sign-in"
  >
    <Icon icon="solar:user-circle-bold-duotone" class="size-30px" />
  </q-btn>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import { Icons } from "src/constants"
import { languages } from "src/i18n"

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

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
  icon: [string, string]
  text: string
  side?: Ref<string>
}[] = [
  {
    // eslint-disable-next-line no-void
    onClick: () => void (tabMenuAccountActive.value = "locale"),
    icon: Icons.translate,
    text: "Ngôn ngữ",
  },
  {
    to: "/app/settings",
    icon: Icons.settings,
    text: "Cài đặt",
  },
  {
    divider: true,
    to: "/app/settings/check-network",
    icon: Icons.bug,
    text: "Kiểm tra lỗi mạng",
  },
  {
    divider: true,
    href: "mailto://contact@mangaraiku.eu.org?title=Feedback%20app%20git.shin.raiku",
    icon: Icons.info_circle,
    text: "Phản hồi",
  },
  {
    href: "https://ko-fi.com/tachib_shin",
    icon: Icons.user_heart,
    text: "Tài trợ / Ủng hộ",
  },
  {
    href: "https://github.com/manga-raiku/manga-raiku",
    icon: Icons.code_bold,
    text: "Mã nguồn mở",
  },
  {
    href: "https://mangaraiku.eu.org",
    icon: ["ant-design:apple-outlined", "ant-design:apple-outlined"],
    text: "PWA cho iOS và desktop",
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
</script>
