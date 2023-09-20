<route lang="yaml">
alias: ["/tim-truyen/:slug?"]
meta:
  hiddenHeader: isNative or ($lt.md and isPWA)
  revealHeader: true
</route>

<template>
  <q-page padding>
    <template v-if="!data">
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

      <InfiniteScroll v-if="data" @load="onLoad">
        <GridCard :items="data.items" />
      </InfiniteScroll>
      <ErrorDisplay v-else-if="error" :error="error" :retry-async="runAsync" />
      <SkeletonGridCard v-else :count="40" />

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
import "@fontsource/poppins"
import type { MetaManga } from "raiku-pgs"

const props = defineProps<{
  sourceId: string
  slug?: string
}>()

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const pluginStore = usePluginStore()

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

const { data, runAsync, error } = useRequest(
  async () => {
    const data = await (
      await pluginStore.get(props.sourceId)
    ).plugin.getCategory(
      props.slug ?? "",
      page.value,
      route.query as Record<string, string>,
    )
    return {
      ...data,
      items: shallowReactive(data.items),
    } as Omit<typeof data, "items"> & {
      items: MetaManga[]
    }
  },
  {
    refreshDeps: [() => props.slug, () => route.query],
    refreshDepsAction() {
      runAsync()
    },
  },
)
const onLoad = useLoadMorePage(
  (page) =>
    pluginStore
      .get(props.sourceId)
      .then((res) =>
        res.plugin.getCategory(
          props.slug ?? "",
          page,
          route.query as Record<string, string>,
        ),
      ),
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

const title = () =>
  i18n.t("the-loai-name", [
    data.value ? data.value.name ?? i18n.t("tat-ca") : "",
  ])
const description = () => data.value?.description
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>
