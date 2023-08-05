<route lang="yaml">
meta:
  padding: true
</route>

<template>
  <q-header
    v-if="isCapacitor || $q.screen.lt.sm"
    class="bg-dark-page py-1"
    :class="{
      'px-2': !isCapacitor
    }"
  >
    <q-toolbar>
      <AppHeaderIconApp v-if="!isCapacitor" no-name class="pr-2" />
      <q-btn v-else-if="route.query.query" flat dense round class="mr-2">
        <Icon icon="fluent:chevron-left-24-regular" width="25" height="25" />
      </q-btn>

      <div
        class="flex flex-nowrap items-center relative w-full bg-[#2a2a2a] h-[39px] <md:h-[35px] rounded-[30px]"
      >
        <div
          class="relative w-full h-full cursor-text"
          @click="mobileSearching = true"
        >
          <span
            v-if="!route.query.query"
            class="absolute top-1/2 left-23px translate-y--1/2 text-[#818181]"
            >Tìm kiếm</span
          >
          <span class="absolute top-1/2 left-23px translate-y--1/2">{{
            route.query.query
          }}</span>
        </div>
        <q-btn
          round
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
          <Icon icon="ep:close-bold" class="size-1.5em" />
        </q-btn>
        <q-btn
          round
          class="text-[#aaa] h-full flex items-center mr-2"
          type="submit"
        >
          <Icon icon="fluent:search-24-regular" class="size-1.5em" />
        </q-btn>
      </div>

      <AppHeaderSearchMB v-model:searching="mobileSearching" />

      <AppHeaderUser v-if="!isCapacitor" />
    </q-toolbar>
    <q-toolbar v-if="!isCapacitor && route.query.query">
      <div class="py-2 px-4">
        <span class="text-gray-400 mr-1">Tìm kiếm: </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data" class="text-gray-300">
          <span class="mx-2">&bull;</span>{{ data.maxPage }} trang kết quả
        </span>
      </div>
    </q-toolbar>
  </q-header>

  <template v-if="!route.query.query">
    <div v-if="dataTop && !loadingTop">
      <h4 class="text-20px">🔥 Hot trong ngày</h4>
      <!-- <div
            v-if="data.maxPage > 1"
            class="flex items-center justify-center q-pa-md"
          >
            <Pagination :max="data.maxPage" v-model="page" />
          </div> -->
      <section class="row mx--2 font-family-poppins">
        <InfiniteScroll @load="onLoadTop">
          <div
            v-for="(item, index) in dataTop.items"
            :key="item.path"
            class="my-4 col-12 col-md-6 px-2"
          >
            <CardVertical :data="item">
              <template #inside-image>
                <Rank :index="index" />
              </template>
            </CardVertical>
          </div>
        </InfiniteScroll>
      </section>

      <!-- <div
            v-if="data.maxPage > 1"
            class="flex items-center justify-center q-pa-md"
          >
            <Pagination :max="data.maxPage" v-model="page" />
          </div> -->
    </div>
    <template v-else>
      <section class="row mx--2 font-family-poppins">
        <div v-for="item in 12" :key="item" class="my-4 col-12 col-md-6 px-2">
          <CardVerticalSKT />
        </div>
      </section>
    </template>
  </template>

  <section class="mx-4 sm:mx-6 md:mx-8">
    <div v-if="!$q.screen.lt.sm" class="py-2 px-4 text-16px text-left">
      <span class="text-gray-400 mr-1">Tìm kiếm: </span>
      <span class="font-bold truncate">{{ route.query.query }}</span>
      <span v-if="data" class="text-gray-300">
        <span class="mx-2">&bull;</span>{{ data.maxPage }} trang kết quả
      </span>
    </div>

    <template v-if="loading">
      <SkeletonGridCard :count="40" />
    </template>
    <template v-else-if="data">
      <InfiniteScroll v-if="data.items.length > 0" @load="onLoad">
        <GridCard :items="data.items" />
      </InfiniteScroll>
      <div v-else class="text-center text-20px py-10">Không có kết quả</div>

      <!-- <div
        v-if="data.maxPage > 1 && $q.screen.gt.sm"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div> -->
    </template>
  </section>
</template>

<script lang="ts" setup>
import General from "src/apis/nettruyen/runs/[general]"
import TimKiem from "src/apis/nettruyen/runs/tim-kiem"
import { isCapacitor } from "src/constants"

const route = useRoute()
const router = useRouter()

const { data, loading, run } = useRequest(
  async () => {
    if (!route.query.query) return Promise.resolve(undefined)

    const data = await TimKiem(route.query.query + "", 1)
    data.items = shallowReactive(data.items)
    return data
  },
  {
    refreshDeps: [() => route.query.query],
    refreshDepsAction() {
      run()
    },
  }
)
const onLoad = useLoadMorePage(
  (page) => TimKiem(route.query.query + "", page),
  data
)

// top truyen
const {
  data: dataTop,
  loading: loadingTop,
  error: errorTop,
} = useRequest(() =>
  General("/tim-truyen", 1, {
    status: -1,
    sort: 13,
  })
)
const onLoadTop = useLoadMorePage(
  (page) =>
    General("/tim-truyen", page, {
      status: -1,
      sort: 13,
    }),
  dataTop
)

const mobileSearching = ref(false)
</script>
