<route lang="yaml">
alias: ["/tim-truyen/:slug?"]
meta:
  hiddenHeader: false
  revealHeader: true
</route>

<template>
  <q-page padding>
      <template v-if="!data">
        <BannerTitleSKT v-if="!isCapacitor" />
        <q-skeleton type="text" width="220px" class="mt-3" />

        <SkeletonGridCard :count="40" />
      </template>
      <template v-else>
        <GenresFilterNative :filter="data.filters" />

        <p class="mt-80px font-family-poppins">{{ data.description }}</p>

        <!-- filter native -->
        <!-- /filter native -->

        <!--
      <div
        v-if="data.maxPage > 1 && $q.screen.gt.sm"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div> -->

        <SkeletonGridCard v-if="loading" :count="40" />
        <InfiniteScroll v-else @load="onLoad">
          <GridCard :items="data.items"  />
        </InfiniteScroll>

        <!-- <div
        v-if="data.maxPage > 1 && $q.screen.gt.sm"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div> -->
      </template>
  </q-page>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/the-loai/fantacy-30.json"
import General from "src/apis/nettruyen/runs/[general]"
import "@fontsource/poppins"
import { isCapacitor } from "src/constants"

const props = defineProps<{
  slug?: string
}>()

const route = useRoute()
const router = useRouter()

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

const { data, loading, runAsync, error } = useRequest(
  async () => {
    const data = await General(
      `/tim-truyen/${props.slug}`,
      page.value,
      route.query,
    )
    data.items = shallowReactive(data.items)
    return data
  },
  {
    refreshDeps: [() => props.slug, () => route.query],
    refreshDepsAction() {
      runAsync()
    },
  },
)
const onLoad = useLoadMorePage(
  (page) => General(`/tim-truyen/${props.slug}`, page, route.query),
  data,
  page.value,
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

const showFilterFull = ref(false)
</script>
