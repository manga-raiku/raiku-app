<route lang="yaml">
meta:
  hiddenHeader: $lt.md
</route>

<template>
  <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
    <q-toolbar>
      <AppHeaderIconApp v-if="!route.query.query" no-name class="pr-2" />
      <q-btn
        v-else
        flat
        dense
        round
        class="mr-2"
        @click="
          router.push({ ...route, query: { ...route.query, query: undefined } })
        "
      >
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
                query: undefined,
              },
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
              'text-white text-weight-medium': activeIndex === index,
            }"
            @click="swiperRef?.slideTo(index)"
          >
            {{ name }}
          </div>
        </div>
      </div>
    </q-toolbar>
    <q-toolbar v-if="route.query.query">
      <div class="py-2 px-4">
        <span class="text-gray-400 mr-1">{{ $t("tim-kiem-2dot") }} </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data" class="text-gray-300">
          <span class="mx-2">&bull;</span
          >{{ $t("size-trang-ket-qua", [data.maxPage]) }}
        </span>
      </div>
    </q-toolbar>
  </q-header>

  <q-page
    padding
    :style-fn="
      (offset, height) => ({
        height: height - offset + 'px',
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
                :key="item.path"
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
      <div v-if="!$q.screen.lt.md" class="py-2 px-4 text-16px text-left">
        <span class="text-gray-400 mr-1">{{ $t("tim-kiem-2dot") }} </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data" class="text-gray-300">
          <span class="mx-2">&bull;</span
          >{{ $t("size-trang-ket-qua", [data.maxPage]) }}
        </span>
      </div>

      <template v-if="data">
        <InfiniteScroll v-if="data.items.length > 0" @load="onLoad">
          <GridCard :items="data.items" />
        </InfiniteScroll>
        <div v-else class="text-center text-20px py-10">
          {{ $t("khong-co-ket-qua") }}
        </div>

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
</template>

<script lang="ts" setup>
import type { API } from "raiku-pgs"
import { Nettruyen, nettruyen } from "src/apis/nettruyen/runs/$"
import type { Swiper as TSwiper } from "swiper"
import { Swiper, SwiperSlide } from "swiper/vue"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/autoplay"
import "swiper/css/grid"

const route = useRoute()
const router = useRouter()
const i18n = useI18n()

const title = `Tìm kiếm ${route.query.query ?? ""}`
const description = title
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const typesRank = computed(() =>
  nettruyen.Rankings.map((item) => {
    return {
      value: item.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (item.name as unknown as any)[i18n.locale.value],
    }
  }),
)

const { data, run, error, runAsync } = useRequest(
  async () => {
    if (!route.query.query) return Promise.resolve(undefined)

    const data = await nettruyen.search(route.query.query + "", 1)
    data.items = shallowReactive(data.items)
    return data
  },
  {
    refreshDeps: [() => route.query.query],
    refreshDepsAction() {
      run()
    },
  },
)
const onLoad = useLoadMorePage(
  (page) => nettruyen.search(route.query.query + "", page),
  data,
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
  if (dataStore.get(type)?.status === "success") return

  try {
    dataStore.set(type, {
      status: "pending",
    })
    console.log("fetch %s", type)
    dataStore.set(type, {
      status: "success",
      response: await nettruyen.getRanking(type, 1, {}),
    })
  } catch (err) {
    dataStore.set(type, {
      status: "error",
      response: err,
    })
    console.error(err)
  }
}
async function refreshRank(done: () => void, type: string) {
  dataStore.set(type, {
    status: "success",
    response: await nettruyen.getRanking(type, 1, {}),
  })

  done()
}

const swiperRef = ref()
const activeIndex = ref(0)
watch(
  activeIndex,
  (activeIndex) => fetchRankType(typesRank.value[activeIndex].value),
  { immediate: true },
)

function onSwiper(swiper: TSwiper) {
  swiperRef.value = swiper
  activeIndex.value = swiper.activeIndex
}

function onSlideChange(swiper: TSwiper) {
  activeIndex.value = swiper.activeIndex
}
</script>
