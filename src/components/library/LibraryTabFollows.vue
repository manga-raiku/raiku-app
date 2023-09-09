<template>
  <q-card class="transparent min-h-0 shadow-none overflow-y-auto">
    <div v-if="data">
      <q-infinite-scroll @load="onLoad" :offset="250" class="row">
        <div
          v-for="item in data"
          :key="item.path"
          class="col-12 col-sm-6 px-2 pb-4"
        >
          <ItemBasicHistory
            :path="item.path"
            :name="item.manga_name"
            :image="item.image"
            :history="item.history"
          />
        </div>
        <template #loading>
          <div class="col-12 justify-center flex q-my-md">
            <q-spinner-dots color="main-3" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <div v-else-if="error" class="text-center">
      <div class="text-subtitle1 font-weight-medium">Lỗi không xác định</div>
      <q-btn outline rounded color="main" @click="refreshAsync">Thử lại</q-btn>
    </div>
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

const { data, error, refreshAsync } = useRequest(
  () => followStore.get(),
  {
    manual: props.visible !== undefined,
  },
)
watch(
  () => props.visible,
  (visible) => {
    if (visible === undefined) return

    if (visible && !data.value) refreshAsync()
  },
  { immediate: true },
)
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await followStore.get(data.value?.length)

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
