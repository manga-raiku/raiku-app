<route lang="yaml">
meta:
  padding: true
</route>

<template>
  <section class="mx-6">
    <BannerTitle>{{ data.name }}</BannerTitle>
    <p class="mt-3 font-family-poppins">{{ data.description }}</p>

    <!-- filter -->
    <GenresFilter :filter="data.filter" class="my-3" />
    <!-- /filter -->

    <div class="flex items-center justify-center q-pa-md">
      <Pagination :max="data.maxPage" v-model="page" />
    </div>

    <GridCard :items="data.items" />

    <div class="flex items-center justify-center q-pa-md">
      <Pagination :max="data.maxPage" v-model="page" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import data from "src/apis/parsers/__test__/assets/the-loai/fantacy-30.json"

import "@fontsource/poppins"

defineProps<{
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
</script>
