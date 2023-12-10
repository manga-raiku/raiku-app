<route lang="yaml">
name: search
alias: /~:sourceId?/search
meta:
  hiddenHeader: $lt.md
  needSelectPlugin: true
  isTab: true
</route>

<template>
  <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page">
    <q-toolbar>
      <AppHeaderIconApp v-if="!route.query.query" no-name class="pr-2" />
      <q-btn v-else flat dense round class="mr-2" @click="router.back()">
        <i-fluent-chevron-left-24-regular width="25" height="25" />
      </q-btn>

      <div
        class="flex flex-nowrap items-center relative w-full bg-[#2a2a2a] h-[39px] <md:h-[35px] rounded-[30px] py-1"
      >
        <div
          class="relative w-full h-full cursor-text"
          @click="mobileSearching = true"
        >
          <span
            v-if="!route.query.query"
            class="absolute top-1/2 left-23px translate-y--1/2 text-[#818181]"
            >{{ $t("tim-kiem") }}</span
          >
          <span class="absolute top-1/2 left-23px translate-y--1/2">{{
            route.query.query
          }}</span>
        </div>
        <q-btn
          round
          unelevated
          class="text-[#aaa] h-full flex items-center"
          v-show="route.query.query"
          @click="
            router.push({
              ...route,
              query: {
                ...route.query,
                query: undefined
              }
            })
          "
        >
          <i-ep-close-bold class="size-1.5em" />
        </q-btn>
        <q-btn
          round
          unelevated
          class="text-[#aaa] h-full flex items-center mr-2"
          type="submit"
        >
          <i-fluent-search-24-regular class="size-1.5em" />
        </q-btn>
      </div>

      <AppHeaderSearchMB v-model:searching="mobileSearching" />

      <AppHeaderUser v-if="!route.query.query" />
    </q-toolbar>
    <q-toolbar v-if="!route.query.query">
      <div class="flex flex-nowrap items-center mx-3">
        <div class="text-gray-300 mr-2">{{ $t("bang-xep-hang") }}</div>

        <div class="overflow-x-auto text-[14px] text-grey">
          <div
            v-for="({ name, value }, index) in typesRank"
            :key="value"
            class="inline-block px-2 py-2"
            :class="{
              'text-white text-weight-medium': activeIndex === index
            }"
            @click="swiperRef?.slideTo(index)"
          >
            {{ name }}
          </div>
        </div>
      </div>
    </q-toolbar>
    <q-toolbar v-if="route.query.query && isSingleData(data)">
      <div class="py-2 px-4">
        <span class="text-gray-400 mr-1">{{ $t("tim-kiem-2dot") }} </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data && !loading" class="text-gray-300">
          <span class="mx-2">&bull;</span
          >{{ $t("size-trang-ket-qua", [data.maxPage]) }}
        </span>
      </div>
    </q-toolbar>
  </q-header-custom>

  <q-page
    padding
    :style-fn="
      (offset, height) => ({
        height: height - offset + 'px'
      })
    "
  >
    <template v-if="!route.query.query">
      <div class="w-full h-full">
        <!-- swiper -->

        <Swiper
          :slides-per-view="1"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
          class="h-full"
        >
          <swiper-slide
            v-for="{ value } in typesRank"
            :key="value"
            class="h-full overflow-y-auto scroll-smooth"
            style="white-space: pre-wrap"
          >
            <section
              v-if="
                !(_dataInStoreTmp = dataStore.get(value)) ||
                _dataInStoreTmp.status === 'pending'
              "
            >
              <div v-for="item in 12" :key="item" class="my-4 px-2">
                <CardVerticalSKT />
              </div>
            </section>
            <q-pull-to-refresh
              v-else-if="_dataInStoreTmp.status === 'success'"
              @refresh="refreshRank($event, value)"
            >
              <div
                v-for="(item, index) in _dataInStoreTmp.response.items"
                :key="item.name"
                class="my-4 px-2"
              >
                <CardVertical :data="item">
                  <template #inside-image>
                    <Rank :index="index" />
                  </template>
                </CardVertical>
              </div>
            </q-pull-to-refresh>
          </swiper-slide>
        </Swiper>
      </div>
    </template>

    <section v-else>
      <div
        v-if="!$q.screen.lt.md && isSingleData(data)"
        class="py-2 px-4 text-16px text-left"
      >
        <span class="text-gray-400 mr-1">{{ $t("tim-kiem-2dot") }} </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data && !loading" class="text-gray-300">
          <span class="mx-2">&bull;</span
          >{{ $t("size-trang-ket-qua", [data.maxPage]) }}
        </span>
      </div>

      <template v-if="data && !loading">
        <template v-if="isSingleData(data)">
          <InfiniteScroll v-if="data.items.length > 0" @load="onLoad">
            <GridCard :items="data.items" />
          </InfiniteScroll>
          <div v-else class="text-20px text-weight-normal text-center q-my-sm">
            <img
              src="~assets/search_no_result.svg"
              alt="search_no_result"
              class="w-240px sm:w-450px max-w-100% mx-auto"
            />
            {{ $t("khong-co-ket-qua") }}
            <br />
            <div
              class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
            >
              {{ $t("search-no-result-msg") }}
            </div>
          </div>
        </template>
        <template v-else>
          <section
            v-for="{ meta, promise } in data"
            :key="meta.id"
            class="px-2 sm:px-4 md:px-8"
          >
            <router-link
              class="text-17px text-light-900 leading-normal flex items-center justify-between relative cursor-pointer py-1 px-2 mx--2 rounded-xl transition-bg duration-200ms hover:bg-#fff hover:bg-opacity-10"
              v-ripple
              :to="{
                ...route,
                name: undefined,
                path: `/~${meta.id}/search`,
                params: {
                  ...route.params,
                  sourceId: meta.id
                }
              }"
            >
              <div>
                {{ meta.name }}
                <span class="text-12px"
                  >(
                  {{
                    $t("size-trang-ket-qua", [
                      promise.value?.ok ? promise.value.data.maxPage : "__"
                    ])
                  }})</span
                >
              </div>

              <i-fluent-chevron-right-24-regular class="size-1.5em" />
            </router-link>
            <div
              class="py-10px overflow-x-scroll flex flex-nowrap scrollbar-custom mx--10px mt--5px"
            >
              <div v-if="!promise.value" class="w-full">
                <q-spinner size="1.5em" class="my-6 mx-10" />
              </div>
              <div
                v-else-if="
                  promise.value.ok && promise.value.data.items.length === 0
                "
                class="text-gray-300 py-6 px-10 w-full text-center q-my-sm text-16px"
              >
                <div class="text-18px leading-normal text-white mb-1">
                  {{ randomEmoji("sad") }}
                </div>

                {{ $t("khong-co-ket-qua") }}
              </div>
              <div
                v-else-if="promise.value.ok"
                v-for="item in promise.value.data.items"
                :key="item.name"
                class="w-28.57% sm:w-23.25% md:w-15.62% flex-none px-[10px] py-2"
              >
                <Card :data="item" no-hover />
              </div>
              <div v-else class="w-full">
                <div class="text-20px text-weight-normal q-my-sm">
                  {{ $t("rat-tiec-da-xay-ra-loi") }}
                </div>
                <div
                  class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
                >
                  {{ promise.value.data + "" }}
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- <div
        v-if="data.maxPage > 1 && $q.screen.gt.sm"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div> -->
      </template>
      <ErrorDisplay v-else-if="error" :error="error" :retry-async="runAsync" />
      <template v-else>
        <SkeletonGridCard :count="40" />
      </template>
    </section>
  </q-page>

  <FABPluginSelect v-model="paramSourceId" />
