<template>
  <q-card class="transparent min-h-0 shadow-none overflow-y-auto">
    <div v-if="data && !loading">
      <q-infinite-scroll @load="onLoad" :offset="250" class="row">
        <div
          v-for="item in data"
          :key="item.manga_param"
          class="col-12 col-sm-6 px-2 pb-4"
        >
          <ItemBasicHistory
            class="mb-4"
            :comic="item.manga_param"
            :name="item.manga_name"
            :image="item.image"
            :history="item.history"
            :source-id="item.source_id"
          />
        </div>
        <template #loading>
          <div class="col-12 justify-center flex q-my-md">
            <q-spinner-dots color="sakura3" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
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

const followStore = useFollowStore()

const { data, error, loading, refreshAsync } = useRequest(
  () => followStore.get(),
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
  const more = await followStore.get(data.value?.length)

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
