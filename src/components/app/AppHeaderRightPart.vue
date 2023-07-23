<template>
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
              <Icon icon="carbon:repo-source-code" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("ma-nguon-mo-tren-github") }}</q-item-label>
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
              <q-item-label>{{ t("phan-hoi-hoac-bao-loi") }}</q-item-label>
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
              <Icon icon="octicon:sponsor-tiers-24" width="20" height="20" />
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

  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuFollow
          ? 'majesticons:bookmark-plus'
          : 'majesticons:bookmark-plus-line'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuFollow"
      class="flex flex-nowrap column bg-dark-page shadow-xl"
    >
      <q-card
        class="transparent shadow-none w-[415px] scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <CardVerticalSKT
            v-if="loadingFavorites"
            v-for="i in 12"
            :key="i"
            class="mb-4"
          />
          <CardVertical
            v-else-if="favorites"
            v-for="item in favorites?.items"
            :key="item.path"
            :data="item"
            class="mb-4"
          />
          <div v-else class="text-center">
            <div class="text-subtitle1 font-weight-medium">
              {{ t("loi-khong-xac-dinh") }}
            </div>
            <q-btn outline rounded color="main" @click="refreshFavorites">{{
              t("thu-lai")
            }}</q-btn>
          </div>
        </q-card-section>
      </q-card>

      <router-link to="/tai-khoan/follow" class="block py-2 text-center">{{
        t("xem-tat-ca")
      }}</router-link>
    </q-menu>
  </q-btn>

  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuHistory ? 'fluent:clock-24-filled' : 'fluent:clock-24-regular'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuHistory"
      class="flex flex-nowrap column bg-dark-page shadow-xl"
    >
      <q-card
        class="transparent shadow-none w-[415px] scrollbar-custom overflow-y-auto"
      >
        <q-card-section>
          <div
            v-if="loadingHistories"
            v-for="i in 12"
            :key="i"
            class="flex mt-1 mb-4 flex-nowrap"
          >
            <q-responsive :ratio="1920 / 1080" class="w-[149px]">
              <q-skeleton class="!rounded-[4px] absolute w-full h-full" />
            </q-responsive>

            <div class="pl-2 flex-1">
              <q-skeleton type="text" class="mt-1" width="60%" />
              <q-skeleton type="text" class="mt-1" width="40px" height="15px" />

              <div class="text-grey mt-1">
                <q-skeleton
                  type="text"
                  class="mt-1"
                  width="60px"
                  height="15px"
                />
              </div>
              <div class="text-grey mt-2">
                <q-skeleton
                  type="text"
                  class="mt-1"
                  width="120px"
                  height="15px"
                />
              </div>
            </div>
          </div>

          <template v-else-if="histories">
            <div v-if="histories.length === 0" class="text-center">
              <div class="text-gray-400 text-subtitle1 py-2">
                {{ t("chua-co-lich-su-xem") }}
              </div>
            </div>

            <template
              v-else
              v-for="(item, index) in histories.map((item) => {
                return {
                  ...item,
                  timestamp: dayjs(item.timestamp.toDate()),
                }
              })"
              :key="item.id"
            >
              <div
                v-if="
                  !histories[index - 1] ||
                  !dayjs(histories[index - 1].timestamp.toDate()).isSame(
                    item.timestamp,
                    'day'
                  )
                "
                class="text-subtitle2 text-weight-normal"
              >
                {{
                  item.timestamp.isToday()
                    ? "Hôm nay"
                    : item.timestamp.isYesterday()
                    ? "Hôm qua"
                    : item.timestamp.get("date") +
                      " thg " +
                      (item.timestamp.get("month") + 1)
                }}
              </div>
              <router-link
                class="bg-transparent flex mt-1 mb-4 flex-nowrap"
                style="white-space: initial"
                :to="`/phim/${item.season ?? item.id}/${parseChapName(
                  item.last.name
                )}-${item.last.chap}`"
              >
                <div class="w-[149px]">
                  <q-img
                    no-spinner
                    :src="forceHttp2(item.poster)"
                    referrerpolicy="no-referrer"
                    :ratio="1920 / 1080"
                    class="!rounded-[4px]"
                  >
                    <BottomBlur class="px-0 h-[40%]">
                      <div
                        class="absolute bottom-0 left-0 z-10 w-full min-h-0 !py-0 !px-0"
                      >
                        <q-linear-progress
                          :value="item.last.cur / item.last.dur"
                          rounded
                          color="main"
                          class="!h-[3px]"
                        />
                      </div>
                    </BottomBlur>
                    <span
                      class="absolute text-white z-10 text-[12px] bottom-2 right-2"
                      >{{ parseTime(item.last.cur) }}</span
                    >
                  </q-img>
                </div>

                <div class="pl-2 flex-1">
                  <span class="line-clamp-3 mt-1">{{ item.name }}</span>
                  <div class="text-grey mt-1">
                    <template v-if="item.seasonName"
                      >{{ t("_season-tap", [item.seasonName]) }}
                    </template>
                    <template v-else>{{ t("Tap") }}</template>
                    {{ item.last.name }}
                  </div>
                  <div class="text-grey mt-2">
                    {{
                      t("xem-luc-_value", [
                        item.timestamp.format(
                          item.timestamp.isToday() ? "HH:mm" : "DD/MM/YYYY"
                        ),
                      ])
                    }}
                  </div>
                </div>
              </router-link>
            </template>
          </template>

          <div v-else class="text-center">
            <div class="text-subtitle1 font-weight-medium">
              {{ t("loi-khong-xac-dinh") }}
            </div>
            <q-btn outline rounded color="main" @click="refreshHistories">{{
              t("thu-lai")
            }}</q-btn>
          </div>
        </q-card-section>
      </q-card>

      <router-link to="/tai-khoan/history" class="block py-2 text-center">{{
        t("xem-tat-ca")
      }}</router-link>
    </q-menu>
  </q-btn>

  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuNotify
          ? 'clarity:notification-solid'
          : 'clarity:notification-line'
      "
      width="24"
      height="24"
    />

    <q-badge
      floating
      rounded
      transparent
      class="top-0"
      :label="notificationStore.max"
    />

    <q-menu
      v-model="showMenuNotify"
      class="bg-dark-page scrollbar-custom shadow-xl"
    >
      <q-card class="bg-transparent max-w-[435px]">
        <q-card-section>
          <q-list v-if="notificationStore.loading" class="bg-transparent">
            <q-item v-for="item in 12" :key="item" class="rounded-xl">
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-normal">
                  <q-skeleton type="text" width="40%" />
                  <q-skeleton type="text" width="60%" />
                </q-item-label>
                <q-item-label>
                  <q-skeleton type="text" width="100" height="15px" />
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-responsive :ratio="120 / 81" class="w-[120px] rounded-sm">
                  <q-skeleton type="rect" class="absolute w-full h-full" />
                </q-responsive>
              </q-item-section>
            </q-item>
          </q-list>

          <q-list v-else class="bg-transparent">
            <transition-group name="notify">
              <q-item
                v-for="item in notificationStore.items"
                :key="item.id"
                :to="item.path"
                class="hidden-focus-helper"
              >
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-normal"
                    >{{ item.name }}
                    <span class="text-grey">
                      {{ t("da-cap-nhat") }}
                    </span>
                    {{ item.chap }}</q-item-label
                  >
                  <q-item-label class="text-grey">{{ item.time }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="flex flex-nowrap">
                    <q-img
                      no-spinner
                      :src="forceHttp2(item.image!)"
                      referrerpolicy="no-referrer"
                      width="128px"
                      :ratio="120 / 81"
                      class="rounded-sm"
                    />
                    <div class="mr-[-32px]">
                      <q-btn
                        round
                        dense
                        unelevated
                        icon="close"
                        @click.prevent="notificationStore.remove(item.id)"
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </transition-group>
          </q-list>

          <div
            v-if="notificationStore.items.length < notificationStore.max"
            class="text-grey text-center mt-3 mx-2 mb-3"
          >
            {{
              t(
                "do-api-server-khong-day-du-ban-phai-xoa-nhung-thong-bao-moi-de-xem-nhung-thong-bao-cu"
              )
            }}
          </div>
        </q-card-section>
      </q-card>
    </q-menu>
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



</template>

<script lang="ts" setup>
import "@fontsource/caveat"

import "@fontsource/poppins"
// =========== suth

import { Icon } from "@iconify/vue"

import LichSu from "src/apis/runs/lich-su"
import TruyenDangTheoDoi from "src/apis/runs/truyen-dang-theo-doi"
import { installedSW, updatingCache } from "src/logic/state-sw"

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = { isLogged: false }
const $q = useQuasar()

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

</script>

<style></style>