</template>

<script lang="ts" setup>
import type { API, General, MetaManga } from "raiku-pgs/plugin"
import { randomEmoji } from "src/logic/emoji-charater"
import type { Swiper as TSwiper } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"
import "swiper/css/grid"

const props = defineProps<{
  sourceId?: string
}>()

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const $q = useQuasar()
const pluginStore = usePluginStore()
const { t } = i18n

const paramSourceId = ref(props.sourceId ?? null)
watch(paramSourceId, (sourceId) => {
  if (sourceId) {
    void router.push({
      ...route,
      name: undefined,
      path: `/~${sourceId}/search`,
      params: {
        sourceId,
        ...route.params
      }
    })
  }
})

const api = pluginStore.useApi(toGetter(props, "sourceId"), true)

const title = () => t("tim-kiem-query", [route.query.query ?? ""])
const description = title
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
const typesRank = computedAsync<
  | {
      value: string
      name: string
    }[]
  | undefined
>(
  async () =>
    (await (await api.value).Rankings).map((item) => {
      return {
        value: item.value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (item.name as unknown as any)[i18n.locale.value] as string
      }
    }),
  undefined,
  {
    onError: WARN
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSingleData(data: any): data is Omit<typeof data, "items"> & {
  items: MetaManga[]
} {
  return !Array.isArray(data)
}

const { data, run, error, loading, runAsync } = useRequest(
  async () => {
    if (!route.query.query) return Promise.resolve(undefined)

    if (props.sourceId) {
      const data = await (await api.value).search(route.query.query + "", 1)
      return {
        ...data,
        items: shallowReactive(data.items)
      } as Omit<typeof data, "items"> & {
        items: MetaManga[]
      }
    }

    return pluginStore.getAllPlugins().then((plugins) =>
      Promise.all(
        plugins.map(async ({ id }) => {
          const { meta, plugin } = await pluginStore.get(id)
          return {
            meta,
            promise: computedAsync<
              | {
                  ok: true
                  data: General
                }
              | {
                  ok: false
                  data: unknown
                }
            >(async () => {
              try {
                return {
                  ok: true,

                  data: await plugin.search(route.query.query + "", 1)
                }
              } catch (err) {
                return { ok: false, data: err }
              }
            })
          }
        })
      )
    )
  },
  {
    refreshDeps: [api, () => route.query.query],
    refreshDepsAction() {
      run()
    }
  }
)
const onLoad = useLoadMorePage(
  (page) => api.value.then((res) => res.search(route.query.query + "", page)),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data as unknown as any
)

const mobileSearching = ref(false)
//  ========== top truyen ==========

const dataStore = shallowReactive<
  Map<
    string,
    | {
        status: "pending" | "error"
        response?: unknown
      }
    | {
        status: "success"
        response: Awaited<ReturnType<API["getRanking"]>>
      }
  >
>(new Map())
let _dataInStoreTmp: ReturnType<typeof dataStore.get>

async function fetchRankType(type: string) {
  console.log("heap log %s", type)
  if (dataStore.get(type)?.status === "success") return

  try {
    dataStore.set(type, {
      status: "pending"
    })
    console.log("fetch %s", type)
    dataStore.set(type, {
      status: "success",
      response: await (await api.value).getRanking(type, 1, {})
    })
  } catch (err) {
    dataStore.set(type, {
      status: "error",
      response: err
    })
    console.error(err)
    $q.notify({
      message: err + ""
    })
  }
}
async function refreshRank(done: () => void, type: string) {
  try {
    dataStore.set(type, {
      status: "success",
      response: await (await api.value).getRanking(type, 1, {})
    })
  } catch (err) {
    $q.notify({
      message: err + ""
    })
    // eslint-disable-next-line functional/no-throw-statement
    throw err
  }
  done()
}

const swiperRef = ref()
const activeIndex = ref(0)
watch(
  [activeIndex, typesRank],
  ([activeIndex, typesRank]) => {
    void (
      typesRank?.[activeIndex] && fetchRankType(typesRank[activeIndex].value)
    )

    console.log({ activeIndex, typesRank })
  },
  { immediate: true }
)

function onSwiper(swiper: TSwiper) {
  swiperRef.value = swiper
  activeIndex.value = swiper.activeIndex
}

function onSlideChange(swiper: TSwiper) {
  activeIndex.value = swiper.activeIndex
}
</script>
