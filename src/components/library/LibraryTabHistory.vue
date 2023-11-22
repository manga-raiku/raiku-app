<template>
  <q-card class="transparent min-h-0 shadow-none overflow-y-auto">
    <q-infinite-scroll
      v-if="data && !loading"
      @load="onLoad"
      :offset="250"
      class="row"
    >
      <template v-for="(item, index) in data" :key="item.manga_param">
        <div
          v-if="!data[index - 1]?.updated_at.isSame(item.updated_at, 'day')"
          class="col-12 text-1em mb-1.2 text-weight-normal text-gray-300"
        >
          {{
            item.updated_at.isToday()
              ? $t("hom-nay")
              : item.updated_at.isYesterday()
              ? $t("hom-qua")
              : `${item.updated_at.get("d")} thg ${item.updated_at.get(
                  "months"
                )}`
          }}
        </div>
        <div class="col-12 col-sm-6 px-2 pb-4">
          <ItemBasicHistory
            :comic="item.manga_param"
            :name="item.manga_name"
            :image="item.image"
            :history="{
              name: item.last_ch_name,
              param: item.last_ch_param,
              updated_at: item.$updated_at
            }"
            :source-id="item.source_id"
          />
        </div>
      </template>
      <template #loading>
        <div class="col-12 justify-center flex q-my-md">
          <q-spinner-dots color="sakura3" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <ErrorDisplay
      v-else-if="error"
      :error="error"
      :retry-async="refreshAsync"
    />
    <div v-else class="row">
      <CardVerticalSKT
        v-for="i in 12"
        :key="i"
        class="col-12 col-sm-6 px-2 pb-4"
      />
    </div>
  </q-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  visible?: boolean
}>()

const historyStore = useHistoryStore()

const { error, data, loading, refreshAsync } = useRequest(
  () =>
    historyStore.get().then((res) =>
      res.map((item) => ({
        ...item,
        $updated_at: item.updated_at,
        updated_at: dayjs(item.updated_at)
      }))
    ),
  {
    manual: props.visible !== undefined
  }
)
watch(
  () => props.visible,
  (visible) => {
    if (visible === undefined) return

    if (visible && !data.value) void refreshAsync()
  },
  { immediate: true }
)
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await historyStore.get(data.value?.length).then((res) =>
    res.map((item) => ({
      ...item,
      $updated_at: item.updated_at,
      updated_at: dayjs(item.updated_at)
    }))
  )

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
