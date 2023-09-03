<template>
  <q-card class="transparent min-h-0 shadow-none overflow-y-auto">
    <q-card-section>
      <CardVerticalSKT v-if="loading" v-for="j in 12" :key="j" class="mb-4" />
      <div v-else-if="data">
        <q-infinite-scroll @load="onLoad" :offset="250">
          <ItemBasicHistory
            v-for="item in data"
            :key="item.path"
            :path="item.path"
            :name="item.manga_name"
            :image="item.image"
            :history="item.history"
          />
          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="main-3" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <div v-else class="text-center">
        <div class="text-subtitle1 font-weight-medium">Lỗi không xác định</div>
        <q-btn outline rounded color="main" @click="refreshAsync"
          >Thử lại</q-btn
        >
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
const followStore = useFollowStore()

const { loading, data, refreshAsync } = useRequest(() => followStore.get())
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  const more = await followStore.get(data.value?.at(-1)?.id)

  data.value?.push(...more)
  if (more.length === 0) done(true)
  done()
}
</script>
