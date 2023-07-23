<route lang="yaml">
meta:
  padding: true
</route>

<template>
  <section class="mx-6">
    <template v-if="!data">
      <BannerTitleSKT />
      <q-skeleton type="text" width="220px" class="mt-3" />

      <SkeletonGridCard :count="40" />
    </template>
    <template v-else>
      <BannerTitle>{{ data.name }}</BannerTitle>
      <p class="mt-3 font-family-poppins">{{ data.description }}</p>

      <!-- filter -->
      <GenresFilter :filter="data.filter" class="my-3" />
      <!-- /filter -->

      <div
        v-if="data.maxPage > 1"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div>

      <SkeletonGridCard v-if="loading" :count="40" />
      <GridCard v-else :items="data.items" />

      <div
        v-if="data.maxPage > 1"
        class="flex items-center justify-center q-pa-md"
      >
        <Pagination :max="data.maxPage" v-model="page" />
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/the-loai/fantacy-30.json"
import TheLoaiType from "src/apis/runs/the-loai/[type]"
import "@fontsource/poppins"

const props = defineProps<{
  slug: string
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

const { data, loading, runAsync, error } = useRequest(() =>
  TheLoaiType(props.slug, page.value, route.query)
)
watch(
  [
    () => props.slug,
    () => new URLSearchParams(route.query as Record<string, string>).toString(),
  ],
  () => runAsync()
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
