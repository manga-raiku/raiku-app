<route lang="yaml">
meta:
  padding: true
</route>

<template>
  <q-header v-if="$q.screen.lt.sm" class="bg-dark-page py-1 px-2">
    <q-toolbar>
      <AppHeaderIconApp no-name class="pr-2" />

      <div
        class="flex flex-nowrap items-center relative w-full mr-1 bg-[#2a2a2a] h-[39px] <md:h-[35px] rounded-[30px]"
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
      </div>

      <AppHeaderSearchMB v-model:searching="mobileSearching" />

      <AppHeaderUser />
    </q-toolbar>
    <q-toolbar>
      <div class="py-2 px-4">
        <span class="text-gray-400 mr-1">Tìm kiếm: </span>
        <span class="font-bold truncate">{{ route.query.query }}</span>
        <span v-if="data" class="text-gray-300">
          <span class="mx-2">&bull;</span>{{ data.maxPage }} trang kết quả
        </span>
      </div>
    </q-toolbar>
  </q-header>

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
import { debounce } from "quasar"
import TimKiem from "src/apis/runs/tim-kiem"

const route = useRoute()
const router = useRouter()

const { data, loading, run } = useRequest(
  () => TimKiem(route.query.query + "", 1),
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

const mobileSearching = ref(false)
</script>
