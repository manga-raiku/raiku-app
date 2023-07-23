<route lang="yaml">
meta:
  padding: true
</route>

<template>
  <section class="mx-6">
    <BannerTitle>Đang theo dõi</BannerTitle>

    <div
      v-if="data && data.maxPage > 1"
      class="flex items-center justify-center q-pa-md"
    >
      <Pagination :max="data.maxPage" v-model="page" />
    </div>

    <section class="row mx--2 font-family-poppins">
      <div
        v-if="loading || !data"
        v-for="i in 12"
        :key="i"
        class="my-4 col-12 col-md-4 col-sm-6 px-2"
      >
        <CardVerticalSKT class="mb-4" />
      </div>
      <div
        v-else
        v-for="item in data?.items"
        :key="item.path"
        class="my-4 col-12 col-md-4 col-sm-6 px-2"
      >
        <CardVertical :data="item" read-continue class="mb-4" />
      </div>
    </section>

    <div
      v-if="data && data.maxPage > 1"
      class="flex items-center justify-center q-pa-md"
    >
      <Pagination :max="data.maxPage" v-model="page" />
    </div>
  </section>
</template>

<script lang="ts" setup>
// import data from "src/apis/parsers/__test__/assets/the-loai/fantacy-30.json"
import LichSu from "src/apis/runs/lich-su"
import "@fontsource/poppins"

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

const { data, loading, error } = useRequest(() => LichSu(page.value), {
  refreshDeps: [page],
})
</script>
