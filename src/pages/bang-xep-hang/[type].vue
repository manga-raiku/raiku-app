<route lang="yaml">
meta:
  padding: false
</route>

<template>
  <section class="main dark px-4 sm:px-6 md:px-8">
    <header>
      <div
        class="text-32px h-72px flex items-center text-italic text-weight-medium"
      >
        <img
          src="~/assets/trending_fire_1.png"
          class="display-inline-block w-1.2em h-1.2em"
        />
        THỊNH HÀNH
      </div>

      <ul class="mt-2 children:mx-24.5px flex items-center justify-center">
        <li v-for="item in typesRank" :key="item.path">
          <q-btn
            :to="{
              path: item.path,
              query: route.query,
              hash: route.hash,
            }"
            class="text-18px text-weight-bold text-currentColor opacity-50"
            no-caps
            rounded
            unelevated
            :class="{
              '!opacity-100': pathEqual(
                router.resolve(item.path).path,
                route.path
              ),
            }"
            >{{ item.name }}</q-btn
          >
        </li>
      </ul>
    </header>

    <section class="trending-card dark">
      <div class="trending-card__container">
        <div class="flex items-center justify-center">
          <!-- #AD8009 #09AD6B -->
          <TrendingCardIconLeft class="text-main-4" />
          <!-- #8c6b1c #548c76 -->
          <span class="text-main-2 text-16px mx-2 text-weight-medium"
            >Bảng
            {{
              typesRank.find((item) => pathEqual(item.path, route.path))?.name
            }}</span
          >
          <TrendingCardIconRight class="rotate-180deg text-main-4" />
        </div>

        <GenresFilter v-if="data" :filter="data.filter" class="my-3" />
        <template v-if="data && !loading">
          <!-- <div
            v-if="data.maxPage > 1"
            class="flex items-center justify-center q-pa-md"
          >
            <Pagination :max="data.maxPage" v-model="page" />
          </div> -->
          <section class="row mx--2 font-family-poppins">
            <InfiniteScroll @load="onLoad">
              <div
                v-for="(item, index) in data.items"
                :key="item.path"
                class="my-4 col-12 col-md-6 px-2"
              >
                <CardVertical :data="item">
                  <template #inside-image>
                    <Rank :index="index + 42 * (page - 1)" />
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
        </template>
        <template v-else>
          <section class="row mx--2 font-family-poppins">
            <div
              v-for="item in 12"
              :key="item"
              class="my-4 col-12 col-md-6 px-2"
            >
              <CardVerticalSKT />
            </div>
          </section>
        </template>
      </div>
    </section>
  </section>
  <!--
  <BannerTitle>{{ data.name }}</BannerTitle>

<GenresFilter :filter="data.filter" class="my-3" />

<CardVertical v-for="item in data.items" :key="item.path" :data="item" class="my-4" />
<p class="whitespace-pre-wrap">{{ data }}</p> -->
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/top-ngay.json"
import BangXepHangType from "src/apis/nettruyen/runs/[general]"
import { pathEqual } from "src/logic/path-equal"

const route = useRoute()
const router = useRouter()

const props = defineProps<{
  type: string
}>()

const typesRank = [
  {
    name: "Ngày",
    path: "/bang-xep-hang/ngay",
  },
  {
    name: "Tuần",
    path: "/bang-xep-hang/tuan",
  },
  {
    name: "Tháng",
    path: "/bang-xep-hang/thang",
  },
]

const page = computed<number>({
  get: () => parseInt(route.query.page?.toString() ?? "1") || 1,
  set: (page) =>
    router.push({
      ...route,
      query: {
        ...route.query,
        page,
      },
    }),
})

const { data, loading, error } = useRequest(
  async () => {
    const data = await BangXepHangType(props.type, page.value, route.query)
    data.items = shallowReactive(data.items)
    return data
  },
  {
    refreshDeps: [() => props.type, page, () => route.query],
  }
)
const onLoad = useLoadMorePage(
  (page) => BangXepHangType(props.type, page, route.query),
  data,
  page.value
)
watch(error, (error) => {
  if (error?.message === "not_found")
    router.replace({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: "not_found" as any,
      params: {
        catchAll: route.path.split("/").slice(1),
      },
      query: route.query,
      hash: route.hash,
    })
})
</script>

<style lang="scss" scoped>
.main {
  min-height: 640px;
  background: {
    size: 100% 640px;
    image: linear-gradient(
      180deg,
      #f25555 0%,
      #ff7373 23%,
      #ffa466 54%,
      #fafafa 77%,
      #fafafa 100%
    );
    repeat: no-repeat;
  }
  &.dark {
    background-image: linear-gradient(
      180deg,
      #f25555 0%,
      #ff7373 23%,
      #ffa466 54%,
      rgb(25, 25, 25) 77%,
      rgb(25, 25, 25) 100%
    );
  }

  &__header {
    background-image: url(~/assets/trending_header_bg_1.png);
    background-position: top center;
    background-repeat: no-repeat;
    padding: 32px 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.trending-card {
  padding: 2px;
  background: linear-gradient(-180deg, #ffffff 0%, #fafafa 97%);
  &.dark {
    background: linear-gradient(
      -180deg,
      rgb(10, 10, 10) 0%,
      rgb(25, 25, 25) 97%
    );
  }
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;

  @media (max-width: 887px) {
    margin: 0 16px;
  }
  @media (min-width: 888px) {
    margin: 0 24px;
  }

  &__container {
    background: top right / 320px 320px no-repeat
        url(assets/anime-ranking-icon.png),
      linear-gradient(
        -213deg,
        #ffffff 0%,
        #fafafa 19%,
        rgba(250, 250, 250, 0) 41%
      ),
      linear-gradient(-206deg, #faf4e6 0%, #fafafa 43%, #fafafa 95%);
    padding: 32px 40px 48px;

    @media (max-width: 887px) {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
  &.dark {
    .trending-card__container {
      background: top right / 320px 320px no-repeat
          url(assets/anime-ranking-icon.png),
        linear-gradient(
          -213deg,
          rgb(10, 10, 10) 0%,
          rgb(25, 25, 25) 19%,
          rgba(250, 250, 250, 0) 41%
        ),
        linear-gradient(
          -206deg,
          rgb(10, 22, 40) 0%,
          rgb(25, 25, 25) 43%,
          rgb(25, 25, 25) 95%
        );
    }
  }
}
</style>
