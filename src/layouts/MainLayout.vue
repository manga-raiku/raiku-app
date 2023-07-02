<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      class="bg-dark-page py-1 px-2"
      :class="{
        '!bg-transparent': route.meta?.transparentHeader,
      }"
    >
      <q-toolbar>
        <router-link to="/" class="flex flex-nowrap items-end">
          <img src="~assets/app_icon.svg" width="35" height="35" />
          <span style="font-family: Caveat" class="text-[25px]"
            >Manga Raiku</span
          >
        </router-link>

        <q-space />

        <form
          @submit.prevent="router.push(`/tim-kiem/${query}`)"
          class="relative md:min-w-[164px] md:w-full max-w-[598px]"
        >
          <q-input
            v-model="query"
            dense
            rounded
            outlined
            clearable
            class="font-weight-normal input-search bg-[rgba(255,255,255,0)] w-full"
            input-style="background-color: transparent"
            :placeholder="t('tim-kiem')"
            @focus="focusing = true"
            @blur="focusing = false"
            @keydown.stop
            ref="inputSearchRef"
          >
            <template #append>
              <q-separator vertical inset class="bg-[rgba(153,153,153,0.3)]" />
              <button
                type="submit"
                class="flex items-center"
                @click.stop.prevent="router.push(`/tim-kiem/${query}`)"
                @mousedown.stop.prevent
              >
                <q-icon name="search" class="pl-6 pr-4 cursor-pointer" />
              </button>
            </template>
          </q-input>

          <transition name="q-transition--fade">
            <ul
              class="absolute w-full bg-dark-page left-0 max-h-[80vh] overflow-y-auto scrollbar-custom pb-4 top-[calc(100%+8px)] !shadow-8"
              v-show="focusing"
              @click.stop.prevent
              @mousedown="
                (event: MouseEvent) => {
                  if (event.button === 2) event.preventDefault()
                }
              "
            >
              <li
                v-if="query"
                class="px-4 mt-1 py-[0.5rem] flex items-center w-full justify-between"
              >
                <div>
                  <span class="text-gray-400 mr-1"
                    >{{ t("tim-kiem-_keyword") }}
                  </span>
                  <span class="font-bold truncate">{{ query }}</span>
                </div>

                <button class="key-enter" type="submit">
                  <span>{{ t("enter") }}</span>
                </button>
              </li>
              <li
                v-if="searchLoading"
                v-for="i in 12"
                :key="i"
                class="flex mt-5 mx-4"
              >
                <q-responsive :ratio="267 / 400" class="w-[90px] rounded">
                  <q-skeleton type="rect" class="absolute w-full h-full" />
                </q-responsive>

                <div class="ml-2 flex-1">
                  <q-skeleton type="text" width="60%" />
                  <q-skeleton type="text" width="100px" height="15px" />
                </div>
              </li>
              <li
                v-else-if="searchResult?.length"
                v-for="item in searchResult"
                :key="item.path"
                class="relative"
                v-ripple
              >
                <router-link
                  :to="item.path"
                  class="flex flex-nowrap mt-5 mx-4"
                >
                  <div>
                    <q-img-custom
                      :ratio="267 / 400"
                      :src="item.image"
                      referrerpolicy="no-referrer"
                      width="90px"
                      class="rounded"
                    />
                  </div>

                  <div class="ml-2">
                    <div class="text-subtitle1 text-weight-medium">
                      {{ item.name }}
                    </div>
                    <div v-if="item.othername" class="text-12px">
                      {{ item.othername }}
                    </div>
                    <div class="text-gray-500">{{ item.chapter }}</div>
                  </div>
                </router-link>
              </li>
              <li v-else class="px-4 py-5 text-center text-gray-400 w-full">
                {{ query ? "Không tìm thấy" : "Nhập để tìm kiếm" }}
              </li>
            </ul>
          </transition>
        </form>

        <q-space />

        <q-btn round unelevated class="mr-2">
          <q-circular-progress
            v-if="updatingCache && installedSW"
            indeterminate
            rounded
            show-value
            size="35px"
            color="main"
          >
            <Icon icon="codicon:github-inverted" width="24" height="24" />
          </q-circular-progress>
          <Icon v-else icon="codicon:github-inverted" width="24" height="24" />

          <q-menu
            anchor="bottom right"
            self="top right"
            class="rounded-xl bg-dark-page shadow-xl"
          >
            <q-card class="transparent w-[280px] px-2 pb-3">
              <q-list>
                <q-item class="rounded-xl">
                  <q-item-section class="text-[15px]">
                    {{ t("ve-ung-dung") }}
                  </q-item-section>
                </q-item>

                <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

                <q-item
                  clickable
                  v-ripple
                  class="rounded-xl"
                  target="_blank"
                  href="https://github.com/anime-vsub/desktop-web"
                >
                  <q-item-section avatar class="min-w-0">
                    <Icon
                      icon="carbon:repo-source-code"
                      width="20"
                      height="20"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{
                      t("ma-nguon-mo-tren-github")
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="rounded-xl"
                  target="_blank"
                  href="https://github.com/anime-vsub/desktop-web/issues"
                >
                  <q-item-section avatar class="min-w-0">
                    <Icon
                      icon="fluent:person-feedback-24-regular"
                      width="20"
                      height="20"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{
                      t("phan-hoi-hoac-bao-loi")
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="rounded-xl"
                  target="_blank"
                  href="https://github.com/anime-vsub/desktop-web/discussions"
                >
                  <q-item-section avatar class="min-w-0">
                    <Icon
                      icon="fluent:plug-disconnected-24-regular"
                      width="20"
                      height="20"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ t("thao-luan") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="rounded-xl"
                  target="_blank"
                  href="https://anime-vsub.github.io/about/sponsors"
                >
                  <q-item-section avatar class="min-w-0">
                    <Icon
                      icon="octicon:sponsor-tiers-24"
                      width="20"
                      height="20"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ t("tai-tro-ung-ho") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple class="rounded-xl">
                  <q-item-section avatar class="min-w-0">
                    <Icon
                      icon="charm:refresh"
                      width="20"
                      height="20"
                      :class="{
                        'animate-spin': false,
                      }"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ t("kiem-tra-cap-nhat") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="!authStore.isLogged"
          flat
          stack
          no-caps
          rounded
          unelevated
          class="font-weight-normal"
          @click="showDialogLogin = true"
        >
          <Icon icon="fluent:person-24-regular" width="20" height="20" />
          {{ t("dang-nhap") }}
        </q-btn>

        <q-btn
          flat
          no-caps
          rounded
          unelevated
          class="font-weight-normal"
          href="https://anime-vsub.github.io"
          target="_blank"
        >
          <Icon icon="fluent:phone-24-regular" width="20" height="20" />
          {{ t("app") }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page :style-fn="route.meta?.styleFn">
        <router-view v-if="Http.version" v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        <NotExistsExtension v-else />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import "@fontsource/caveat"

// =========== suth

import { useEventListener } from "@vueuse/core"
import { Http } from "client-ext-animevsub-helper"
import { debounce, QInput } from "quasar"
import LichSu from "src/apis/runs/lich-su"
import PreSearch from "src/apis/runs/pre-search"
import TruyenDangTheoDoi from "src/apis/runs/truyen-dang-theo-doi"
import { installedSW, updatingCache } from "src/logic/state-sw"
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRequest } from "vue-request"
import { useRoute, useRouter } from "vue-router"

import NotExistsExtension from "./NotExistsExtension.vue"

// key bind

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = { isLogged: false }

const query = ref("")
const {
  data: searchResult,
  loading: searchLoading,
  run,
} = useRequest(() => PreSearch(query.value), {
  manual: true,
})
watch(query, debounce(run, 300))

const focusing = ref(false)

const showDrawer = ref(false)

const hideDrawer = computed(() => route.meta?.hideDrawer === true)
watch(
  hideDrawer,
  (hideDrawer) => {
    if (hideDrawer) showDrawer.value = false
    else showDrawer.value = true
  },
  { immediate: true }
)
// import QrScanner from "qr-scanner"

const showDialogLogin = ref(false)

// ============= states ===============
const showMenuHistory = ref(false)
const showMenuFollow = ref(false)
const showMenuAccount = ref(false)

// history
const { refreshAsync: refreshHistories } = useRequest(() => LichSu(1), {
  manual: true,
  cacheKey: "history",
  cacheTime: 5 * 60 * 1000, //
})
watch(
  showMenuHistory,
  (state) => {
    if (state) refreshHistories()
  },
  { immediate: true }
)

// follow
const { refreshAsync: refreshFavorites } = useRequest(
  () => TruyenDangTheoDoi(1),
  {
    manual: true,
    cacheKey: "favorites",
    cacheTime: 5 * 60 * 1000,
  }
)
watch(
  showMenuFollow,
  (state) => {
    if (state) refreshFavorites()
  },
  { immediate: true }
)

// account
// showMenuAccount
const tabMenuAccountActive = ref<"normal" | "locale" | "setting">("normal")
watch(showMenuAccount, (val) => {
  if (val) tabMenuAccountActive.value = "normal"
})

// key bind /
const inputSearchRef = ref<QInput>()
useEventListener(window, "keypress", (event) => {
  if (checkContentEditable(document.activeElement)) return

  if (event.code === "Slash") {
    event.preventDefault()
    inputSearchRef.value?.focus()
  }
})
</script>

<style lang="scss">
.input-search {
  .q-field__control {
    height: 40px !important;
    input,
    input:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
  }

  .q-field__control:before {
    border-color: rgba(153, 153, 153, 0.3) !important;
  }
  .q-field__control:after {
    border-width: 1px !important;
  }
}

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

.tabs-main .q-tab__content {
  min-width: 0 !important;
}
.tabs-main .q-tabs__content {
  width: 100% !important;
  > .q-tab {
    width: (100% / 5);
  }
}

.only-router-active {
  display: none;
}
</style>

<style lang="scss" scoped>
.notify {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.22s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  &-leave-active {
    position: absolute;
  }
}
</style>

<style lang="scss" scoped>
.key-enter {
  color: #f6f6f7;
  forced-color-adjust: none;
  height: 23px;
  width: auto;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;

  &:hover {
    @apply pt-1;
  }

  span {
    background-color: #727d74;
    box-shadow: inset 0 -4px #202225;
    border: 1px solid hsl(220deg, 7.7%, 22.9%);
    padding: 3px 6px 4px;
    border-radius: 4px;
    min-width: 14px;
    min-height: 14px;
    height: 23px;
    color: #b9bbbe;
  }
}
</style>

<style lang="scss" scoped>
.login-input :deep(.q-field__native) {
  background-color: transparent !important;

  &,
  &:focus,
  &:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
}
.login-input :deep(.q-field__control),
.login-input :deep(.q-field__append) {
  height: 45px !important;
}
</style>

<style lang="scss" scoped>
.hidden-focus-helper :deep(.q-focus-helper) {
  display: none !important;
}
</style>

<style lang="scss">
.card-changelog {
  a {
    color: #58a6ff;
  }
}
</style>
